module.exports = {
  // Use the TypeScript-aware ESLint parser
  parser: '@typescript-eslint/parser',
  // Specify the files to which these settings apply
  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parserOptions: {
        // Specify your project's tsconfig path
        project: ['./tsconfig.json'],
        // Set up parserOptions for tsx files
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  ],
  // Use the React, TypeScript, and recommended ESLint configurations
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  // Configure plugins for React and TypeScript
  plugins: ['react', '@typescript-eslint'],
  settings: {
    react: {
      version: 'detect', // Automatically detect the React version
    },
  },
  // Add any custom rules or overrides here
  rules: {
    // Example: disable a rule that's not needed for modern React
    'react/react-in-jsx-scope': 'off',
  },
};
