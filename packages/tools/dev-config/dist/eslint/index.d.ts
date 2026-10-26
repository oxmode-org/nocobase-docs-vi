import type { Linter } from 'eslint';
export interface SharedConfigOptions {
    tsconfigRootDir?: string;
    ignores?: string[];
    rules?: Linter.Config['rules'];
    overrides?: Linter.Config[];
    environment?: Linter.Config[];
}
export declare const base: Linter.Config[];
export declare const typescript: Linter.Config[];
export declare const typeChecked: Linter.Config[];
export declare const node: Linter.Config[];
export declare const react: Linter.Config[];
/** Browser source must work on plain HTTP as well as secure origins. */
export declare const browserApis: Linter.Config[];
export declare const vitest: Linter.Config[];
/**
 * Commands in an application's or a plugin's `cli/` run inside the `nocobase` command line, which owns stdout and puts
 * the application away after the command. Each rule names what to use instead of the thing it refuses.
 */
export declare const commandRules: Linter.Config[];
export declare const createNodeLibraryConfig: (options?: SharedConfigOptions) => Linter.Config[];
export declare const createUniversalLibraryConfig: (options?: SharedConfigOptions) => Linter.Config[];
export declare const createClientLibraryConfig: (options?: SharedConfigOptions) => Linter.Config[];
export declare const createShadcnRegistryConfig: (root?: string) => Linter.Config[];
export declare const createApplicationConfig: (options?: SharedConfigOptions) => Linter.Config[];
//# sourceMappingURL=index.d.ts.map