module.exports = {
	root: true,
	env: {
		node: true
	},
	extends: ["plugin:vue/essential", "plugin:vue/recommended", "eslint:recommended", "@vue/typescript/recommended"],
	parserOptions: {
		ecmaVersion: 2020
	},

	rules: {
		"no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
		"no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",
		"vue/html-indent": ["error", "tab"],
		"vue/script-indent": ["error", "tab"],
		"vue/require-default-prop": 0,
		"@typescript-eslint/no-var-requires": "warn",
		"@typescript-eslint/no-inferrable-types": 0,
		"indent": [2, "tab", {
			FunctionDeclaration: {
				parameters: "first"
			},
			FunctionExpression: {
				parameters: "first"
			},
			SwitchCase: 1
		}],

		"@typescript-eslint/indent": [
			"warn",
			"tab",
			{
				FunctionDeclaration: {
					parameters: "first"
				},
				FunctionExpression: {
					parameters: "first"
				},
				SwitchCase: 1
			}
		],
		"vue/no-v-html": 0,

		"no-underscore-dangle": 0,

		"linebreak-style": ["error", "unix"],
		"no-undef": [
			"error",
			{
				typeof: true
			}
		],

		"no-async-promise-executor": 0,

		"quotes": ["error", "double"],
		"@typescript-eslint/explicit-module-boundary-type": 0,
		"@typescript-eslint/explicit-module-boundary-types": 0,
		"no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_"
			}
		],

		"@typescript-eslint/no-unused-vars": [
			"warn",
			{
				argsIgnorePattern: "^_",
				varsIgnorePattern: "^_",
				caughtErrorsIgnorePattern: "^_"
			}
		],
		"@typescript-eslint/camelcase": 0,

		"quote-props": ["warn", "consistent-as-needed"],

		"@typescript-eslint/ban-ts-comment": 0,
		"@typescript-eslint/ban-ts-ignore": 0,
		"@typescript-eslint/interface-name-prefix": 0,

		"@typescript-eslint/adjacent-overload-signatures": "warn",
		"@typescript-eslint/array-type": [
			"warn",
			{
				default: "array-simple"
			}
		],
		"@typescript-eslint/ban-types": [
			"warn",
			{
				types: {
					Object: {
						message: "Avoid using the `Object` type. Did you mean `object`?"
					},
					Function: {
						message: "Avoid using the `Function` type. Prefer a specific function type, like `() => void`."
					},
					Boolean: {
						message: "Avoid using the `Boolean` type. Did you mean `boolean`?"
					},
					Number: {
						message: "Avoid using the `Number` type. Did you mean `number`?"
					},
					String: {
						message: "Avoid using the `String` type. Did you mean `string`?"
					},
					Symbol: {
						message: "Avoid using the `Symbol` type. Did you mean `symbol`?"
					}
				}
			}
		],
		"@typescript-eslint/consistent-type-assertions": "warn",
		"@typescript-eslint/consistent-type-definitions": "warn",
		"@typescript-eslint/explicit-member-accessibility": [
			"warn",
			{
				accessibility: "explicit"
			}
		],

		"@typescript-eslint/member-delimiter-style": [
			"warn",
			{
				multiline: {
					delimiter: "semi",
					requireLast: true
				},
				singleline: {
					delimiter: "semi",
					requireLast: false
				}
			}
		],
		"@typescript-eslint/member-ordering": "warn",
		"@typescript-eslint/naming-convention": 0,
		"@typescript-eslint/no-empty-function": "warn",
		"@typescript-eslint/no-empty-interface": "warn",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-misused-new": "warn",
		"@typescript-eslint/no-namespace": "warn",
		"@typescript-eslint/no-parameter-properties": "off",
		"@typescript-eslint/no-unused-expressions": "warn",
		"@typescript-eslint/no-use-before-define": "off",
		"@typescript-eslint/prefer-for-of": "warn",
		"@typescript-eslint/prefer-function-type": "warn",
		"@typescript-eslint/prefer-namespace-keyword": "warn",
		"@typescript-eslint/quotes": [
			"warn",
			"double",
			{
				avoidEscape: true
			}
		],
		"@typescript-eslint/semi": ["warn", "always"],
		"@typescript-eslint/triple-slash-reference": [
			"warn",
			{
				path: "always",
				types: "prefer-import",
				lib: "always"
			}
		],
		"@typescript-eslint/type-annotation-spacing": "warn",
		"@typescript-eslint/unified-signatures": "warn",
		"arrow-body-style": "warn",
		"arrow-parens": ["warn", "as-needed"],
		"brace-style": ["warn", "1tbs"],
		"comma-dangle": "off",
		"complexity": "off",
		"constructor-super": "warn",
		"curly": "warn",
		"eol-last": "warn",
		"eqeqeq": ["warn", "smart"],
		"guard-for-in": "warn",
		"id-blacklist": 0,
		"id-match": "warn",
		"import/order": "off",
		"max-classes-per-file": ["warn", 1],
		"max-len": "off",
		"new-parens": "warn",
		"no-bitwise": "warn",
		"no-caller": "warn",
		"no-cond-assign": "warn",
		"no-empty": "warn",
		"no-eval": "warn",
		"no-fallthrough": "off",
		"no-invalid-this": "off",
		"no-multiple-empty-lines": "off",
		"no-new-wrappers": "warn",
		"no-shadow": [
			"warn",
			{
				hoist: "all"
			}
		],
		"no-throw-literal": "warn",
		"no-trailing-spaces": "warn",
		"no-undef-init": "warn",
		"no-unsafe-finally": "warn",
		"no-unused-labels": "warn",
		"no-var": "warn",
		"object-shorthand": "warn",
		"one-var": ["warn", "never"],
		"prefer-const": "warn",
		"radix": "error",
		"space-before-function-paren": [
			"warn",
			{
				anonymous: "never",
				asyncArrow: "always",
				named: "never"
			}
		],
		"spaced-comment": [
			"warn",
			"always",
			{
				markers: ["/"]
			}
		],
		"use-isnan": "warn",
		"valid-typeof": "off"
	}
};
