import  Methods  from "./Methods/index";
import { globalApiMixin, localApiMixin, EventInit, wrapInit } from "./init";

export class ExArray extends Array {
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

export function Exarr(...config) {
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
