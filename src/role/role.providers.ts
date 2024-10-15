import { DATA_SOURCE, REPOSITORY } from 'src/utils/constants';
import { DataSource } from 'typeorm';
import { Role } from './entities/role.entity';
import { Inject } from '@nestjs/common';

export const RoleProviders = [
  {
    provide: REPOSITORY.ROLE,
    useFactory: (dataSource: DataSource) => dataSource.getRepository(Role),
    inject: [DATA_SOURCE],
  },
];
