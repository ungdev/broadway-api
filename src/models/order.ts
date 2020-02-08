import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  PrimaryKey,
  HasMany,
  BeforeCreate,
  Default,
  DataType,
} from 'sequelize-typescript';
import shortid from 'shortid';
import { Representation } from '../types';
import User from './user';

@Table({
  tableName: 'orders',
  paranoid: true,
})
export default class Order extends Model<Order> {
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column(DataType.ENUM('friday', 'saturday'))
  public representation: Representation;

  @AllowNull(false)
  @Column
  public firstname: string;

  @AllowNull(false)
  @Column
  public lastname: string;

  @AllowNull(false)
  @Default('draft')
  @Column
  public transactionState: string;

  @Column
  public paidAt: string;

  @AllowNull(false)
  @Unique
  @Column
  public email: string;

  @HasMany(() => User)
  public users: User[];

  @BeforeCreate
  static addId(instance: Order) {
    // eslint-disable-next-line no-param-reassign
    instance.id = shortid.generate();
  }
}
