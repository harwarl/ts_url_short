import {
  Controller,
  Post,
  Body,
  Request,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

  @UseGuards(LocalGuard)
  @Post('/login')
  async login(@Request() req: any) {
    return await this.authService.login(req.user);
  }

  @Get('')
  async ping() {
    return {
      message: 'PONG',
    };
  }
}
