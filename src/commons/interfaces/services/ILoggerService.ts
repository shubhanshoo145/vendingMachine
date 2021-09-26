export interface ILoggerService {
  silly(message: string, metadata?: any): void;
  debug(message: string, metadata?: any): void;
  verbose(message: string, metadata?: any): void;
  info(message: string, metadata?: any): void;
  warn(message: string, metadata?: any): void;
  error(message, metadata?: any): void;
}