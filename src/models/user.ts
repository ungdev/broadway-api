import {
  Table,
  Column,
  Model,
  AllowNull,
  Unique,
  IsUUID,
  PrimaryKey,
  Default,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import Group from './group';
import TicketType from './ticketType';

@Table({
  tableName: 'users',
})
export default class User extends Model<User> {
  @IsUUID(4)
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
  public isScanned: false;

  @AllowNull(false)
  @ForeignKey(() => Group)
  @Column
  public groupId: string;

  @BelongsTo(() => Group)
  public group: Group;

  @AllowNull(false)
  @ForeignKey(() => TicketType)
  @Column
  public ticketTypeId: number;

  @BelongsTo(() => TicketType)
  public ticketType: TicketType;
}
