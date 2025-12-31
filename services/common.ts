export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
  success: boolean;
  total?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}
