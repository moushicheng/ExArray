/*
 * @Author: 某时橙
 * @Date: 2021-04-10 23:24:35
 * @LastEditTime: 2021-04-15 09:40:01
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\init.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import  Methods  from "./Methods/index";
import { callTypes, Event} from "./event";

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
  this.on = event.on.bind(event);
  this.event = event;
}

export function wrapInit(em) {
  for (const name of callTypes) {
    wrap(name)
  }
  function wrap(name) {
    let fn=em.prototype[name];

    em.prototype[name] = function (...params) {
      //this环境是Exarr的实例 也是子元素的父数组
      let event=this.event;
      this.isNotMethod=false;

      let r = fn.call(this, ...params); //执行函数
                            
      event.emit(name, params, r); //触发事件

      Methods.MethodStrategy.call(this,name,params, r); //执行函数的后续逻辑

      this.isNotMethod=true;
      return r
    };
  }
}
