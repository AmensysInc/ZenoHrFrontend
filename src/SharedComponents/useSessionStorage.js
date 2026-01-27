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

  // Re-read from sessionStorage when key changes (e.g., after logout/login)
  useEffect(() => {
    const checkStorage = () => {
      try {
        const stored = sessionStorage.getItem(key);
        if (stored === null) {
          if (value !== defaultValue) {
            setValue(defaultValue);
          }
        } else {
          const parsed = JSON.parse(stored);
          // Only update if the parsed value is different from current state
          if (JSON.stringify(parsed) !== JSON.stringify(value)) {
            setValue(parsed);
          }
        }
      } catch (error) {
        if (value !== defaultValue) {
          setValue(defaultValue);
        }
      }
    };

    // Check storage periodically (every 100ms) to catch external clears
    // This is a workaround since storage events don't fire in the same tab
    const interval = setInterval(checkStorage, 100);
    
    return () => clearInterval(interval);
  }, [key, defaultValue, value]);

  return [value, setValue];
};

export default useSessionStorage;
