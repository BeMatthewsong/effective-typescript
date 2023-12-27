type Tuple = [string, number, Date];
type TupleEl = Tuple; // Type is string | number | Date

function arraySum(arr: number[]) {
  let sum = 0,
    num;
  while ((num = arr.pop()) !== undefined) {
    sum += num;
  }
  return sum;
}

const num = [1, 2, 3];

const b = arraySum(num);
console.log(num);
