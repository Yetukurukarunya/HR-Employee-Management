import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  const [compactMode, setCompactMode] = useState(() => {
    return localStorage.getItem('compactMode') === 'true';
  });

  useEffect(() => {
    // Listen to changes in system color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Add event listener (cross-browser compatibility)
    try {
      mediaQuery.addEventListener('change', handleSystemChange);
    } catch (err) {
      mediaQuery.addListener(handleSystemChange);
    }

    return () => {
      try {
        mediaQuery.removeEventListener('change', handleSystemChange);
      } catch (err) {
        mediaQuery.removeListener(handleSystemChange);
      }
    };
  }, []);

  useEffect(() => {
    // Apply theme attribute to document root
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    // Apply compact mode class
    if (compactMode) {
      document.body.classList.add('compact-mode');
    } else {
      document.body.classList.remove('compact-mode');
    }
    localStorage.setItem('compactMode', compactMode);
  }, [theme, compactMode]);

  const changeTheme = (newTheme) => {
    setTheme(newTheme);
  };

  const toggleCompactMode = () => {
    setCompactMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      changeTheme, 
      compactMode, 
      toggleCompactMode,
      setCompactMode 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
