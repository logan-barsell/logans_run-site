import React, { createContext, useState, useContext } from 'react';

const NavHeightContext = createContext({
  topNavHeight: 0,
  setTopNavHeight: () => {},
});

export const NavHeightProvider = ({ children }) => {
  const [topNavHeight, setTopNavHeight] = useState(0);
  return (
    <NavHeightContext.Provider value={{ topNavHeight, setTopNavHeight }}>
      {children}
    </NavHeightContext.Provider>
  );
};

export const useNavHeight = () => useContext(NavHeightContext);
