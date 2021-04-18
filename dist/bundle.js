(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.ExArr = factory());
}(this, (function () { 'use strict';

   /*
    * @Author: 某时橙
    * @Date: 2021-04-11 21:08:29
    * @LastEditTime: 2021-04-17 20:29:29
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\utils\index.js
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
   function isNum(value){
      return typeof value === 'number' && !isNaN(value);
   }

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:26
    * @LastEditTime: 2021-04-17 19:50:08
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\Methods\globalApi.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function createArr(...config) {
     //config -> i j 行 列 ..
     function action(config, i, curArr) {
       let curIndex = config[i];

       for (let k = 0; k < curIndex; k++) {
         let arr;
         if (i == config.length - 1) arr = 0;
         else {
           arr = new Exarr();
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

   function transform$1(ele) {
     if (!Array.isArray(ele) || ele.on) return ele;
     //如果是数组
     let r = new ExArray();
     for (let i = 0; i < ele.length; i++) {
       let cur = ele[i];
       if (Array.isArray(cur)) {
         use.call(r, "push", r, transform$1(cur));
       } else {
         use.call(r, "push", r, cur);
       }
     }
     return r;
   }

   var globalApi = { createArr, transform: transform$1 };

   /*
    * @Author: 某时橙
    * @Date: 2021-04-14 18:29:19
    * @LastEditTime: 2021-04-18 11:32:36
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\Methods\localApi.js
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

   function total(arr) {
     if (!arr) arr = this;
     arr = collapse(arr);
     return arr.reduce((total, cur) => {
       if(isNum(cur)){
         total+=cur;
       }
       return total
     },0);
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
    * @LastEditTime: 2021-04-17 23:13:41
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\Methods\MethodStrategy.js
    * 可以输入预定的版权声明、个性签名、空行等
    */

   function MethodStrategy (name, params, r) {
     let ei = this;
     switch (name) {
       case "push": {
         if (params.length != 0) {
           Add(ei.length - params.length, ei.length);
         }
         break;
       }
       case "pop": {
         Delete();
         break;
       }
       case "shift": {
         Delete();
         break;
       }
       case "unshift": {
         if (params.length != 0) {
           Add(0,params.length);
         }
         break;
       }
       case "copyWithin": {
         //使用 copyWithin 从数组中复制一部分到同数组中的另外位置
         if (params[0] != null) {
           Add();
         }
         break;
       }
       case "reverse": {
         Change();
         break;
       }
       case "sort": {
         Change();
         break;
       }
       case "fill": {
         Change();
         break;
       }
       case "splice": {
         //splice比较复杂，有增删改三种事件
         //参数[0]删除起始下标，参数[1]为删除总数,参数[1+n]为添加元素
         if (params[2]) {
           Add();
         }
         if (params[1] >= 1) {
           Delete();
         }
       }
     }

     function Add(i,j) {
       ei.event.emit("add", params, r, ei);
       if(!i&&!j)return;
       params = transform(params);
       depth(params, ei);
       use.call(ei, "splice", ei, i,j, ...params); //不够定制化
     }
     function Change(i,j) {
       ei.event.emit("change", params, r);
       //修改也要走一套转化流程
       //深度绑定也要走一套
       //修改位置也要决定好
       if(!i&&!j)return;
       params = transform(params);
       depth(params, ei);
       use.call(ei, "splice", ei, i,j, ...params); //不够定制化
     }
     function Delete() {
       ei.event.emit("delete", params, r);
     }
   }

   function transform(params) {
     for (let i = 0; i < params.length; i++) {
       params[i] = Exarr.transform(params[i]);
     }
     return params;
   }

   function depth(params, ei) {
     function action(params, ei) {
       for (let p of params) {
         if (Array.isArray(p)) {
           _depth(p, ei); //向上查询并绑定
           p.setFN(ei);
           action(p, p); //向下挖掘
      
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
    * @LastEditTime: 2021-04-18 13:31:12
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\event.js
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
       };


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

   /*
    * @Author: 某时橙
    * @Date: 2021-04-10 23:24:35
    * @LastEditTime: 2021-04-18 11:33:49
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\init.js
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
    * @LastEditTime: 2021-04-18 11:13:45
    * @LastEditors: your name
    * @Description: 请添加介绍
    * @FilePath: \ExArray\src\instance.js
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
             if(property<=obj.length-1)obj.event.emit("change", property, value, obj);
             else {
               obj.event.emit("add", property, value, obj);
             }
           }
           return true;
         },
       });
     }
   }
     

   let b = new Exarr(4);
   b.on(
     "add",
     function (params, back, array) {
       console.log('add');
       console.log(params);
       console.log("返回: " + back);
       console.log('触发数组: ' +array);
       console.log(array.show());
     },
     true
   );
   b.on(
     "change",
     function (params, back, array) {
       console.log('change');
       // console.log("参数: " + params);
       // console.log("返回: " + back);
       // console.log('触发数组: ' +array);
       console.log(array.show());
     },
     true
   );
   b.on(
     "delete",
     function (params, back, array) {
       console.log('delete');
       // console.log("参数: " + params);
       // console.log("返回: " + back);
       // console.log('触发数组: ' +array); 
     },
     true
   );
   b[0]=1;

   return Exarr;

})));
