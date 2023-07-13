import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
import { Contact } from '../../contact/models/contact.model';
import { Product } from '../../product/models/product.model';
import { Order } from '../../order/models/order.model';

interface StaffAttrs {
  id: string;
  full_name: string;
  phone_number: string;
  card: string;
  role: string;
  login: string;
  hashed_password: string;
  hashed_refresh_token: string;
  is_active: boolean;
}

@Table({ tableName: 'staff' })
export class Staff extends Model<Staff, StaffAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  full_name: string;

  @Column({
    type: DataType.STRING,
  })
  phone_number: string;

  @Column({
    type: DataType.STRING,
  })
  card: string;

  @Column({
    type: DataType.STRING,
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  login: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_password: string;

  @Column({
    type: DataType.STRING,
  })
  hashed_refresh_token: string;

  @Column({
    type: DataType.BOOLEAN,
    defaultValue: true,
  })
  is_active: boolean;

  @HasMany(() => Contact)
  contact: Contact;

  @HasMany(() => Product)
  product: Product;

  @HasMany(() => Order)
  order: Order;
}
