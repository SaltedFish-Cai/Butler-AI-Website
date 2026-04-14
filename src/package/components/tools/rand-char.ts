// # 随机字符串
export function randChar(
  length = 8,
  characters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
  prefix = "M_"
) {
  const charactersArr = characters.split(""); //分割字符。charactersArr
  let result = prefix; //返回的结果。
  while (result.length < length) {
    const index = Math.round(Math.random() * characters.length);
    const newVal = charactersArr[index] || charactersArr[0];
    result += newVal;
  }
  return result;
}

export function randNum(length = 8, characters = "123456789", prefix = "") {
  return randChar(length, characters, prefix);
}

export default randChar;
