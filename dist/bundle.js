(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
   typeof define === 'function' && define.amd ? define(['exports'], factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ExArr = {}));
}(this, (function (exports) { 'use strict';

   /*
    * @Author: 某时橙
    * @Date: 2021-04-11 21:08:29
    * @LastEditTime: 2021-04-12 16:18:08
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\utils\index.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function error(m){
       throw Error(m)
   }

   function use(fn,arr,...params){
      return Array.prototype[fn].call(arr,...params)
   }

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:26
    * @LastEditTime: 2021-04-14 18:33:26
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods\globalApi.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function createArr(...config) {
     //config -> i j 行 列 ..
     function action(config, i, curArr) {
       let curIndex = config[i];

       for (let k = 0; k < curIndex; k++) {
         let arr = new ExArray();
         if (i == config.length - 1) arr = 0;
         // curArr.push(arr);
         use("push", curArr, arr);

         action(config, i + 1, arr);
       }
       if (i == 0) {
         return curArr;
       }
     }
     return action(config, 0, new Exarr());
   }

   var globalApi = { createArr };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:19
    * @LastEditTime: 2021-04-14 18:42:57
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods\localApi.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   /**
    * @description: To make a multidimensional array one-dimensional
    * @param1 { Exarr instance like [[1,2,3],[1,2,3]]}
    * @return { Exarr instance like [1,2,3,1,2,3]}
    */
   function collapse(arr) {
     if (!arr) arr = this;
     let res = new Exarr();

     function action(arr) {
       if (!arr) return;
       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArray.isArray(cur)) {
           action(cur);
         } else {
           use("push", res, cur);
         }
       }
     }
     action(arr);
     return res;
   }

   function setVal(val, arr) {
     if (!arr) arr = this;

     function action(arr) {
       if (!arr) return val;

       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArray.isArray(cur)) {
           arr[i] = action(cur);
         } else {
           arr[i] = val;
         }
       }
       return arr;
     }
     return action(arr);
   }

   function show(arr) {
     if (!arr) arr = this;

     function action(arr) {
       if (!arr) return;

       let curArr = [];

       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArray.isArray(cur)) {
           use("push", curArr, action(cur));
         } else {
           use("push", curArr, cur);
         }
       }

       return curArr;
     }
     return action(arr);
   }

   function total(arr) {
     if (!arr) arr = this;
     arr = collapse(arr);
     return arr.reduce((total, cur) => {
       return (total += cur);
     });
   }



   var localApi = {
     collapse,
     setVal,
     show,
     total,
   };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:59
    * @LastEditTime: 2021-04-14 18:33:38
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods\MethodStrategy.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function MethodStrategy (name, params, r) {
     let ei = this;
     switch (name) {
       case "push": {
         Add();
       }
     }
     function Add() {
       ei.event.emit("add", params, r, ei);
       for (let p of params) {
       }
     }
   }

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:34:05
    * @LastEditTime: 2021-04-14 18:37:02
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods\index.js
    * 可以输入预定的版权声明、个性签名、空行等
    */
   var Methods = {
       globalApi,
       localApi,
       MethodStrategy
   };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-11 09:26:54
    * @LastEditTime: 2021-04-14 15:58:48
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\event.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   let callTypes = [
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
   class Event {
     constructor() {
       this._callbacks = {};
       this.ei = null;
     }
     on(fn, cb, depthMode = false) {
       if (callTypes.indexOf(fn) == -1) {
         error(`Event:${fn} is illegal!`);
         return;
       }
       let fns = this._callbacks[fn];
       if (!fns) this._callbacks[fn] = [];
       use("push", this._callbacks[fn], {
         cb,
         dm: depthMode,
       });
       // 深度绑定
       if (depthMode == true) {
         this.depthBind(fn);
       }
     }
     emit(fn, params, r,curArr) {
       let fns = this._callbacks[fn];
       if (!fns) return;
       if(!curArr)curArr=this.ei;
       for (let i = 0; i < fns.length; i++) {
         fns[i].cb(params, r, curArr);
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
             cur.event.on(fn,function(params,r,array){
               FEvent.emit(fn,params,r,cur);
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

   /*
    * @Author: 某时橙
    * @Date: 2021-04-10 23:24:35
    * @LastEditTime: 2021-04-14 18:38:29
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\init.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function globalApiMixin(em) {
     for (const [name, Func] of Object.entries(Methods.globalApi)) {
       em[name] = Func; //静态方法 Exarr.func
     }
   }
   function localApiMixin(em) {
     for (const [name, Func] of Object.entries(Methods.localApi)) {
       em.prototype[name] = Func; //动态方法 new Exarr().func
     }
   }

   function EventInit() {
     let event = new Event();
     event.set(this);
     this.on = event.on.bind(event);
     this.event = event;
   }

   function wrapInit(em) {
     for (const name of callTypes) {
       wrap(name);
     }
     function wrap(name) {
       let fn=em.prototype[name];

       em.prototype[name] = function (...params) {
         //this环境是Exarr的实例 也是子元素的父数组
         let event=this.event;
         this.isMethod=true;

         let r = fn.call(this, ...params); //执行函数
                               
         event.emit(name, params, r); //触发事件

         Methods.MethodStrategy.call(this,name,params, r); //执行函数的后续逻辑

         this.isMethod=false;
         return r
       };
     }
   }

   class ExArray extends Array {
     constructor(...config) {
       super(config.length == 1 ? config[0] : 0);
       if (config.length > 1) {
         return ExArray.createArr(...config);
       }
       this.setVal(0);
       EventInit.call(this);
     }
     static install() {
       let m = {};
       Object.assign(m, Methods.globalApi, Methods.localApi);
       for (const [name, Func] of Object.entries(m)) {
         Array["$" + name] = Func;
       }
     }
     static originVal = 0;
   }

   globalApiMixin(ExArray);
   localApiMixin(ExArray);
   wrapInit(ExArray);

   function Exarr(...config) {
     return new Proxy(new ExArray(...config), {
       get(obj, property) {
         // console.log('get : '+property);
         return obj[property];
       },
       set(obj, property, value) {
         let r =obj[property] = value;
         //拦截器的操作顺序和实际代码顺序相关 能拦截是因为先设置的isMethod，再执行的方法
         if (!obj.isMethod && property != "isMethod") {
           //add
           obj.event.emit("add", property, r, obj);
         }
         return true;
       },
     });
   }

   let b = new Exarr(2);
   b.on(
     "add",
     function (params, back, array) {
       console.log("参数: " + params);
       console.log("返回: " + back);
       console.log("触发add");
     },
     true
   );
   console.log(b);
   // console.log(b.collapse().show());
   // console.log(b.show());

   // b.on('push',function(params,r,array){
   //   //check bug1:array cant analysis by `${array}`
   //   // console.log('在push方法上添加事件');
   //   // console.log(`event:push params:${params} return:${r} `);
   //   // console.log('当前数组'+array);
   // },true)

   // console.log(a.show());
   // console.log(a);

   // console.log(proxy.show());

   // a.on('collapse',function(params,r,array){
   //   //check bug1:array cant analysis by `${array}`
   //   console.log('在collapse方法上添加事件');
   //   console.log(`event:push params:${params} return:${r} `);
   // })

   // a.push(1)

   // console.log(a.show());
   // console.log(a.total());

   exports.ExArray = ExArray;
   exports.Exarr = Exarr;

   Object.defineProperty(exports, '__esModule', { value: true });

})));
