import { useState, useEffect } from "react";

const useSessionStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    let currentValue;

    try {
      const stored = sessionStorage.getItem(key);
      if (stored === null) {
        currentValue = defaultValue;
      } else {
        currentValue = JSON.parse(stored);
      }
    } catch (error) {
      currentValue = defaultValue;
    }

    return currentValue;
  });

  // Sync state to sessionStorage when value changes
  useEffect(() => {
    if (value === null || value === undefined) {
      sessionStorage.removeItem(key);
    } else {
      sessionStorage.setItem(key, JSON.stringify(value));
    }
  }, [value, key]);

  // Listen for storage events (e.g., when sessionStorage.clear() is called)
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const stored = sessionStorage.getItem(key);
        if (stored === null) {
          setValue(defaultValue);
        } else {
          const parsed = JSON.parse(stored);
          if (parsed !== value) {
            setValue(parsed);
          }
        }
      } catch (error) {
        setValue(defaultValue);
      }
    };

    // Check on mount and when key changes
    handleStorageChange();
    
    // Note: storage events only fire in other tabs/windows, not the same tab
    // So we'll rely on the component re-reading on mount
  }, [key, defaultValue]);

  return [value, setValue];
};

export default useSessionStorage;
