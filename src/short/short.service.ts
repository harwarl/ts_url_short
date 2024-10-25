import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { REPOSITORY } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short.entity';
import { CreateShortDto, CreateShortUrlDto } from './dto/create-short.dto';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ShortService {
  private _counter: number;
  private _chars: string;
  constructor(
    @Inject(REPOSITORY.SHORT) private shortRepository: Repository<ShortUrl>,
    @Inject(REPOSITORY.USER) private userRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {
    this._counter = this.configService.get<number>('COUNTER');
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
    console.log({ counter: this._counter });
    //return the shortened Url
    return { shortUrl: `http://short.url/${hashStr}`, hash: hashStr };
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
      SELECT  DISTINCT 
        ru.role_id, 
        u.user_id, 
        u.username, 
        u.email, 
        u.created_at, 
        r.name AS role
      FROM roles_has_users ru 
      INNER JOIN users u 
      ON ru.user_id = u.user_id 
      INNER JOIN roles r 
      ON ru.role_id = r.role_id
      WHERE u.user_id = ?
      `,
      [createShortDto.user_id],
    );

    if (user.length < 1) {
      throw new NotFoundException('User not found');
    }
    const _u = user[0];
    const _isAdminOrSubscriber = ['admin', 'subscribed'].includes(_u.role);

    //todo:
    /**
     * Check the user role and check the number of remaining free short urls
     */
    if (_isAdminOrSubscriber) {
      //get the user and the url hash
      const { shortUrl, hash } = this.shortenUrl();
      //Save the shortenUrl in the database
      const short = await this.shortRepository.query(
        `
        INSERT INTO urls (
            short_id,
            original_url,
            expires_at,
            created_at,
            user_id
        ) VALUES (
            ?, ?, ?, ?, ?
        );
        `,
        [
          hash,
          createShortDto.longUrl,
          new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          new Date(),
          createShortDto.user_id,
        ],
      );
      return {
        shortUrl,
        succes: true,
      };
    } else {
    }
  }

  async getUserShorts(_currentUserId: number) {
    const shorts = await this.shortRepository.query(
      `
      SELECT * 
      FROM urls
      WHERE user_id = ?
      `,
      [_currentUserId],
    );

    return {
      success: true,
      shorts,
    };
  }

  async redirectShortUrl(short_id: string, res: Response) {
    const short = await this.getShortUrlById(short_id);
    if (!short?.length) {
      throw new NotFoundException('Short Url Not Found');
    }

    const { original_url: originalUrl } = short[0];
    return res.redirect(originalUrl);
  }

  async deleteUrl(_shortUrlId: string) {
    const short = await this.getShortUrlById(_shortUrlId);

    if (!short?.length) {
      throw new NotFoundException('Short Url Not Found');
    }

    await this.shortRepository.query(
      `
      DELETE FROM urls WHERE short_id = ?
      `,
      [_shortUrlId],
    );

    return {
      success: true,
      message: 'Short Deleted',
    };
  }

  async getShortUrlById(_shortUrlId: string) {
    const short = await this.shortRepository.query(
      `
      SELECT * from urls WHERE short_id = ?
      `,
      [_shortUrlId],
    );

    return short;
  }

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
