
import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue: Dispatch<SetStateAction<T>> = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
        if (e.key === key) {
             try {
                setStoredValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
             } catch(error) {
                console.error(error);
             }
        }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
        window.removeEventListener('storage', handleStorageChange);
    };
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, initialValue]);

  return [storedValue, setValue];
}

export default useLocalStorage;
