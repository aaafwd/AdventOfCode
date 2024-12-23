function arraysStartsWith(arr1, arr2, offset = 0) {
  if (offset + arr2.length > arr1.length) return false;
  for (let i = 0; i < arr2.length; ++i) {
    let a = arr1[i + offset];
    let b = arr2[i];
    if (a != b) return false;
  }
  return true;
}

function arraysEndsWith(arr1, arr2) {
  if (arr1.length < arr2.length) return false;
  for (let i = 0; i < arr2.length; ++i) {
    let a = arr1[arr1.length - i - 1];
    let b = arr2[arr2.length - i - 1];
    if (a != b) return false;
  }
  return true;
}

