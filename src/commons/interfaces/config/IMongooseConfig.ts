export interface IMongooseConfig {
  DB: string;
  DB_URI: string;
  DB_USERNAME: string;
  DB_PASSWORD_ENCRYPTED: string;
  DB_CONNECTION_STRING: string;
  REPLICA_SET: string;
}