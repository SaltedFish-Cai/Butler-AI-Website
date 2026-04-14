/**
 * 将数组按照指定大小拆分成多个子数组
 * @param array 要拆分的数组
 * @param size 每个子数组的大小
 * @returns 拆分后的二维数组
 */
export function splitArray<T>(array: T[], size: number): T[][] {
  if (size <= 0) {
    throw new Error("Size must be greater than 0");
  }

  const result: T[][] = [];
  const length = array.length;

  for (let i = 0; i < length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/**
 * 将数组按照指定大小拆分成多个子数组（带回调函数版本）
 * @param array 要拆分的数组
 * @param size 每个子数组的大小
 * @param callback 对每个子数组的处理回调函数
 * @returns 处理后的结果数组
 */
export function splitArrayWithCallback<T, R>(array: T[], size: number, callback: (chunk: T[], index: number) => R): R[] {
  const chunks = splitArray(array, size);
  return chunks.map((chunk, index) => callback(chunk, index));
}

/**
 * 将数组按照指定大小拆分成多个子数组（异步版本）
 * @param array 要拆分的数组
 * @param size 每个子数组的大小
 * @param asyncCallback 对每个子数组的异步处理回调函数
 * @returns Promise resolving to 处理后的结果数组
 */
export async function splitArrayAsync<T, R>(
  array: T[],
  size: number,
  asyncCallback: (chunk: T[], index: number) => Promise<R>
): Promise<R[]> {
  const chunks = splitArray(array, size);
  const results: R[] = [];

  for (let i = 0; i < chunks.length; i++) {
    const result = await asyncCallback(chunks[i], i);
    results.push(result);
  }

  return results;
}

/**
 * 将数组按照指定大小拆分成多个子数组（并行异步版本）
 * @param array 要拆分的数组
 * @param size 每个子数组的大小
 * @param asyncCallback 对每个子数组的异步处理回调函数
 * @returns Promise resolving to 处理后的结果数组
 */
export async function splitArrayParallel<T, R>(
  array: T[],
  size: number,
  asyncCallback: (chunk: T[], index: number) => Promise<R>
): Promise<R[]> {
  const chunks = splitArray(array, size);
  const promises = chunks.map((chunk, index) => asyncCallback(chunk, index));
  return Promise.all(promises);
}

/**
 * 将数组按照指定数量拆分成多个子数组
 * @param array 要拆分的数组
 * @param chunks 要拆分成多少个子数组
 * @returns 拆分后的二维数组
 */
export function splitArrayIntoChunks<T>(array: T[], chunks: number): T[][] {
  if (chunks <= 0) {
    throw new Error("Chunks must be greater than 0");
  }

  const result: T[][] = [];
  const size = Math.ceil(array.length / chunks);

  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }

  return result;
}

/**
 * 将数组按照指定大小拆分成多个子数组，并保留剩余元素
 * @param array 要拆分的数组
 * @param size 每个子数组的大小
 * @returns 拆分后的二维数组，最后一个子数组可能小于指定大小
 */
export function chunkArray<T>(array: T[], size: number): T[][] {
  return splitArray(array, size);
}
