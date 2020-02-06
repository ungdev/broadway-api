import { Table, Column, Model, AllowNull, Unique, HasOne } from 'sequelize-typescript';
import User from './user';

@Table({
  tableName: 'tickettypes',
})
export default class TicketType extends Model<TicketType> {
  @AllowNull(false)
  @Unique
  @Column
  public title: string;

  @AllowNull(false)
  @Column
  public description: string;

  @AllowNull(false)
  @Column
  public price: number;

  @HasOne(() => User)
  public user: User;
}
