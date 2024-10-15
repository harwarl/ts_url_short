import { BadRequestException, Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    let email = username;
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new BadRequestException('Invalid Credentials');
    }
    //Validate Password
    const isPasswordValid = await bcrypt.compare(pass, user.passsword);
    if (!isPasswordValid) {
      throw new BadRequestException('Invalid Credentials');
    }

    delete user.passsword;

    return user;
  }

  async login(user: User) {
    const payload = { email: user.email, user_id: user.user_id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(createUserDto: CreateUserDto) {
    const user = await this.userService.findByEmail(createUserDto.email);
    if (user) {
      throw new BadRequestException('Email already exists');
    }
    const newUser = await this.userService.createNewUser(createUserDto);
    return this.login(newUser);
  }
}
