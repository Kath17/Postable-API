type Object = {
  [key: string]: any;
};

export function StringifyObject(object: Object) {
  let newString = [];
  for (let key in object) {
    newString.push(`${key} = '${object[key]}'`);
  }
  return newString.join(", ");
}
