export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

export class ApiResponseFormatter {
  static success<T>(message: string, data?: T): ApiResponse<T> {
    return {
      success: true,
      message,
      data,
    };
  }

  static error(message: string, error?: string): ApiResponse {
    return {
      success: false,
      message,
      error,
    };
  }
}
