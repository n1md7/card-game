import { useEffect, useState } from 'react';
import { tokenStore } from '../services/token';

const useToken = (): string | null => {
  const [token, setToken] = useState<string | null>('');

  useEffect(() => {
    const myToken = localStorage.getItem('token');
    setToken(myToken);
    tokenStore.setToken(myToken);
  }, []);

  return token;
};

export default useToken;
