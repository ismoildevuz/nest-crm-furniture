import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Staff } from '../../staff/models/staff.model';
import { Product } from '../../product/models/product.model';
import { City } from '../../city/models/city.model';
import { Contact } from '../../contact/models/contact.model';

interface OrderAttrs {
  id: string;
  full_name: string;
  address: string;
  target: string;
  status: string;
  description: string;
  product_id: string;
  staff_id: string;
  city_id: string;
  contact_id: string;
}

@Table({ tableName: 'order' })
export class Order extends Model<Order, OrderAttrs> {
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
  address: string;

  @Column({
    type: DataType.STRING,
  })
  target: string;

  @Column({
    type: DataType.STRING,
  })
  status: string;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  product_id: string;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.STRING,
  })
  staff_id: string;

  @ForeignKey(() => City)
  @Column({
    type: DataType.STRING,
  })
  city_id: string;

  @ForeignKey(() => Contact)
  @Column({
    type: DataType.STRING,
  })
  contact_id: string;

  @BelongsTo(() => Product)
  product: Product;

  @BelongsTo(() => Staff)
  staff: Staff;

  @BelongsTo(() => City)
  city: City;

  @BelongsTo(() => Contact)
  contact: Contact;
}
