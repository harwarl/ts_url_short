import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleProviders } from './role.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RoleService, ...RoleProviders],
})
export class RoleModule {}
