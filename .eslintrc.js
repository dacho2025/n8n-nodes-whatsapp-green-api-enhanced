module.exports = {
	root: true,
	env: {
		browser: true,
		es6: true,
		node: true,
	},
	extends: [
		'eslint:recommended',
	],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	rules: {
		'no-unused-vars': 'off',
		'no-console': 'off',
		'no-undef': 'off',
	},
	ignorePatterns: [
		'dist/**/*',
		'node_modules/**/*',
	],
};