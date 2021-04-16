import  ExArray from './instance' 

//宗旨:不做对象检测
export default class Exarr extends ExArray{ //继承只是继承其静态方法罢了
  constructor(...config){
    super()
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
          else{
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
