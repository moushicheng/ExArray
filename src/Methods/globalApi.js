/*
 * @Author: 某时橙
 * @Date: 2021-04-14 18:29:26
 * @LastEditTime: 2021-04-14 22:48:22
 * @LastEditors: your name
 * @Description: 请添加介绍
 * @FilePath: \arrExtend\src\Methods\globalApi.js
 * 可以输入预定的版权声明、个性签名、空行等
 */
import Exarr from "../index";
import ExArray from "../instance"
import { use } from "../utils/index";

function createArr(...config) {
  //config -> i j 行 列 ..
  function action(config, i, curArr) {
    let curIndex = config[i];

    for (let k = 0; k < curIndex; k++) {
      let arr ;
      if (i == config.length - 1) arr = 0;
      else{
        arr=new Exarr();
        arr.setFN(curArr); 
      }
      // curArr.push(arr);
      use("push", curArr, arr);
      action(config, i + 1, arr);
    }
    if (i == 0) {
      return curArr;
    }
  }
  return action(config, 0, new ExArray());
}

export default { createArr };
