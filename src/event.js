/*
 * @Author: 某时橙
 * @Date: 2021-04-11 09:26:54
 * @LastEditTime: 2021-04-18 13:49:29
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \ExArray\src\event.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { error} from "./utils/index";

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
  "isArray",
  "from",
  "collapse",
  "setOriVal",
  "show",
  "total",
  "add",
  "change",
  "delete",
];
export class Event {
  constructor() {
    this._callbacks = {};
    this.ei = null;
    this.executeCount=0;
  }
  on(fn, cb, depthMode = false) {
    if (callTypes.indexOf(fn) == -1) {
      error(`Event:${fn} is illegal!`);
      return;
    }
    let fns = this._callbacks[fn];
    if (!fns) this._callbacks[fn] = []; 
    let wrapCb=function(params, r, curArr){
      let k=this.executeCount++; //拦截回调触发回调引起无限递归 <- 防止递归的单例模式
      if(k!=0){
        this.executeCount--;
        return;
      }
      cb(params, r, curArr); 
      this.executeCount--;
    }


    this._callbacks[fn].push({
      cb:wrapCb,
      dm: depthMode,
    });
    // 深度绑定
    if (depthMode == true) {
      this.depthBind(fn);
    }
  }
  emit(fn, params, r, curArr) {
    let fns = this._callbacks[fn];
    if (!fns) return;
    if (!curArr) curArr = this.ei;
    for (let i = 0; i < fns.length; i++) {
      fns[i].cb.call(this,params, r, curArr);
    }
  }
  set(ei) {
    this.ei = ei;
  }
  depthBind(fn) {
    let FEvent = this;
    let ei = this.ei;

    function action(arr) {
      for (let i = 0; i < ei.length; i++) {
        let cur = arr[i];
        //在子数组上绑定父元素Emit
        if (Array.isArray(cur)) {
          cur.event.on(fn, function (params, r, array) {
            FEvent.emit(fn, params, r, cur);
          });
          action(cur);
        } else {
          continue;
        }
      }
    }
    action(ei);
  }
}
