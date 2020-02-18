import shortid from 'shortid';
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
} from 'sequelize-typescript';
import Order from './order';
import Item from './item';

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
  static addId(instance: Order) {
    // eslint-disable-next-line no-param-reassign
    instance.id = shortid.generate();
  }
}
