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
  @Unique
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

  @AllowNull(true)
  @Column
  public transactionId: number;

  @AllowNull(false)
  @Default('draft')
  @Column
  public transactionState: string;

  @Column
  public paidAt: Date;

  @AllowNull(false)
  @Column
  public email: string;

  @HasMany(() => User)
  public users: User[];

  @BeforeCreate
  static addId(instance: Order) {
    if (!instance.id) {
      // eslint-disable-next-line no-param-reassign
      instance.id = shortid.generate();
    }
  }
}
