import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Users',
  timestamps: false,
  modelName: 'Users',
})
export class Users extends Model {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
  })
  uid: string;

  @Column({
    type: DataType.STRING(100),
  })
  email: string;

  @Column({
    type: DataType.STRING(100),
  })
  password: string;

  @Column({
    type: DataType.STRING(30),
  })
  nickname: string;
}
