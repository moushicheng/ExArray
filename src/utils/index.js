/*
 * @Author: 某时橙
 * @Date: 2021-04-11 21:08:29
 * @LastEditTime: 2021-04-17 20:29:29
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \ExArray\src\utils\index.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

export function error(m){
    throw Error(m)
}

//use方法不会触发方法事件和add/change/delete特殊事件
export function use(fn,arr,...params){
   this.setM(false); //一级拦截->拦截方法给下表索引getter带来的副作用
   let r= Array.prototype[fn].call(arr,...params) //二级拦截->拦截this上的事件传递
   this.setM(true);
   return r;
} 

export function addEle(i,ele){
   use.call(this,'splice',this,i,i,ele); 
}
export function changeEle(i,ele){
   use.call(this,'splice',this,i,1,ele); 
}
export function isNum(value){
   return typeof value === 'number' && !isNaN(value);
}