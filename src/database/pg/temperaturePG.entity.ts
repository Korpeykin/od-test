import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({
  tableName: 'temperature',
  timestamps: false,
  modelName: 'TemperaturePG',
})
export class TemperaturePG extends Model {
  @Column({
    type: DataType.DATE,
    primaryKey: true,
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
