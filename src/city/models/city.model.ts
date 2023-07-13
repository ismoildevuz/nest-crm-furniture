import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { Region } from '../../region/models/region.model';
import { Order } from '../../order/models/order.model';

interface CityAttrs {
  id: string;
  name: string;
  region_id: string;
}

@Table({ tableName: 'city' })
export class City extends Model<City, CityAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  @ForeignKey(() => Region)
  @Column({
    type: DataType.STRING,
  })
  region_id: string;

  @BelongsTo(() => Region)
  region: Region;

  @HasMany(() => Order)
  order: Order;
}
