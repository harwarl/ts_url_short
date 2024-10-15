import { Controller, Post, Body, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { Public } from './decorators/public.decorator';

@Public()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.authService.register(createUserDto);
  }

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
