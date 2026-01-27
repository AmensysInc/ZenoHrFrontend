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
  // This helps detect when sessionStorage.clear() is called externally
  useEffect(() => {
    const checkStorage = () => {
      try {
        const stored = sessionStorage.getItem(key);
        if (stored === null) {
          // If storage is cleared but state still has a value, reset it
          setValue((currentValue) => {
            return currentValue !== defaultValue ? defaultValue : currentValue;
          });
        } else {
          const parsed = JSON.parse(stored);
          // Only update if the parsed value is different from current state
          setValue((currentValue) => {
            return JSON.stringify(parsed) !== JSON.stringify(currentValue) ? parsed : currentValue;
          });
        }
      } catch (error) {
        setValue((currentValue) => {
          return currentValue !== defaultValue ? defaultValue : currentValue;
        });
      }
    };

    // Check storage periodically (every 200ms) to catch external clears
    // This is a workaround since storage events don't fire in the same tab
    const interval = setInterval(checkStorage, 200);
    
    return () => clearInterval(interval);
  }, [key, defaultValue]);

  return [value, setValue];
};

export default useSessionStorage;
