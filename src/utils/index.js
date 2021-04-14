/*
 * @Author: 某时橙
 * @Date: 2021-04-11 21:08:29
 * @LastEditTime: 2021-04-14 19:00:40
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\utils\index.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

export function error(m){
    throw Error(m)
}

export function use(fn,arr,...params){
   return Array.prototype[fn].call(arr,...params)
} 