export type MicroserviceResponse<T = any> = {
  error?: string;
  errorData?: any;
  data?: T;
  text?: string;
  success: boolean;
};
