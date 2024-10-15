import { Inject, Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { REPOSITORY } from 'src/utils/constants';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UserService {
  constructor(
    @Inject(REPOSITORY.USER) private userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string): Promise<User | null> {
    const users: User[] = await this.userRepository.query(
      `SELECT * FROM users WHERE email=?`,
      [email],
    );

    return users.length > 0 ? users[0] : null;
  }

  async findById(id: number): Promise<User | null> {
    const user: User = await this.userRepository.query(
      `SELECT * FROM users WHERE id=?`,
      [id],
    );
    return user;
  }

  async findByUsername(username: string): Promise<User | null> {
    const user = await this.userRepository.query(
      `SELECT * FROM users WHERE username=?`,
      [username],
    );

    return user;
  }

  //ADD A NEW USER
  async createNewUser(createUserDto: CreateUserDto): Promise<User | null> {
    const user = await this.userRepository.query(
      `INSERT INTO users VALUES (DEFAULT, ?, ?, ?, ?, 1)`,
      [
        createUserDto.username,
        createUserDto.email,
        createUserDto.password,
        new Date(),
        createUserDto.role,
      ],
    );
    return user;
  }

  //UPDATE USER
  async updateExistingUser(
    user_id: number,
    updateUserDto: any,
  ): Promise<boolean> {
    try {
      let columns = Object.keys(updateUserDto);
      let columnValues = Object.values(updateUserDto);
      let updateValues = columns
        .map((column, index) => `${column} = $${[columnValues[index]]}`)
        .join(',');

      const update = await this.userRepository.query(
        `UPDATE users SET ${updateValues} WHERE user_id=${user_id} `,
      );

      console.log({ update });
      return true;
    } catch (error) {
      return false;
    }
  }
}
