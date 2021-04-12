/*
 * @Author: 某时橙
 * @Date: 2021-04-10 15:27:02
 * @LastEditTime: 2021-04-12 18:03:01
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods.js
 * 可以输入预定的版权声明、个性签名、空行等
 */

import { ExArr } from "./index";
import { use } from "./utils/index";


/**
 * @description: Creating a Multidimensional Array
 * @param {i,j,k....}
 * @return {ExArr instance}
 */
function createArr(...config) {
  //config -> i j 行 列 ..
  let _c =
    config.length > 1
      ? () => {
          return new ExArr();
        }
      : () => {
          return [];
        };
  function action(config, i, curArr) {
    let curIndex = config[i];

    for (let k = 0; k < curIndex; k++) {
      let arr = _c();
      if (i == config.length - 1) arr = 0;
      // curArr.push(arr);
      use("push", curArr, arr);
      action(config, i + 1, arr);
    }
    if (i == 0) {
      return curArr;
    }
  }
  return action(config, 0, new ExArr());
}

/**
 * @description: To make a multidimensional array one-dimensional
 * @param1 {Exarr instance like [[1,2,3],[1,2,3]]}
 * @return {Exarr instance like [1,2,3,1,2,3]}
 */
function collapse(arr) {
  if (!arr) arr = this;
  let res = new ExArr();

  function action(arr) {
    if (!arr) return;
    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArr.isArray(cur)) {
        action(cur);
      } else {
        use("push", res, cur);
      }
    }
  }
  action(arr);
  return res;
}


function setVal(val,arr) {
  if (!arr) arr = this;

  function action(arr) {
    if (!arr) return val;

    for (let i = 0; i < arr.length; i++) {
      let cur = arr[i];
      if (ExArr.isArray(cur)) {
         arr[i]=action(cur);
      } else {
         arr[i]=val;
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
      if (ExArr.isArray(cur)) {
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

export let Methods = {
  globalApi: {
    createArr,
  },
  localApi: {
    collapse,
    setVal,
    show,
    total,
  },
};

// function test() {
//   return new Promise((resolve) =>
//     import("./index.js").then((res) => resolve(res))
//   );
// }
// async function t() {
//   let a = await test();
//   console.log(a);
// }
// t();
