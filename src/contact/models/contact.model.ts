import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Staff } from '../../staff/models/staff.model';
import { Order } from '../../order/models/order.model';

interface ContactAttrs {
  id: string;
  phone_number: string;
  unique_id: string;
  status: string;
  is_old: boolean;
  staff_id: string;
}

@Table({ tableName: 'contact' })
export class Contact extends Model<Contact, ContactAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  unique_id: string;

  @Column({
    type: DataType.STRING,
  })
  status: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: false,
  })
  is_old: boolean;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.STRING,
  })
  staff_id: string;

  @BelongsTo(() => Staff)
  staff: Staff;

  @HasMany(() => Order)
  order: Order;
}
