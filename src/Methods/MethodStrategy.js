/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:59
 * @LastEditTime: 2021-04-14 18:33:38
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods\MethodStrategy.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

export default function (name, params, r) {
  let ei = this;
  switch (name) {
    case "push": {
      Add();
    }
  }
  function Add() {
    ei.event.emit("add", params, r, ei);
    for (let p of params) {
      if (Array.isArray(p)) {
      }
    }
  }
  function Change() {
    ei.event.emit("change", params, r);
  }
  function Delete() {
    ei.event.emit("delete", params, r);
  }
};
