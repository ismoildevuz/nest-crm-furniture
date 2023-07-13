import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';
// import { City } from '../../city/models/city.model';

interface RegionAttrs {
  id: string;
  name: string;
}

@Table({ tableName: 'region' })
export class Region extends Model<Region, RegionAttrs> {
  @Column({
    type: DataType.STRING,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
  })
  name: string;

  // @HasMany(() => City)
  // city: City;
}
