import path from 'path';
import fs from 'fs';
import ts from 'rollup-plugin-typescript2';
import cjs from '@rollup/plugin-commonjs';

const packagePath = path.resolve(__dirname, '../../packages');
const distPath = path.resolve(__dirname, '../../dist/node_modules');

// 用于获取dev环境中packages下包的路径, 以及打包过后产物的路径
export function getPackagePath(packageName, isDist) {
	if (isDist) {
		return `${distPath}/${packageName}`;
	}
	return `${packagePath}/${packageName}`;
}

// 用于获取packages下包的package.json文件, 返回该json的对象
export function getPackageJson(packageName) {
	const path = `${getPackagePath(packageName)}/package.json`;
	const dateString = fs.readFileSync(path, { encoding: 'utf-8' });
	return JSON.parse(dateString);
}

export function getBaseRollupPlugins({ tsConfig = {} } = {}) {
	return [cjs(), ts(tsConfig)];
}
