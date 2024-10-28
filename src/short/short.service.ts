import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { REPOSITORY } from 'src/utils/constants';
import { Repository } from 'typeorm';
import { ShortUrl } from './entities/short.entity';
import {
  CreateCustomShortDto,
  CreateShortDto,
  CreateShortUrlDto,
} from './dto/create-short.dto';
import { User } from 'src/user/entities/user.entity';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
import { GetQueryDto } from './dto/getShortQuery.dto';

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
      //simple checks to check if user has exceeded the count
    }
  }

  async createCustomShortUrl(createCustomShortUrl: CreateCustomShortDto) {
    //get the user details
    // only admin and the subscriber can use this feature
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
      [createCustomShortUrl.user_id],
    );

    if (user.length < 1) {
      throw new NotFoundException('User Not Found');
    }

    const _u = user[0];
    const _isAdminOrSubscriber = ['admin', 'subscribed'].includes(_u.role);

    if (!_isAdminOrSubscriber) {
      throw new UnauthorizedException('Subscribe to be able to do this');
    }

    await this.shortRepository.query(
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
        createCustomShortUrl.custom_url,
        createCustomShortUrl.longUrl,
        new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        new Date(),
        createCustomShortUrl.user_id,
      ],
    );

    return {
      shortUrl: `http://short.url/${createCustomShortUrl.custom_url}`,
      success: true,
    };
  }

  async getUserShorts(_currentUserId: number, query: GetQueryDto) {
    const { page = 1, limit = 10, startDate, endDate } = query || {};
    const offset = (page - 1) * limit;
    const params: any[] = [_currentUserId];

    let queryString = `SELECT * FROM urls WHERE user_id = ?`;

    // startDate in format YYYY-MM-DD
    if (startDate) {
      params.push(startDate);
      queryString += ` AND created_at >= ?`;
    }
    if (endDate) {
      params.push(endDate);
      queryString += ` AND created_at <= ?`;
    }

    queryString += ` ORDER BY created_at DESC LIMIT ${offset}, ${limit}`;

    const shorts = await this.shortRepository.query(queryString, params);

    return {
      success: true,
      shorts,
      pages: Math.ceil(shorts / limit),
      page,
      limit,
    };
  }

  async redirectShortUrl(short_id: string, res: Response) {
    const short = await this.getShortUrlById(short_id);
    //Add expired here
    if (!short?.length) {
      throw new NotFoundException('Short Url Not Found');
    }

    if (short[0].expires_at < new Date()) {
      throw new BadRequestException('Short Url has expired');
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
