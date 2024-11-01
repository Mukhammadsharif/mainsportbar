export function uniqBy(array, field) {
  const keys = [];
  const result = [];

  array.map(item => {
    if (!keys.includes(item[field])) {
      result.push(item);
    }
    keys.push(item[field]);
    return item;
  });

  return result;
}
