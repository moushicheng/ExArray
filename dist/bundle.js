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
    * @Date: 2021-04-10 15:27:02
    * @LastEditTime: 2021-04-12 18:03:01
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods.js
    * 可以输入预定的版权声明、个性签名、空行等
    */


   /**
    * @description: Creating a Multidimensional Array
    * @param {i,j,k....}
    * @return {ExArr instance}
    */
   function createArr(...config) {
     //config -> i j 行 列 ..
     let _c =
       config.length > 1
         ? () => {
             return new ExArr();
           }
         : () => {
             return [];
           };
     function action(config, i, curArr) {
       let curIndex = config[i];

       for (let k = 0; k < curIndex; k++) {
         let arr = _c();
         if (i == config.length - 1) arr = 0;
         // curArr.push(arr);
         use("push", curArr, arr);
         action(config, i + 1, arr);
       }
       if (i == 0) {
         return curArr;
       }
     }
     return action(config, 0, new ExArr());
   }

   /**
    * @description: To make a multidimensional array one-dimensional
    * @param1 {Exarr instance like [[1,2,3],[1,2,3]]}
    * @return {Exarr instance like [1,2,3,1,2,3]}
    */
   function collapse(arr) {
     if (!arr) arr = this;
     let res = new ExArr();

     function action(arr) {
       if (!arr) return;
       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArr.isArray(cur)) {
           action(cur);
         } else {
           use("push", res, cur);
         }
       }
     }
     action(arr);
     return res;
   }


   function setVal(val,arr) {
     if (!arr) arr = this;

     function action(arr) {
       if (!arr) return val;

       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArr.isArray(cur)) {
            arr[i]=action(cur);
         } else {
            arr[i]=val;
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
         if (ExArr.isArray(cur)) {
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

   let Methods = {
     globalApi: {
       createArr,
     },
     localApi: {
       collapse,
       setVal,
       show,
       total,
     },
   };

   // function test() {
   //   return new Promise((resolve) =>
   //     import("./index.js").then((res) => resolve(res))
   //   );
   // }
   // async function t() {
   //   let a = await test();
   //   console.log(a);
   // }
   // t();

   /*
    * @Author: 某时橙
    * @Date: 2021-04-11 09:26:54
    * @LastEditTime: 2021-04-13 19:55:35
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
    * @LastEditTime: 2021-04-13 19:16:14
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
         //this环境是Exarr的实例
         let event=this.event;
         let r = fn.call(this, ...params);
         event.emit(name, params, r);
         return r
       };
     }
   }

   class ExArr extends Array{
     constructor(...config) {
       super(config.length == 1 ? config[0] : 0);
       if (config.length > 1) {
         return ExArr.createArr(...config);
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
     static originVal=0
   }

   globalApiMixin(ExArr);
   localApiMixin(ExArr);
   wrapInit(ExArr);


   let a = new ExArr(3,3);

   a.on('push',function(params,r,array){
     //check bug1:array cant analysis by `${array}`
     console.log('在push方法上添加事件');
     console.log(`event:push params:${params} return:${r} `);
     console.log('当前数组'+array);
   },true); 


   a[0].push(1);
   console.log(a.show());
   // a.on('collapse',function(params,r,array){
   //   //check bug1:array cant analysis by `${array}`
   //   console.log('在collapse方法上添加事件');
   //   console.log(`event:push params:${params} return:${r} `);
   // })

   // a.push(1)

   // console.log(a.show());
   // console.log(a.total());

   exports.ExArr = ExArr;

   Object.defineProperty(exports, '__esModule', { value: true });

})));
