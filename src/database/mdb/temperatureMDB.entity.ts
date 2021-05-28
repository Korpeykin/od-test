import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'temperature',
  timestamps: false,
  modelName: 'TemperatureMDB',
})
export class TemperatureMDB extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: number;

  @Column({
    type: DataType.DATE,
  })
  time: string;

  @Column({
    type: DataType.INTEGER,
  })
  tid: number;

  @Column({
    type: DataType.FLOAT,
  })
  value: number;
}
