import os from 'os';
import { not } from './extras';

type Ip = {
  value: string | null;
  address: string;
};

export const ip: Ip = {
  value: null,
  get address() {
    if (ip.value !== null) return ip.value;
    const [{ address = '[::1]' }] = Object.values(os.networkInterfaces())
      .flat()
      .filter((item) => not(item.internal) && item.family === 'IPv4');
    ip.value = address;
    return address;
  },
};
