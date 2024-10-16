import { Injectable, Inject } from '@nestjs/common';
import { REPOSITORY } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short.entity';
import { CreateShortDto, CreateShortUrlDto } from './dto/create-short.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ShortService {
  private _counter: number;
  private _chars: string;
  constructor(
    @Inject(REPOSITORY.SHORT) private shortRepository: Repository<ShortUrl>,
    @Inject(REPOSITORY.USER) private userRepository: Repository<User>,
  ) {
    this._counter = 100000000000;
    this._chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  }

  private base10ToBase62(_deci: number) {
    let hashStr = '';
    while (_deci > 0) {
      let remainder = _deci % 62;
      let char = this._chars[remainder] ? this._chars[remainder] : '';
      hashStr = char + hashStr;
      _deci = Math.floor(_deci / 62);
    }
    return hashStr;
  }

  private base62ToBase10(_str: string) {
    let num = 0;
    for (let i = _str.length - 1; i >= 0; i--) {
      num =
        num +
        Math.pow(62, _str.length - 1 - i) * parseInt(this.convert(_str[i]), 10);
    }
    return num;
  }

  private shortenUrl() {
    //shorten the url based on the current counter
    const hashStr = this.base10ToBase62(this._counter);
    //increase the counter
    this._counter++;
    return `http://short.url/${hashStr}`;
  }

  async createShortUrl(createShortDto: CreateShortDto) {
    //TODO:
    /**
     * Check to see if the user exists and check his role
     * if user is subscriber, check if he has not maxed the number of urls out
     */
    //Get User with roles
    const user = await this.userRepository.query(
      `
      SELECT role_id FROM users INNER JOIN roles ON users.role_id = roles.role_id WHERE user_id=?
      `,
      [createShortDto.user_id],
    );

    console.log({ user: user[0] });
  }

  async getUserShorts() {}
  async deleteUrl() {}
  async getOriginalUrl() {}

  convert(_char: string): any {
    if (_char >= '0' && _char <= '9') {
      return _char.charCodeAt(0) - '0'.charCodeAt(0);
    } else if (_char >= 'a' && _char <= 'z') {
      return _char.charCodeAt(0) - 'a'.charCodeAt(0) + 10;
    } else if (_char >= 'A' && _char <= 'Z') {
      return _char.charCodeAt(0) - 'A'.charCodeAt(0) + 36;
    }
    return undefined;
  }
}
