import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { ShortService } from './short.service';
import { CreateShortDto, CreateShortUrlDto } from './dto/create-short.dto';
import { CurrentUser } from 'src/user/decorator/currentUser.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Response } from 'express';
import { GetQueryDto } from './dto/getShortQuery.dto';

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
  async getUserShorts(
    @CurrentUser('user_id') currentUserId: number,
    @Query() query: GetQueryDto,
  ) {
    return await this.shortService.getUserShorts(currentUserId, query);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':shortId')
  async getSingleShort(
    @Param('shortId') shortId: string,
    @Res() res: Response,
  ) {
    return await this.shortService.redirectShortUrl(shortId, res);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':shortId')
  async deleteSingleShort(@Param('shortId') shortId: string) {
    return await this.shortService.deleteUrl(shortId);
  }
}
