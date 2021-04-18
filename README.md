![ExArray](https://www.hualigs.cn/image/60797ff01871d.jpg)

# ExArray

👯✨😄📫

A more powerful array base on the original array

It's still under development,There may be some bugs.

# feature

- **Event** 
- **depth bind**  
- **multidimensional arrays**  
- **more practical api**

# install
```git
npm install exarray
```

then

```
let Exarr=require('exarray');
```



# use

- You can create arrays of arbitrary dimensions

  ```
  let a=new Exarr(2,2);
  ```

- use a.show() to print your array

  ```
  console.log(a.show());
  //[ [ 0, 0 ], [ 0, 0 ] ]
  ```

  

# event

- You can bind function event to Exarray instance

```javascript
let a=new Exarr(2,2);
a.on(
  "push",
  function (params, back, array) {;
    console.log("params: " + params);
    console.log("push returned value : " + back);
    console.log("array : " +array);
  },
  false
);
```

when you 

```javascript
a.push(1);
// then,ExArray will excute your callback
// params: 1
// push returned value : 3
// array : [[0,0],[0,0],1]
```

- In addition ,you can also bind 'Add','Delete','Change' event to Exarray instance

  ```javascript
  a.on(
    "add",
    function (params, back, array) {
      console.log("add")
      console.log("params: " + params);
      console.log("returned value : " + back);
      console.log("array : " +array);
    },
    false
);
  
```
  
when you add a new element to array,your will touch off callback which you bind to Add/Delete/Change,
  
  such as:
  
  ```javascript
  a[2]=1;
  // add
  // params: 2
  // returned value : 1
  // array : [[0,0],[0,0],1]
  a.push(1)
  // add
  // params: 1
  // returned value : 5
  // array: 1,1,1,1,1
  ```

but if you do the following:

```javascript
a[0][1]=1
```

it can't execute add callback,you must change third argument to true ,this allows for  **deep bind**

For example:

```JavaScript
a.on(
  "add",
  function (params, back, array) {
    console.log("depth bind,add")
  },
  true
);
a[0][2]=1;
//"depth bind,add"
```





# API

## GlobalApi

- transform

  Array transform into Exarray instance

  ```javascript
  Exarr.transform([1,2])  //Exarr instance[1,2]
  ```

  



## LocalApi:

- collapse

  Flatten the Exarray

  ``` javascript
  new Exarr(2,2).collapse() //return: [0,0,0,0]
  ```


- setVal

  Set an initial value for the Exarray

  ```javascript
  new Exarr(2,2).setVal(2) //return: [[2,2],[2,2]]
  ```

- show

  print Exarray

  ```javascript
  console.log(new Exarr(2,2)) //return:  [[0,0],[0,0]]
  ```

- total

  Calculates the total value of the array

  ```javascript
  new Exarr(2,2).setVal(2).total() //retrun: 4
  ```




# LICENSE

MIT License

Copyright (c) 2021 哲学术士

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
