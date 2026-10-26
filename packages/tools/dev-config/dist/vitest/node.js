import { mergeConfig } from 'vitest/config';
import { sharedHookTimeout, sharedTestTimeout } from './timeouts.js';
const nodeConfig = {
    test: {
        environment: 'node',
        exclude: ['**/node_modules/**', '**/dist/**', '**/build/**'],
        testTimeout: sharedTestTimeout,
        hookTimeout: sharedHookTimeout,
    },
};
export const createNodeVitestConfig = (localConfig = {}) => mergeConfig(nodeConfig, localConfig);
//# sourceMappingURL=node.js.map