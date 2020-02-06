import { Table, Column, Model, AllowNull, Unique, IsUUID, PrimaryKey, HasMany } from 'sequelize-typescript';
import { Representation } from '../types';
import User from './user';

@Table({
  tableName: 'groups',
})
export default class Group extends Model<Group> {
  @IsUUID(4)
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  public representation: Representation;

  @AllowNull(false)
  @Column
  public firstname: string;

  @AllowNull(false)
  @Column
  public lastname: string;

  @AllowNull(false)
  @Unique
  @Column
  public email: string;

  @HasMany(() => User)
  public users: User[];
}
