//This file remembers the user's visual theme (like Dark Mode vs. Light Mode, or specific color schemes). Because it's a Context, any button, text, or background anywhere in your app can easily check this file to know what colors they should be using.
import React, { createContext, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import { antdTheme } from '../styles/antdTheme';

const ThemeContext = createContext({});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        ...antdTheme,
      }}
    >
      <ThemeContext.Provider value={{}}>
        {children}
      </ThemeContext.Provider>
    </ConfigProvider>
  );
};
