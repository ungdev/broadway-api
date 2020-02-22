import {
  Table,
  Column,
  Model,
  AllowNull,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
  BeforeCreate,
  DataType,
} from 'sequelize-typescript';
import Order from './order';
import Item from './item';
import nanoid from '../utils/nanoid';

@Table({
  tableName: 'users',
  paranoid: true,
})
export default class User extends Model<User> {
  @PrimaryKey
  @Column
  id: string;

  @AllowNull(false)
  @Column
  public firstname: string;

  @AllowNull(false)
  @Column
  public lastname: string;

  @Column(DataType.ENUM('male', 'female', 'unknown'))
  public gender: string;

  @AllowNull(false)
  @Default(false)
  @Column
  public isScanned: boolean;

  @AllowNull(false)
  @ForeignKey(() => Order)
  @Column
  public orderId: string;

  @BelongsTo(() => Order)
  public order: Order;

  @AllowNull(false)
  @ForeignKey(() => Item)
  @Column
  public itemId: number;

  @BelongsTo(() => Item)
  public item: Item;

  @BeforeCreate
  static async addId(instance: Order) {
    // eslint-disable-next-line no-param-reassign
    instance.id = await nanoid();
  }
}
