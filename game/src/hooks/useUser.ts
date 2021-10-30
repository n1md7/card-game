import { useEffect, useState } from 'react';

const useUser = (): string | null => {
  const [name, setName] = useState<string | null>('');

  useEffect(() => {
    setName(localStorage.getItem('name'));
  }, []);

  return name;
};

export default useUser;
