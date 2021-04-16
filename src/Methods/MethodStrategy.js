/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:59
 * @LastEditTime: 2021-04-16 16:31:04
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods\MethodStrategy.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import Exarr from "../index";
import {changeEle,addEle, use} from '../utils/index'

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
    params=transform(params,ei);
    changeEle.call(ei,ei.length-1,params[0])
    depth(params, ei, name);
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
      r.push(...transform(cur))
      params[i]=transform(r);
    }else{
      let r=new Exarr();
      r.push(...cur)
      params[i]=r
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
