import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { ShortUrl } from 'src/short/entities/short.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ type: 'string' })
  username: string;

  @Column({ type: 'string' })
  email: string;

  @Column({ type: 'string' })
  passsword: string;

  @Column({ type: 'timestamp' })
  created_at: Date;

  @OneToMany(() => ShortUrl, (shortUrl) => shortUrl.user_id)
  ShortUrls: ShortUrl[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    if (this.passsword) {
      this.passsword = await bcrypt.hash(this.passsword, 10);
    }
  }
}
