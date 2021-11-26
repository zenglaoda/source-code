```javascript
async function asy() {
  console.log(1);
  const res = await 2;
  console.log(res);
}

asy();
console.log('a');
// 1
// a
// 2
```