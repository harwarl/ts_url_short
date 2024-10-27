export class GetQueryDto {
  page?: number;
  limit?: number;
  expired?: boolean;
  startDate?: string;
  endDate?: string;
}
