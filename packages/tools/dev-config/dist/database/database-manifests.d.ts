export interface DatabaseManifestBuildOptions {
    /** Source database tree, including connection-specific subdirectories. */
    readonly sourceDir: string;
    /** Corresponding compiled database tree, after all JavaScript rewriting. */
    readonly outputDir: string;
}
/** Seals compiled migration and seed directories with their source identities. */
export declare function generateDatabaseManifests(options: DatabaseManifestBuildOptions): Promise<void>;
//# sourceMappingURL=database-manifests.d.ts.map