/**
 * @module pa-media-view/is
 * @description 文件类型判断工具函数
 */
/**
 * 判断是否为不可打开的文件
 * @param filename - 文件名
 * @returns 是否为不可打开的文件
 * @description 匹配 .doc 和 .xls 后缀
 */
export function isUnOpenFile(filename: string | undefined): boolean {
  return /\.(doc|xls)$/i.test(filename || "");
}
/**
 * 判断是否为图片文件
 * @param filename - 文件名
 * @returns 是否为图片文件
 * @description 匹配 .png/.jpg/.jpeg/.gif/.bmp 后缀
 */
export function isImageFile(filename: string | undefined): boolean {
  return /\.(png|jpg|jpeg|gif|bmp)$/i.test(filename || "");
}
/**
 * 判断是否为 PDF 文件
 * @param filename - 文件名
 * @returns 是否为 PDF 文件
 * @description 匹配 .pdf 后缀
 */
export function isPdfFile(filename: string | undefined): boolean {
  return /\.(pdf)$/i.test(filename || "");
}
/**
 * 判断是否为文本文件
 * @param filename - 文件名
 * @returns 是否为文本文件
 * @description 匹配 .txt 后缀
 */
export function isTextFile(filename: string | undefined): boolean {
  return /\.(txt)$/i.test(filename || "");
}
/**
 * 判断是否为 Word 文件
 * @param filename - 文件名
 * @returns 是否为 Word 文件
 * @description 匹配 .docx/.docm 后缀
 */
export function isWordFile(filename: string | undefined): boolean {
  return /\.(docx|docm)$/i.test(filename || "");
}
/**
 * 判断是否为 Excel 文件
 * @param filename - 文件名
 * @returns 是否为 Excel 文件
 * @description 匹配 .xls/.xlsx/.xlsm/.csv 后缀
 */
export function isExcelFile(filename: string | undefined): boolean {
  return /\.(xls|xlsx|xlsm|csv)$/i.test(filename || "");
}
