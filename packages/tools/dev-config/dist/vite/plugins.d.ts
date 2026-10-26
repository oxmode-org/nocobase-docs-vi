import { type ConfigEnv, type PluginOption } from 'vite';
export interface AppVitePluginRegistration {
    readonly packageName: string;
    /**
     * The options the application passed to the plugin's factory call.
     *
     * Only statically writable values are readable here: the declaration is
     * parsed, never executed, so an argument that is not a literal object of
     * literal values leaves this undefined rather than half-populated.
     */
    readonly config?: Readonly<Record<string, unknown>>;
}
export interface AppVitePluginContext {
    readonly appRoot: string;
    readonly environment: ConfigEnv;
    readonly registration: AppVitePluginRegistration;
}
export type AppVitePluginFactory = (context: AppVitePluginContext) => PluginOption | Promise<PluginOption>;
export interface LoadAppVitePluginsOptions {
    readonly appRoot: string;
    readonly environment: ConfigEnv;
}
export declare function loadAppVitePlugins(options: LoadAppVitePluginsOptions): Promise<readonly PluginOption[]>;
//# sourceMappingURL=plugins.d.ts.map