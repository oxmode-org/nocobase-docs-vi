var __rewriteRelativeImportExtension = (this && this.__rewriteRelativeImportExtension) || function (path, preserveJsx) {
    if (typeof path === "string" && /^\.\.?\//.test(path)) {
        return path.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i, function (m, tsx, d, ext, cm) {
            return tsx ? preserveJsx ? ".jsx" : ".js" : d && (!ext || !cm) ? m : (d + ext + "." + cm.toLowerCase() + "js");
        });
    }
    return path;
};
import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { resolve } from 'import-meta-resolve';
import ts from 'typescript';
import { runnerImport } from 'vite';
import { fileURLToPath } from 'node:url';
// Read declarations without importing browser code into the Vite config process.
async function registrations(appRoot) {
    const file = path.join(appRoot, 'client/plugins.ts');
    let text;
    try {
        text = await fs.readFile(file, 'utf8');
    }
    catch (error) {
        // An application that registers no client plugins contributes none. This
        // runs while Vite is resolving its config, so throwing here would fail the
        // whole build rather than the feature nothing asked for.
        if (error.code === 'ENOENT')
            return [];
        throw error;
    }
    const source = ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true);
    const factories = new Map();
    const definers = new Set();
    for (const statement of source.statements) {
        if (!ts.isImportDeclaration(statement) ||
            !ts.isStringLiteral(statement.moduleSpecifier) ||
            statement.importClause?.isTypeOnly)
            continue;
        const specifier = statement.moduleSpecifier.text;
        const name = statement.importClause?.name?.text;
        if (name &&
            /^(?:@[^/]+\/)?[^./][^/]*\/client(?:\/plugin)?$/.test(specifier))
            factories.set(name, specifier.replace(/\/client(?:\/plugin)?$/, ''));
        const bindings = statement.importClause?.namedBindings;
        if (specifier === '@nocobase/app-client/plugins' &&
            bindings &&
            ts.isNamedImports(bindings)) {
            for (const item of bindings.elements)
                if ((item.propertyName ?? item.name).text === 'defineClientPlugins')
                    definers.add(item.name.text);
        }
    }
    const result = [];
    const visit = (node) => {
        if (ts.isCallExpression(node) &&
            ts.isIdentifier(node.expression) &&
            definers.has(node.expression.text)) {
            const array = node.arguments[0];
            if (!array || !ts.isArrayLiteralExpression(array))
                throw new Error(`${file}: Vite contributions require a static defineClientPlugins array`);
            for (const item of array.elements) {
                if (!ts.isCallExpression(item) || !ts.isIdentifier(item.expression))
                    throw new Error(`${file}: Vite contributions require explicit plugin factory calls`);
                const packageName = factories.get(item.expression.text);
                if (!packageName)
                    continue;
                const [options] = item.arguments;
                const config = options && ts.isObjectLiteralExpression(options)
                    ? literalObject(options)
                    : null;
                result.push({
                    packageName,
                    ...(config === null ? {} : { config: Object.freeze(config) }),
                });
            }
        }
        ts.forEachChild(node, visit);
    };
    visit(source);
    return result;
}
/**
 * Read a JSON-compatible literal, or report that it is not one.
 *
 * A factory argument is ordinary TypeScript and may hold identifiers, calls or
 * spreads. Those describe runtime behavior a Vite contribution has no way to
 * evaluate while the config is still resolving, so they are refused here
 * instead of being approximated.
 */
function literalValue(node) {
    if (ts.isStringLiteralLike(node))
        return { value: node.text };
    if (ts.isNumericLiteral(node))
        return { value: Number(node.text) };
    if (node.kind === ts.SyntaxKind.TrueKeyword)
        return { value: true };
    if (node.kind === ts.SyntaxKind.FalseKeyword)
        return { value: false };
    if (node.kind === ts.SyntaxKind.NullKeyword)
        return { value: null };
    if (ts.isPrefixUnaryExpression(node) &&
        node.operator === ts.SyntaxKind.MinusToken &&
        ts.isNumericLiteral(node.operand))
        return { value: -Number(node.operand.text) };
    if (ts.isArrayLiteralExpression(node)) {
        const items = [];
        for (const element of node.elements) {
            const item = literalValue(element);
            if (!item)
                return null;
            items.push(item.value);
        }
        return { value: items };
    }
    if (ts.isObjectLiteralExpression(node)) {
        const record = literalObject(node);
        return record === null ? null : { value: record };
    }
    return null;
}
function literalObject(node) {
    const record = {};
    for (const property of node.properties) {
        if (!ts.isPropertyAssignment(property))
            return null;
        const name = property.name;
        const key = ts.isIdentifier(name)
            ? name.text
            : ts.isStringLiteralLike(name)
                ? name.text
                : null;
        if (key === null)
            return null;
        const value = literalValue(property.initializer);
        if (!value)
            return null;
        record[key] = value.value;
    }
    return record;
}
/**
 * Locate a registered package's manifest the way Node locates the package.
 *
 * Resolving `<name>/package.json` would go through the package's `exports`,
 * and a package is free not to export its manifest. Whether it offers a Vite
 * contribution is only a question about that map, so read the file directly
 * rather than letting one such package fail the application's Vite config.
 */
async function findPackageJson(appRoot, packageName) {
    for (let directory = path.resolve(appRoot);;) {
        const candidate = path.join(directory, 'node_modules', packageName, 'package.json');
        try {
            await fs.access(candidate);
            return candidate;
        }
        catch {
            // Keep walking up, as Node does for an unresolved bare specifier.
        }
        const parentDirectory = path.dirname(directory);
        if (parentDirectory === directory)
            throw new Error(`${packageName} is registered in client/plugins.ts but is not installed`);
        directory = parentDirectory;
    }
}
export async function loadAppVitePlugins(options) {
    const parent = pathToFileURL(path.join(options.appRoot, 'package.json')).href;
    const result = [];
    for (const registration of await registrations(options.appRoot)) {
        const packageJson = JSON.parse(await fs.readFile(await findPackageJson(options.appRoot, registration.packageName), 'utf8'));
        if (!packageJson.exports || !Object.hasOwn(packageJson.exports, './vite'))
            continue;
        const entryUrl = resolve(`${registration.packageName}/vite`, parent);
        // Workspace exports can point to TypeScript with .js source specifiers.
        const entry = entryUrl.endsWith('.ts')
            ? (await runnerImport(fileURLToPath(entryUrl), { root: options.appRoot, configFile: false })).module
            : (await import(__rewriteRelativeImportExtension(entryUrl)));
        if (typeof entry.default !== 'function')
            throw new Error(`Vite contribution for ${registration.packageName} must default-export a factory`);
        result.push(await entry.default({
            appRoot: options.appRoot,
            environment: options.environment,
            registration,
        }));
    }
    return result;
}
//# sourceMappingURL=plugins.js.map