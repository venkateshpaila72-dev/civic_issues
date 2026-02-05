import { useState, useEffect } from 'react';

/**
 * Debounces a value — returns the value after it stops changing for `delay` ms.
 * Useful for search inputs to avoid hitting API on every keystroke.
 */
const useDebounce = (value, delay = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;