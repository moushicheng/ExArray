/*
 * @Author: 某时橙
 * @Date: 2021-04-10 23:24:35
 * @LastEditTime: 2021-04-12 20:58:25
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\init.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { Methods } from "./Methods";
import { callTypes, Event,EventStrategy} from "./event";

export function globalApiMixin(em) {
  for (const [name, Func] of Object.entries(Methods.globalApi)) {
    em[name] = Func; //静态方法 Exarr.func
  }
}
export function localApiMixin(em) {
  for (const [name, Func] of Object.entries(Methods.localApi)) {
    em.prototype[name] = Func; //动态方法 new Exarr().func
  }
}

export function EventInit() {

  let event = new Event();
  event.set(this);
  this.on=event.on.bind(event)


  for (const name of callTypes) {
    //在原有事件上执行Event事件逻辑
    wrap.call(this, name);
  }
  function wrap(name) {

    let fn = this[name]; 
    this.__proto__[name] = function(...params){
      //this环境是Exarr的实例
      let r=fn.call(this, ...params);
      event.emit(name,params,r);
      EventStrategy(name,event);
      return r;
    }
  } 
}
                  