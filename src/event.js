/*
 * @Author: 某时橙
 * @Date: 2021-04-11 09:26:54
 * @LastEditTime: 2021-04-12 20:42:17
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\event.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { error } from "./utils/index";

export let callTypes = [
  "concat",
  "copyWithin",
  "entries",
  "every",
  "fill",
  "filter",
  "find",
  "findIndex",
  "flat",
  "flatMap",
  "forEach",
  "includes",
  "indexOf",
  "join",
  "keys",
  "lastIndexOf",
  "map",
  "pop",
  "push",
  "reduce",
  "reduceRight",
  "reverse",
  "shift",
  "slice",
  "some",
  "sort",
  "splice",
  "toLocaleString",
  "toString",
  "unshift",
  "values",
  "collapse",
  "setOriVal",
  "show",
  "total",
  "add",
  "change",
  "delete"
];
export class Event {
  constructor() {
    this._callbacks = {};
  }
  on(fn, cb) {
    if (callTypes.indexOf(fn) == -1) {
      error(`Event:${fn} is illegal!`);
      return;
    }
    let fns = this._callbacks[fn];
    if (!fns) this._callbacks[fn] = [];
    this._callbacks[fn].push(cb);
  }
  emit(fn, params, r) {
    let fns = this._callbacks[fn];
    if (!fns) return;

    for (let i = 0; i < fns.length; i++) {
      fns[i](params, r, this.ei);
    }
  }
  set(ei) {
    this.ei = ei;
  }
}


export let EventStrategy=function(name,event){
  console.log(name);
}