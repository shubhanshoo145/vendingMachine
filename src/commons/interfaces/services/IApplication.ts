export interface IApplication {
  initialize(): Promise<void>;
  gracefulShutdown(error: Error): void;
}