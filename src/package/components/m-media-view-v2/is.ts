export function isUnOpenFile(filename) {
  return /\.(doc|xls)$/i.test(filename);
}

export function isImageFile(filename) {
  // 使用正则表达式匹配以.png 结尾的文件名
  return /\.(png|jpg|jpeg|gif|bmp)$/i.test(filename);
}

export function isPdfFile(filename) {
  // 使用正则表达式匹配以.png 结尾的文件名
  return /\.(pdf)$/i.test(filename);
}

export function isTextFile(filename) {
  // 使用正则表达式匹配以.png 结尾的文件名
  return /\.(txt)$/i.test(filename);
}

export function isWordFile(filename) {
  // 使用正则表达式匹配以.png 结尾的文件名
  return /\.(docx|docm)$/i.test(filename);
}

export function isExcelFile(filename) {
  // 使用正则表达式匹配以.png 结尾的文件名
  return /\.(xls|xlsx|xlsm|csv)$/i.test(filename);
}
