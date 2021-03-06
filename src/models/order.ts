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
} from 'sequelize-typescript';
import User from './user';
import nanoid from '../utils/nanoid';

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
  @Column
  public representation: number;

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
  @Default(false)
  @Column
  public forcePay: boolean;

  @AllowNull(false)
  @Column
  public email: string;

  @Column
  public ip: string;

  @HasMany(() => User)
  public users: User[];

  @BeforeCreate
  static async addId(instance: Order) {
    if (!instance.id) {
      // eslint-disable-next-line no-param-reassign
      instance.id = await nanoid();
    }
  }
}
