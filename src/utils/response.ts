export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T | null;
}

export const successResponse = <T = any>(
  message: string,
  data?: T | null
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: true,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
};

export const errorResponse = <T = any>(
  message: string,
  data?: T | null
): ApiResponse<T> => {
  const response: ApiResponse<T> = {
    success: false,
    message,
  };

  if (data !== undefined) {
    response.data = data;
  }

  return response;
};