module.exports = {
	extends: [ 
		'alloy',
		'alloy/react',
		'alloy/typescript',],
	env: {
		browser: true,
		commonjs: true,
		node: true,
		es6: true,
	},
	globals: {
		__DEV__: true,
	},
	parserOptions: {
		ecmaVersion: 6,
		sourceType: 'module',
		ecmaFeatures: {
			jsx: true,
			experimentalObjectRestSpread: true,
		},
	},
	rules: {
		/**
		 *  "off" or 0 - turn the rule off
		 */

		//
		'arrow-parens': [0, 'as-needed'], // 8.2
		'max-params': 0,
		'member-ordering': 0,
		'no-param-reassign': [0, { props: false }], // 7.10
		'no-return-await': 0,
		'no-tabs': 0,
		'no-async-promise-executor': 0,
		'no-unmodified-loop-condition': 0,
		semi: [0, 'never'], // 19.1
		'@typescript-eslint/member-ordering': 0,
		'@typescript-eslint/explicit-member-accessibility': 0,
		'@typescript-eslint/no-require-imports': 0,
		'@typescript-eslint/class-name-casing': 0,
		'@typescript-eslint/no-inferrable-types': 0,
		'@typescript-eslint/consistent-type-assertions': 0,
		'@typescript-eslint/prefer-optional-chain': 0,
		/**
		 *  "warn" or 1 - turn the rule on as a warning (doesn’t affect exit code)
		 */
		'array-bracket-spacing': 1, // 17.7
		'arrow-body-style': 1,
		'brace-style': 1, // 16.2
		'block-spacing': [1, 'always'], // 17.9
		'comma-dangle': [1, 'only-multiline'], // 18.2
		camelcase: 1, // 驼峰式命名
		eqeqeq: [1, 'always', { null: 'ignore' }], // 15.1
		'func-call-spacing': 1, // 17.12
		'guard-for-in': 1,

		indent: [1, 'tab', { SwitchCase: 1 }], // 17.1
		'keyword-spacing': 1, // 17.3
		'key-spacing': 1, // 17.13
		'no-multi-spaces': 1, // 禁止多余空格
		'no-console': 1, // 禁止console
		'no-case-declarations': 1, // 15.3
		'no-unneeded-ternary': 1, // 15.4
		'no-prototype-builtins': 1, // 3.6
		'nonblock-statement-body-position': 1, // 16.1
		'no-else-return': 1, // 16.3
		'no-eq-null': 1,
		'no-lone-blocks': 1,
		'no-useless-constructor': 1, // 9.3
		'no-trailing-spaces': 1, // 17.14
		'object-curly-spacing': [1, 'always'], // 17.8
		'object-shorthand': 1, // 3.2
		'prefer-const': 1,
		'prefer-destructuring': 1, // 5.1
		'prefer-template': 1, // 6.3
		'prefer-rest-params': 1, // 7.5
		'prefer-spread': 1, // 7.12
		'prefer-promise-reject-errors': 1,
		radix: 1,
		'space-in-parens': 1, // 17.6
		'space-before-blocks': [1], // 17.2
		'wrap-iife': [1, 'any'], // 7.2
		'@typescript-eslint/no-dynamic-delete': 1,
		'@typescript-eslint/no-useless-constructor': 1,
		'prefer-regex-literals': 1,
		/**
		 * "error" or 2 - turn the rule on as an error (exit code is 1 when triggered)
		 */
		'arrow-spacing': 2, // 8.1
		'array-callback-return': 2, // 4.4
		'arrow-body-style': [2, 'as-needed'], // 8.2
		'block-scoped-var': 2, // 块语句中使用var
		curly: [2, 'all'], // 必须使用 if(){} 中的{}
		'no-debugger': 2, // 禁止使用debugger
		'no-dupe-args': 2, // 函数参数不能重复
		'no-dupe-keys': 2, // 在创建对象字面量时不允许键重复 {a:1,a:1}
		'no-multi-assign': 2, // 13.5
		'no-const-assign': 2, // 2.1
		'no-unused-vars': 2, // 13.8
		'no-var': 2, // 2.2  "no-self-compare": 2, // 不能比较自身
		'no-sequences': 2, // 禁止使用逗号运算符
		'no-throw-literal': 2, // 禁止抛出字面量错误 throw "error";
		'no-loop-func': 2, // 禁止在循环中使用函数（如果没有引用外部变量不形成闭包就可以）
		'no-warning-comments': [
			2,
			{
				// 不能有警告备注
				terms: ['todo', 'fixme', 'any other term'],
				location: 'anywhere',
			},
		],
		'prefer-arrow-callback': 2, // 8.1
		'padded-blocks': [2, 'never'], // 17.5
		'quote-props': [2, 'as-needed'], // 3.5
		quotes: [1, 'single', { avoidEscape: true, allowTemplateLiterals: true }],
		'space-infix-ops': 2, // 17.4
		'@typescript-eslint/no-unused-vars': [2, { args: 'none' }], // 定义但是未被使用警告 过滤接口的警告
	},
};
