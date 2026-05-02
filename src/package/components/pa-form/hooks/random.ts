/**
 * **生成随机字符串**
 * @description 生成指定长度的随机字符串，可选添加前缀
 * @param prefix 随机字符串前缀，默认为空
 * @param randomLength 随机字符串长度，默认为8
 * @returns 返回生成的随机字符串
 */
function random(prefix = "", randomLength = 8) {
  const nameArr = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    [
      "a",
      "b",
      "c",
      "d",
      "e",
      "f",
      "g",
      "h",
      "i",
      "g",
      "k",
      "l",
      "m",
      "n",
      "o",
      "p",
      "q",
      "r",
      "s",
      "t",
      "u",
      "v",
      "w",
      "x",
      "y",
      "z"
    ]
  ];
  let name = prefix;
  for (let i = 0; i < randomLength; i++) {
    const index = Math.floor(Math.random() * 2);
    let zm = String(nameArr[index][Math.floor(Math.random() * nameArr[index].length)]);
    if (index === 1) {
      if (Math.floor(Math.random() * 2) === 1) {
        zm = zm.toUpperCase();
      }
    }
    name += zm;
  }
  return name;
}
/**
 * **导出随机函数**
 * @description 导出随机字符串生成函数
 */
export { random };
