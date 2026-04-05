import { DataSource, DataSourceOptions } from 'typeorm';
import typeOrmConfig from '../../../config/typeorm.config';

const dataSource = new DataSource(typeOrmConfig as DataSourceOptions);

export default dataSource;
