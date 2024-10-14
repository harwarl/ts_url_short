import { Injectable } from '@nestjs/common';
import { CreateShortDto } from './dto/create-short.dto';
import { UpdateShortDto } from './dto/update-short.dto';

@Injectable()
export class ShortService {
  create(createShortDto: CreateShortDto) {
    return 'This action adds a new short';
  }

  findAll() {
    return `This action returns all short`;
  }

  findOne(id: number) {
    return `This action returns a #${id} short`;
  }

  update(id: number, updateShortDto: UpdateShortDto) {
    return `This action updates a #${id} short`;
  }

  remove(id: number) {
    return `This action removes a #${id} short`;
  }
}
