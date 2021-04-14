/*
 * @Author: 某时橙
 * @Date: 2021-04-10 16:02:53
 * @LastEditTime: 2021-04-14 21:55:00
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\rollup.config.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import babel from 'rollup-plugin-babel';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';

export default {
  input: "src/index.js",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name:'ExArr'
  },
  plugins: [  
    resolve({
      mainFields: ['jsnext', 'main'],
      browser: true,
    }),
    commonjs(),
    // babel({
    //   exclude: 'node_modules/**' 
    // }),
  ],
  sourceMap:true
};
   