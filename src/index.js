import { Methods } from "./Methods";
import { globalApiMixin, localApiMixin,EventInit,wrapInit} from "./init";


export class ExArr extends Array{
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
wrapInit(ExArr)


let a = new ExArr(3,3);

a.on('push',function(params,r,array){
  //check bug1:array cant analysis by `${array}`
  console.log('在push方法上添加事件');
  console.log(`event:push params:${params} return:${r} `);
  console.log('当前数组'+array);
},true) 


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