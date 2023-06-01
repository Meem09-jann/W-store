'use client'

import React, { createContext, useState } from 'react';


const initialCount = 0;

export const Context = createContext<[number, React.Dispatch<React.SetStateAction<number>>]>([
  0,
   ()=>{}
]);

export const ContextProvider = ({ children }) => {
  const [count, setCount] = useState<number>(initialCount);

  return (
    <Context.Provider value={[ count, setCount ]}>
      {children}
    </Context.Provider>
  );
};