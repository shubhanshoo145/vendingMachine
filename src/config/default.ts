import 'reflect-metadata';
import { deferConfig } from 'config/defer';
import { IServiceConfig } from '../commons/interfaces/config/IServiceConfig';

const config: IServiceConfig = {
  mongoose: {
    DB: 'vendingMachine',
    DB_URI: 'host.docker.internal:27017',
    DB_USERNAME: null,
    DB_PASSWORD_ENCRYPTED: null,
    DB_CONNECTION_STRING: deferConfig(() => `mongodb://${config.mongoose.DB_URI}/${config.mongoose.DB}`),
    REPLICA_SET: null,
  },
  httpServer: {
    PORT: 4703,
    KEEPALIVE_TIMEOUT: 120000,
    REQUEST_TIMEOUT: 120000,
  },
};

export default config;
