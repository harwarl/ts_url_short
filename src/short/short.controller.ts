import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ShortService } from './short.service';
import { CreateShortDto, CreateShortUrlDto } from './dto/create-short.dto';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Public } from 'src/auth/decorators/public.decorator';

@Controller('short')
export class ShortController {
  constructor(private readonly shortService: ShortService) {}

  @Post()
  async createShortUrl(
    @Req() req: any,
    @CurrentUser('id') currentUserId: number,
    @Body() createShortUrlDto: CreateShortUrlDto,
  ) {
    console.log(req);
    // const user_id = currentUserId;
    // return await this.shortService.createShortUrl({
    //   user_id,
    //   ...createShortUrlDto,
    // });
  }
}
