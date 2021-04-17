/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:59
 * @LastEditTime: 2021-04-17 19:49:17
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
        Add();
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
        Add();
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

  function Add() {
    ei.event.emit("add", params, r, ei);
    params = transform(params);
    use.call(ei, "splice", ei, ei.length - params.length, ei.length, ...params);
    depth(params, ei, name);
  }
  function Change() {
    ei.event.emit("change", params, r);
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
