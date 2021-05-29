import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Tag } from './tag.entity';

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
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING(100),
  })
  password: string;

  @Column({
    type: DataType.STRING(30),
    unique: true,
  })
  nickname: string;

  @HasMany(() => Tag)
  tags: Tag[];
}
