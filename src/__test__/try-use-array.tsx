import { useMount } from "utils";
import React, { useState } from "react";
import { useArray } from "utils/useArray";

export const TsReactTest = () => {
  // 这种应该是简便的写法，定义对象数组，把最下面的any换成了{}对象
  const persons: { name: string; age: number }[] = [
    { name: "jack", age: 25 },
    { name: "ma", age: 22 },
  ];

  const { value, clear, removeIndex, add } = useArray(persons);

  useMount(() => {
    // 期待这里报错：Property 'notExist' does not exist on type '{ name: string; age: number; }[]'. name是个数组
    // console.log(value.notExist);
    // console.log(value[0].name);
    // 期待这里报错：Property 'age' is missing in type '{ name: string; }' but required in type '{ name: string; age: number; }'.
    // add({ name: "david" });
    // 期待这里报错：Argument of type 'string' is not assignable to parameter of type 'number'.
    // removeIndex("123");
  });
  return (
    <div>
      {/*期待: 点击以后增加 john */}
      <button onClick={() => add({ name: "john", age: 22 })}>add john</button>
      {/*期待: 点击以后删除第一项*/}
      <button onClick={() => removeIndex(0)}>remove 0</button>
      {/*期待：点击以后清空列表*/}
      <button style={{ marginBottom: "50px" }} onClick={() => clear()}>
        clear
      </button>
      {value.map((person, index) => (
        <div style={{ marginBottom: "30px" }} key={index}>
          <span style={{ color: "red" }}>{index}</span>
          <span>{person.name}</span>
          <span>{person.age}</span>
        </div>
      ))}
    </div>
  );
};
