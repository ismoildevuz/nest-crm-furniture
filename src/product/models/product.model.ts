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
import { Category } from '../../category/models/category.model';
import { Image } from '../../image/models/image.model';
import { Order } from '../../order/models/order.model';

interface ProductAttrs {
  id: string;
  name: string;
  price: number;
  description: string;
  category_id: string;
  staff_id: string;
}

@Table({ tableName: 'product' })
export class Product extends Model<Product, ProductAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @Column({
    type: DataType.DECIMAL,
  })
  price: number;

  @Column({
    type: DataType.STRING,
  })
  description: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.STRING,
  })
  category_id: string;

  @ForeignKey(() => Staff)
  @Column({
    type: DataType.STRING,
  })
  staff_id: string;

  @BelongsTo(() => Category)
  category: Category;

  @BelongsTo(() => Staff)
  staff: Staff;

  @HasMany(() => Image)
  image: Image;

  @HasMany(() => Order)
  order: Order;
}
