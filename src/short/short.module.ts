import { Module } from '@nestjs/common';
import { ShortService } from './short.service';
import { ShortController } from './short.controller';
import { ShortProviders } from './short.providers';
import { UserProviders } from 'src/user/user.providers';
import { DatabaseModule } from 'src/database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ShortController],
  providers: [ShortService, ...ShortProviders, ...UserProviders],
})
export class ShortModule {}
