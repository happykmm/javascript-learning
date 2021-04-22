const limit = 1000;

const startTime = Date.now();

function test1(count) {
  if (count < limit) {
    setTimeout(() => {
      test1(count+1);
    }, 0);
  } else {
    console.log(`test1 finish in ${Date.now() - startTime} ms`);
  }
}

function test2(count) {
  if (count < limit) {
    queueMicrotask(() => {
      test2(count+1);
    });
  } else {
    console.log(`test2 finish in ${Date.now() - startTime} ms`);
  }
}

test1(0);
test2(0);


/* 
Results:
test2 finish in 5 ms
test1 finish in 5101 ms
*/