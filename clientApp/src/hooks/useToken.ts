import { useEffect, useState } from 'react';
import { tokenStore } from '../services/token';
import { Token } from 'shared-types';

const useToken = (): string | null => {
  const [token, setToken] = useState<string | null>('');

  useEffect(() => {
    const myToken = localStorage.getItem(Token.auth);
    setToken(myToken);
    tokenStore.setToken(myToken);
  }, []);

  return token;
};

export default useToken;
