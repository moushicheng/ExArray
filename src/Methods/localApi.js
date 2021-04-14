/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:19
 * @LastEditTime: 2021-04-14 18:42:57
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods\localApi.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import { Exarr, ExArray } from "../index";
import { use } from "../utils/index";

/**
 * @description: To make a multidimensional array one-dimensional
 * @param1 { Exarr instance like [[1,2,3],[1,2,3]]}
 * @return { Exarr instance like [1,2,3,1,2,3]}
 */
function collapse(arr) {
  if (!arr) arr = this;
  let res = new Exarr();

  function action(arr) {
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArray.isArray(cur)) {
        action(cur);
      } else {
        use("push", res, cur);
      }
    }
  }
  action(arr);
  return res;
}

function setVal(val, arr) {
  if (!arr) arr = this;

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
  return action(arr);
}

function show(arr) {
  if (!arr) arr = this;

  function action(arr) {
    if (!arr) return;

    let curArr = [];

    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArray.isArray(cur)) {
        use("push", curArr, action(cur));
      } else {
        use("push", curArr, cur);
      }
    }

    return curArr;
  }
  return action(arr);
}

function total(arr) {
  if (!arr) arr = this;
  arr = collapse(arr);
  return arr.reduce((total, cur) => {
    return (total += cur);
  });
}



export default {
  collapse,
  setVal,
  show,
  total,
};
