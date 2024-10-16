export class CreateShortUrlDto {
  longUrl: string;
}

export class CreateShortDto extends CreateShortUrlDto {
  user_id: number;
}
