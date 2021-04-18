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
          if(property<=obj.length-1)obj.event.emit("change", property, value, obj);
          else{
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
)
b[0]=1 