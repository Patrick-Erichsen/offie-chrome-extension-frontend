export default {
    verbose: true,
    preset: 'ts-jest',
    moduleFileExtensions: ['js', 'ts', 'tsx'],
    moduleDirectories: ['node_modules', 'src'],
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
