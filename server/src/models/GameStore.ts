import {AutoIncrement, Column, Model, PrimaryKey, Table} from 'sequelize-typescript';

export enum GameStatus {
  active,
  inactive,
  ended
}

@Table({
  tableName: 'games',
  timestamps: true,
})
export default class User extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Column
  name!: string;

  @Column
  gameId!: string;

  @Column
  player!: string;

  @Column
  socketId!: string;
}
