export default {
    preset: 'ts-jest',
    verbose: true,
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    transform: {
        '^.+\\.(ts)$': 'ts-jest',
    },
    coverageThreshold: {
        global: {
            branches: 95,
            functions: 95,
            lines: 95,
        },
    },
    coveragePathIgnorePatterns: ['src/types'],
    collectCoverageFrom: ['src/**/*.ts'],
};
