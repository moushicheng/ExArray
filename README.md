# ExArray
A more powerful array base on the original array

# install

npm install



# feature

- **Event** -- Provides an event subscription system
- **add|change|delete event** --This type of event can even monitor 'a[index]=num' this form
- **depth watch**  
- **multidimensional arrays**  -  you can create it directly

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

- You can bind callback to any function which is in instance a event,such as:

```javascript
let a=new new Exarr(2,2);
a.on(
  "push",
  function (params, back, array) {;
    console.log("params: " + params);
    console.log("push returned value : " + back);
    console.log('array : ' +array);
  },
  false
);


```

when you 

```javascript
a.push(1);
//then,ExArray will excute your callback
// params: 1
// push returned value : 3
// array : [[0,0],[0,0],1]
```

- In addition ,you can also bind 'add','delete','change' event

  ```javascript
  b.on(
    "add",
    function (params, back, array) {
      console.log("params: " + params);
      console.log("push returned value : " + back);
      console.log('array : ' +array);
    },
    false
  );
  ```

  when you add a new element to array,your callback will execute,

  such as:

  ```
  b[2]=1;
  // params: 2
  // push returned value : 1
  // array : [[0,0],[0,0],1]
  b.push(1);
  ```



# api

- collapse

- setVal

- show

- total

  





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
