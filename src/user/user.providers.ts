import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { DATA_SOURCE, REPOSITORY } from 'src/utils/constants';

export const UserProviders = [
  {
    provide: REPOSITORY.USER,
    useFactory: (dataSource: DataSource) => {
      dataSource.getRepository(User);
    },
    inject: [DATA_SOURCE],
  },
];
