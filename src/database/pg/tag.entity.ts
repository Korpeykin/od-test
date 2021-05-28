import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'Tag',
  timestamps: false,
  modelName: 'Tag',
})
export class Tag extends Model {
  @Column({
    type: DataType.INTEGER,
  })
  id: string;

  @Column({
    type: DataType.UUID,
  })
  creator: string;

  @Column({
    type: DataType.STRING(40),
  })
  name: string;

  @Column({
    type: DataType.INTEGER,
    defaultValue: 0,
  })
  sortOrder: string;
}
