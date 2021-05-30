import {AutoIncrement, Column, Model, PrimaryKey, Table} from 'sequelize-typescript';


@Table({
  tableName: 'users',
  timestamps: true,
})
export default class UserStore extends Model {
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
