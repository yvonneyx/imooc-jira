import { useState, useEffect, useRef } from "react";

export const isFalsy = (value: unknown): boolean => {
  // console.log(value.mayNotExist); // 报错
  return value === 0 ? false : !value
};

export const isVoid = (value: unknown) => value === undefined || value === null || value === ''

export const cleanObject = (object: { [key: string]: unknown }) => {
  const result = { ...object };
  Object.keys(result).forEach((key) => {
    const value = result[key];
    if (isVoid(value)) {
      delete result[key];
    }
  });
  return result;
};

export const useMount = (callback: () => void) => {
  useEffect(() => {
    callback();
    //eslint-disable-next-line react-hooks/exhaustive-deps 
  }, []);
};

export const useDebounce = <V>(value: V, delay?: number) => {
  const [debounceValue, setDebounceValue] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounceValue(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounceValue;
};

// export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
//   const oldTitle = document.title
//   // 页面加载时，oldTitle === 旧title "React App"
//   // 加载后，oldTitle === 新title 

//   useEffect(() => {
//     document.title = title
//   }, [title])

//   useEffect(() => {
//     return () => {
//       if (!keepOnUnmount) {
//         // 如果不指定依赖，读到的就是旧数据【页面加载时数据】
//         document.title = oldTitle
//       }
//     }
//   }, [])
// }


// useRef 返回一个可变的ref对象， 在组件的整个生命周期内保持不变
export const useDocumentTitle = (title: string, keepOnUnmount = true) => {
  const oldTitle = useRef(document.title).current
  // console.log("加载时 oldTitle,document.title：", oldTitle, document.title);

  useEffect(() => {
    document.title = title
    // console.log("加载后：", document.title);
  }, [title])

  useEffect(() => {
    return () => {
      if (!keepOnUnmount) {
        // console.log("卸载组件后，挂载oldTitle", oldTitle, document.title);
        document.title = oldTitle
      }
    }
  }, [keepOnUnmount, oldTitle])
}