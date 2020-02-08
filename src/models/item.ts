import { Table, Column, Model, AllowNull, Unique, HasOne } from 'sequelize-typescript';
import User from './user';

@Table({
  tableName: 'items',
})
export default class Item extends Model<Item> {
  @AllowNull(false)
  @Unique
  @Column
  public name: string;

  @AllowNull(false)
  @Column
  public description: string;

  @AllowNull(false)
  @Column
  public price: number;

  @HasOne(() => User)
  public user: User;
}
