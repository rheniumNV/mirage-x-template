export function assignArray<
  Elem,
  Arr extends Array<Elem> | ReadonlyArray<Elem>
>(array: Arr, index: number, value: Elem): Arr {
  const newArray = array.slice();
  newArray[index] = value;
  return newArray as Arr;
}
