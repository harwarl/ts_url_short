import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { UserProviders } from './user.providers';
import { DatabaseModule } from 'src/database/database.module';
import { RoleProviders } from 'src/role/role.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [UserController],
  providers: [...UserProviders, ...RoleProviders, UserService],
  exports: [UserService],
})
export class UserModule {}
