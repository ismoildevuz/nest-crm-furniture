import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Product } from '../../product/models/product.model';

interface ImageAttrs {
  id: string;
  file_name: string;
  product_id: string;
}

@Table({ tableName: 'image' })
export class Image extends Model<Image, ImageAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  file_name: string;

  @ForeignKey(() => Product)
  @Column({
    type: DataType.STRING,
  })
  product_id: string;

  @BelongsTo(() => Product)
  product: Product;
}
