import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
} from '@nestjs/common';
import { ShortService } from './short.service';
import { CreateShortDto, CreateShortUrlDto } from './dto/create-short.dto';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('shorts')
export class ShortController {
  constructor(private readonly shortService: ShortService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createShortUrl(
    @CurrentUser('user_id') currentUserId: number,
    @Body() createShortUrlDto: CreateShortUrlDto,
  ) {
    return await this.shortService.createShortUrl({
      ...createShortUrlDto,
      user_id: currentUserId,
    } as CreateShortDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('')
  async getUserShorts(@CurrentUser('user_id') currentUserId: number) {
    return await this.shortService.getUserShorts(currentUserId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':shortId')
  async getSingleShort(@Param('shortId') shortId: string) {
    return await this.shortService.getShortUrlById(shortId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortId')
  async deleteSingleShort(@Param('shortId') shortId: string) {
    return await this.shortService.deleteUrl(shortId);
  }
}
