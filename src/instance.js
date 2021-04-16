/*
 * @Author: 某时橙
 * @Date: 2021-04-14 19:16:30
 * @LastEditTime: 2021-04-16 16:30:00
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\instance.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { globalApiMixin, localApiMixin, EventInit, wrapInit } from "./init";

export default class ExArray extends Array {
  constructor(...config) {
    super(config.length == 1 ? config[0] : 0);
    if (config.length > 1) {
      return ExArray.createArr(...config);
    }
    this.isNotMethod=true;
    this.__Ex__='ExArray';
    EventInit.call(this);
    this.fill(0) //如果是一维数组直接fill即可  
    this.setVal(1);
  }
  // static install() {
  //   let m = {}; 
  //   Object.assign(m, Methods.globalApi, Methods.localApi);
  //   for (const [name, Func] of Object.entries(m)) {
  //     Array["$" + name] = Func;
  //   }
  // }
}

globalApiMixin(ExArray);
localApiMixin(ExArray);
wrapInit(ExArray);