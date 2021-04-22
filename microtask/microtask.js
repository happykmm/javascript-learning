function foo() {
  console.log('A');

  setTimeout(() => {
    console.log('B');
  }, 0);

  new Promise((resolve) => {
    console.log('C1');
    resolve('C2');
  })
    .then((value) => value + '!')
    .then((value) => value.replace('!', ''))
    .then((value) => console.log(value));

  console.log('D');

  return 'E';
}


/* 
Correct order: A,C1,D,C2,E,B

Q: Why C1 executes before D?
A: Because Promise executor is executed immediately. Suppose C1 is a network call takes 500ms, D is a heavy computation takes 300ms,
* Having C1 executes first could parallelize them, resulting in total execution time = max(C1, D) = 500ms.
* Otherwise, if D executes first, the total execution time = D + C1 = 800ms.
Real example: grid load latency optimization: trigger data load at the earlist possible, before the UI renders. Refer: data fetch manager, aka DFM.

Q: Why C2 executes after D? 
A: Because Promise callback is always executed asynchronously. 

Q: Why Promise callback is not executed immediately?
A: Suppose D is a network call takes 500ms, C2 is a heavy computation takes 300ms,
* D, C2 results in total execution time = max(D, C2) = 500ms.
* C2, D results in total execution time = C2 + D = 800ms.

Q: Why C2 executes before E?
A: According to microtask definition, microtask executes before the end of current event loop.

Q: Why B executes after C2 and E?
A: Because setTimeout creates a task, Promise callback creates a microtask. The task is added to next event loop, while the microtask is added to the end of current event loop.

Q: Why Promise callback is not executed in next event loop?
A: Because that's too slow. See task-vs-microtask.js

*/