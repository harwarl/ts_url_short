import { DATA_SOURCE, REPOSITORY } from 'src/utils/constants';
import { DataSource } from 'typeorm';
import { ShortUrl } from './entities/short.entity';

export const ShortProviders = [
  {
    provide: REPOSITORY.SHORT,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(ShortUrl),
    inject: [DATA_SOURCE],
  },
];
