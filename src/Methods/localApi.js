/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:19
 * @LastEditTime: 2021-04-18 13:47:33
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \ExArray\src\Methods\localApi.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import Exarr from "../index";
import  ExArray from '../instance' 

import { use,isNum } from "../utils/index";

/**
 * @description: To make a multidimensional array one-dimensional
 * @param1 { Exarr instance like [[1,2,3],[1,2,3]]}
 * @return { Exarr instance like [1,2,3,1,2,3]}
 */
function collapse(array) {
  if (!array) array = this;
  let res = new Exarr();

  function action(arr) {
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArray.isArray(cur)) {
        action(cur);
      } else {
        use.call(array,'push',res,cur)
        // res.push(cur)
      }
    }
  }
  action(array);
  return res;
}

function setVal(val, array) { //array->Exarr instance
  if (!array) array = this;

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
  return action(array);
}

function show(array) {
  if (!array) array = this;
  function action(arr) {
    if (!arr) return;

    let curArr = [];

    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArray.isArray(cur)) {
        // curArr.push(action(cur))
        use.call(array,"push", curArr,action(cur));
      } else {
        // curArr.push(cur)
        use.call(array,"push", curArr, cur);
      }
    }

    return curArr;
  }
  return action(array);
}

function total(arr) {
  if (!arr) arr = this;
  arr = collapse(arr);
  return arr.reduce((total, cur) => {
    if(isNum(cur)){
      total+=cur;
    }
    return total
  },0);
}

function setFN(arr) {
  this.FN = arr;
}
function setM(s){
 this.isNotMethod=s;
}

export default {
  collapse,
  setVal,
  show,
  total,
  setFN,
  setM
};
