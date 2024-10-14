import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ShortService } from './short.service';
import { CreateShortDto } from './dto/create-short.dto';
import { UpdateShortDto } from './dto/update-short.dto';

@Controller('short')
export class ShortController {
  constructor(private readonly shortService: ShortService) {}

  @Post()
  create(@Body() createShortDto: CreateShortDto) {
    return this.shortService.create(createShortDto);
  }

  @Get()
  findAll() {
    return this.shortService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.shortService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateShortDto: UpdateShortDto) {
    return this.shortService.update(+id, updateShortDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shortService.remove(+id);
  }
}
