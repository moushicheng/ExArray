/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:59
 * @LastEditTime: 2021-04-14 21:47:52
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods\MethodStrategy.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

export default function (name, params, r) {
  let ei = this;
  switch (name) {
    case "push": {
      if (params.length != 0) {
        Add();
      }
    }
  }
  function Add() {
    ei.event.emit("add", params, r, ei);
    depth(params, ei, name);
  }
  function Change() {
    ei.event.emit("change", params, r);
  }
  function Delete() {
    ei.event.emit("delete", params, r);
  }
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
    if(!ei)return;
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
    _depth(cur,ei.FN)
  }
  action(params, ei);
}
