import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Tag } from './tag.entity';
import { Users } from './users.entity';

@Table({
  tableName: 'UserTags',
  timestamps: false,
  modelName: 'UserTags',
})
export class UserTags extends Model {
  @Column({
    type: DataType.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Users)
  @Column({
    type: DataType.UUID,
  })
  userId: string;

  @ForeignKey(() => Tag)
  @Column({
    type: DataType.INTEGER,
  })
  tagId: number;

  @BelongsTo(() => Tag)
  tag: Tag;

  @BelongsTo(() => Users)
  user: Users;
}
