/**
 * Maps an array to an object
 * @param arr - The input array
 * @param keyFn - The function to generate the keys of the output object
 * @param valueFn - Function to generate the values of the output object
 * @returns Object with keys generated by `keyFn` and values generated by `valueFn`
 */
const arrayToObject = <T, K extends string | number | symbol, V>(
  arr: T[],
  keyFn: (element: T) => K,
  valueFn: (element: T) => V,
): Record<K, V> => {
  const obj: Record<K, V> = {} as Record<K, V>;
  for (const element of arr) {
    const key = keyFn(element);
    const value = valueFn(element);
    obj[key] = value;
  }
  return obj;
};

export default arrayToObject;
