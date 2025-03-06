/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
import { fixupConfigRules } from '@eslint/compat';
import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
	baseDirectory: __dirname,
	recommendedConfig: js.configs.recommended,
	allConfig: js.configs.all,
});

export default [
	...fixupConfigRules(
		compat.extends(
			'airbnb',
			'eslint:recommended',
			'plugin:react/recommended',
			'plugin:react-hooks/recommended',
			'plugin:prettier/recommended'
		)
	),
	{
		languageOptions: {
			globals: {
				...globals.browser,
			},

			ecmaVersion: 'latest',
			sourceType: 'module',
		},

		rules: {
			indent: ['error', 'tab'],
			'no-tabs': 'off',
			'react/jsx-indent': [2, 'tab'],
			'react/jsx-indent-props': [2, 'tab'],
			'react/react-in-jsx-scope': 'off',
		},
	},
	{
		files: ['**/.eslintrc.{js,cjs}'],
	},
];
