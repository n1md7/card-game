import { useEffect, useState } from 'react';
import { Token } from 'shared-types';

const useUser = (): string | null => {
  const [name, setName] = useState<string | null>('');

  useEffect(() => {
    setName(localStorage.getItem(Token.name));
  }, []);

  return name;
};

export default useUser;
