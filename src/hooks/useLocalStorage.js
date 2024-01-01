import { useState } from "react";

function useLocalStorage(key, initialValue) {
  const readFromLS = () => {
    return JSON.parse(localStorage.getItem(key));
  };

  const [value, setValue] = useState(() => {
    const lsOrDie = readFromLS() !== null ? readFromLS() : initialValue;

    localStorage.setItem(key, JSON.stringify(lsOrDie));

    console.log("lsOrDie", lsOrDie);
    return lsOrDie;
  });

  const writeToLSandState = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, writeToLSandState];
}

export default useLocalStorage;
