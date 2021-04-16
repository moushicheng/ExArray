(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ExArr = factory());
}(this, (function () { 'use strict';

   /*
    * @Author: 某时橙
    * @Date: 2021-04-11 21:08:29
    * @LastEditTime: 2021-04-16 13:29:06
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\utils\index.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function error(m){
       throw Error(m)
   }

   //use方法不会触发方法事件和add/change/delete特殊事件
   function use(fn,arr,...params){
      this.setM(false); //一级拦截->拦截方法给下表索引getter带来的副作用
      let r= Array.prototype[fn].call(arr,...params); //二级拦截->拦截this上的事件传递
      this.setM(true);
      return r;
   } 
   function changeEle(i,ele){
      use.call(this,'splice',this,i,1,ele); 
   }

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:26
    * @LastEditTime: 2021-04-14 23:15:43
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
         let arr ;
         if (i == config.length - 1) arr = 0;
         else {
           arr=new Exarr();
           arr.setFN(curArr); 
         }
         curArr.push(arr);
         // use("push", curArr, arr);
         action(config, i + 1, arr);
       }
       if (i == 0) {
         return curArr;
       }
     }
     return action(config, 0, new ExArray());
   }

   var globalApi = { createArr };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:19
    * @LastEditTime: 2021-04-16 16:30:14
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
   function collapse(array) {
     if (!array) array = this;
     let res = new Exarr();

     function action(arr) {
       if (!arr) return;
       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArray.isArray(cur)) {
           action(cur);
         } else {
           use.call(array,'push',res,cur);
           // res.push(cur)
         }
       }
     }
     action(array);
     return res;
   }

   function setVal(val, array) { //array->Exarr instance
     if (!array) array = this;

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
     return action(array);
   }

   function show(array) {
     if (!array) array = this;
     function action(arr) {
       if (!arr) return;

       let curArr = [];

       for (let i = 0; i < arr.length; i++) {
         let cur = arr[i];
         if (ExArray.isArray(cur)) {
           // curArr.push(action(cur))
           use.call(array,"push", curArr,action(cur));
         } else {
           // curArr.push(cur)
           use.call(array,"push", curArr, cur);
         }
       }

       return curArr;
     }
     return action(array);
   }

   function total(array) {
     collapse(arr);
     return arr.reduce((total, cur) => {
       return (total += cur);
     });
   }

   function setFN(arr) {
     this.FN = arr;
   }
   function setM(s){
    this.isNotMethod=s;
   }

   var localApi = {
     collapse,
     setVal,
     show,
     total,
     setFN,
     setM
   };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:59
    * @LastEditTime: 2021-04-16 16:31:04
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\Methods\MethodStrategy.js
    * 可以输入预定的版权声明、个性签名、空行等
    */


   function MethodStrategy (name, params, r) {
     let ei = this;
     switch (name) {
       case "push": {
         if (params.length != 0) {
           Add();
         }
       }
       case "pop":{
         Delete();
       }
       case "shift":{
         Delete();
       }
       case "unshift":{
         if (params.length != 0) {
           Add();
         }
       }
       case "copyWithin":{
         Add();
       }
       case "reverse":{
         Change(); 
       }
       case "sort":{
         Change();
       }
       case "fill":{
         Change();
       }
     }



     function Add() {
       ei.event.emit("add", params, r, ei);
       params=transform(params);
       changeEle.call(ei,ei.length-1,params[0]);
       depth(params, ei);
     }
     function Change() {
       ei.event.emit("change", params, r);
     }
     function Delete() {
       ei.event.emit("delete", params, r);
     }
   }

   function transform(params,ei) {
     for (let i = 0; i < params.length; i++) {
       let cur = params[i];
       if (!Array.isArray(cur)||cur.on)continue;
       
       //如果是数组
       if(isMoreLayer(cur)){
         let r=new Exarr();
         // use.call(r,'push',...transform(cur))
         r.push(...transform(cur));
         params[i]=transform(r);
       }else {
         let r=new Exarr();
         r.push(...cur);
         params[i]=r;
       }
     }
     return params;
   }
   function isMoreLayer(arr) {
     for (let i = 0; i < arr.length; i++) {
       let cur = arr[i];
       if (Array.isArray(cur)) {
         return true;
       } else {
         continue;
       }
     }
     return false;
   }

   function depth(params, ei, fn) {
     function action(params, ei) {
       for (let p of params) {
         if (Array.isArray(p)) {
           action(p, p); //向下挖掘
           p.setFN(ei);
           _depth(p, ei); //向上查询并绑定
         } else {
           continue;
         }
       }
     }
     function _depth(cur, ei) {
       if (!ei) return;
       let FEvent = ei.event;
       for (let [name, cbs] of Object.entries(ei.event._callbacks)) {
         for (let cb of cbs) {
           if (cb.dm) {
             cur.event.on(name, function (params, r, array) {
               FEvent.emit(name, params, r, cur);
             });
           }
         }
       }
       _depth(cur, ei.FN);
     }
     action(params, ei);
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
    * @LastEditTime: 2021-04-15 09:47:34
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
       use.call(this.ei,"push", this._callbacks[fn], {
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
    * @LastEditTime: 2021-04-15 09:40:01
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
         this.isNotMethod=false;

         let r = fn.call(this, ...params); //执行函数
                               
         event.emit(name, params, r); //触发事件

         Methods.MethodStrategy.call(this,name,params, r); //执行函数的后续逻辑

         this.isNotMethod=true;
         return r
       };
     }
   }

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 19:16:30
    * @LastEditTime: 2021-04-16 16:30:00
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \arrExtend\src\instance.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   class ExArray extends Array {
     constructor(...config) {
       super(config.length == 1 ? config[0] : 0);
       if (config.length > 1) {
         return ExArray.createArr(...config);
       }
       this.isNotMethod=true;
       this.__Ex__='ExArray';
       EventInit.call(this);
       this.fill(0); //如果是一维数组直接fill即可  
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

   //宗旨:不做对象检测
   class Exarr extends ExArray{ //继承只是继承其静态方法罢了
     constructor(...config){
       super();
       return new Proxy(new ExArray(...config), {
         get(obj, property) {
           // console.log('get : '+property);
           return obj[property];
         },
         set(obj, property, value) {
           //再怎么说，SET这玩意检测的范围也太广了...........
            obj[property] = value;
           //拦截器的操作顺序和实际代码顺序相关 能拦截是因为先设置的isMethod=true，再执行的方法
           if (obj.isNotMethod && Number.isInteger(property*1)) {
             //add 
             if(property<obj.length-1)obj.event.emit("change", property, value, obj);
             else {
               obj.event.emit("add", property, value, obj);
             }
           }
           return true;
         },
       });
     }
   }
     
   let b = new Exarr(3);
   b.on(
     "add",
     function (params, back, array) {
       console.log('add');
       console.log("参数: " + params);
       console.log("返回: " + back);
       console.log('触发数组: ' +array);
     },
     true
   );
   b.on(
     "change",
     function (params, back, array) {
       console.log('change');
       console.log("参数: " + params);
       console.log("返回: " + back);
       console.log('触发数组: ' +array);
     },
     true
   );

   // console.log(b);
   // b.on(
   //   "push",
   //   function (params, back, array) {
   //     console.log('push');
   //     console.log("params: " + params);
   //     console.log("push returned value : " + back);
   //     console.log('array : ' +array);
   //   },
   //   false
   // );
   console.log(b.show());
   // console.log(b);

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

   return Exarr;

})));
