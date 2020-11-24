import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import image from '@rollup/plugin-image';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';

export default {
	input: 'src/main.ts',
	output: [
		{
			file: 'lib/index.js',
			format: 'cjs',
			sourcemap: true
		},
		{
			file: 'lib/module.js',
			format: 'esm',
			sourcemap: true
		}
	],
	plugins: [
		peerDepsExternal(),
		resolve(),
		image(),
		commonjs(),
		typescript({ useTsconfigDeclarationDir: true }),
		postcss()
	]
};
