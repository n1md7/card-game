import { Database } from '@n1md7/indexeddb-promise';
import { getRandomInt } from '../../libs/Formulas';

export interface Users {
  id?: number;
  name: string;
  token: string;
}

export const database = new Database<Users>({
  version: 1,
  name: 'Card-Game',
  tables: [
    {
      name: 'users',
      primaryKey: {
        name: 'id',
        autoIncrement: true,
        unique: true,
      },
      initData: [
        {
          name: 'Noob' + getRandomInt(3, 3),
          token: '',
        },
      ],
      indexes: {
        name: {
          unique: false,
        },
      },
      timestamps: true,
    },
  ],
});
