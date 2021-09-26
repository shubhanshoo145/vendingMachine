export interface IErrorLoggedEvent {
  level: string;
  message: string;
  timestamp: string;
  rawMessage: string;
  meta: any;
}
