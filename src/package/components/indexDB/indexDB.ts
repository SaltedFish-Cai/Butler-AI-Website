// IndexedDB 数据库管理

const DB_VERSION = new Date().getTime();
// const STORE_NAME = "simulatedData";

// 打开数据库
export const openDB = (DB_NAME: string, STORE_NAME: string[] | string): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => {
      reject("数据库打开失败");
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (typeof STORE_NAME === "string" && !db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      } else if (typeof STORE_NAME !== "string") {
        STORE_NAME.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
          }
        });
      }
    };
  });
};

// 存储数据
export const storeData = async (DB_NAME: string, STORE_NAME: string, data: any): Promise<any> => {
  console.log("++++++++++> storeData:");
  console.log(" ");
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    try {
      // 确保数据是可序列化的
      const newData = JSON.parse(JSON.stringify(data));
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.add({
        data: newData,
        timestamp: new Date().toISOString()
      });

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = () => {
        reject("数据存储失败");
      };
    } catch (error) {
      reject("数据序列化失败: " + error);
    }
  });
};

// 获取所有数据
export const getAllData = async (DB_NAME: string, STORE_NAME: string): Promise<any[]> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("数据获取失败");
    };
  });
};

// 根据ID获取数据
export const getDataById = async (DB_NAME: string, STORE_NAME: string, id: number): Promise<any> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = () => {
      reject("数据获取失败");
    };
  });
};

// 删除数据
export const deleteData = async (DB_NAME: string, STORE_NAME: string, id: number): Promise<void> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject("数据删除失败");
    };
  });
};

// 清空所有数据
export const clearAllData = async (DB_NAME: string, STORE_NAME: string): Promise<void> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = () => {
      reject("数据清空失败");
    };
  });
};

// 根据指定key和值修改数据
export const updateData = async (DB_NAME: string, STORE_NAME: string, key: string, value: any, newData: any): Promise<void> => {
  console.log("++++++++++> updateData:");
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    try {
      // 确保数据是可序列化的
      const serializedData = JSON.parse(JSON.stringify(newData));
      const transaction = db.transaction(STORE_NAME, "readwrite");
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const allData = request.result;
        const filteredData = allData.filter(item => {
          // 检查item.data是否存在
          if (!item.data) return false;
          // 检查指定的key和value是否匹配
          return item.data[key] === value;
        });

        if (filteredData.length === 0) {
          reject("数据不存在");
          return;
        }

        // 更新所有匹配的数据
        const updatePromises = filteredData.map(item => {
          return new Promise<void>(resolveUpdate => {
            const updatedData = {
              ...item,
              data: serializedData,
              timestamp: new Date().toISOString()
            };
            const updateRequest = store.put(updatedData);

            updateRequest.onsuccess = () => {
              resolveUpdate();
            };

            updateRequest.onerror = () => {
              reject("数据更新失败");
            };
          });
        });

        Promise.all(updatePromises)
          .then(() => {
            resolve();
          })
          .catch(error => {
            reject(error);
          });
      };

      request.onerror = () => {
        reject("数据获取失败");
      };
    } catch (error) {
      reject("数据序列化失败: " + error);
    }
  });
};

// 根据指定键值对查询对应数据
export const queryData = async (
  DB_NAME: string,
  STORE_NAME: string,
  query: Record<string, any>,
  isFuzzy: boolean = false
): Promise<any[]> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    request.onsuccess = () => {
      const allData = request.result;
      const filteredData = allData.filter(item => {
        // 检查item.data是否存在
        if (!item.data) return false;

        // 检查所有查询条件是否匹配
        return Object.entries(query).every(([key, value]) => {
          // 获取数据中对应键的值
          const itemValue = item.data[key];

          // 如果数据中没有该键，返回false
          if (itemValue === undefined) return false;

          // 根据查询类型进行匹配
          if (isFuzzy) {
            // 模糊查询：转换为字符串后进行包含匹配
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          } else {
            // 全匹配查询：直接比较值
            return itemValue === value;
          }
        });
      });

      resolve(filteredData);
    };

    request.onerror = () => {
      reject("数据查询失败");
    };
  });
};

// 根据自定义key和value删除对应数据
export const deleteDataByKey = async (DB_NAME: string, STORE_NAME: string, key: string, value: any): Promise<void> => {
  const db = await openDB(DB_NAME, STORE_NAME);
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.getAll();

    if (!value) return reject("value不能为空");

    request.onsuccess = () => {
      const allData = request.result;
      const filteredData = allData.filter(item => {
        // 检查item.data是否存在
        if (!item.data) return false;
        // 检查指定的key和value是否匹配
        return item.data[key] === value;
      });

      // 删除所有匹配的数据
      const deletePromises = filteredData.map(item => {
        return new Promise<void>(resolveDelete => {
          const deleteRequest = store.delete(item.id);
          deleteRequest.onsuccess = () => {
            resolveDelete();
          };
        });
      });

      Promise.all(deletePromises)
        .then(() => {
          resolve();
        })
        .catch(() => {
          reject("数据删除失败");
        });
    };

    request.onerror = () => {
      reject("数据获取失败");
    };
  });
};
