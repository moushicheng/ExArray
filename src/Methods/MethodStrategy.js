/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:59
 * @LastEditTime: 2021-04-17 23:13:41
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \ExArray\src\Methods\MethodStrategy.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import Exarr from "../index";
import { changeEle, addEle, use } from "../utils/index";

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

export default function (name, params, r) {
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
