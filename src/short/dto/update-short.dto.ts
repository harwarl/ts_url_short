import { PartialType } from '@nestjs/mapped-types';
import { CreateShortDto } from './create-short.dto';

export class UpdateShortDto extends PartialType(CreateShortDto) {}
