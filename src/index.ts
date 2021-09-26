import * as dotenv from 'dotenv';

dotenv.config({
  path: `${process.cwd()}/.env`,
});

import 'reflect-metadata';
import container from './container';
import types from './constants/types';
import { IApplication } from './commons/interfaces/services/IApplication';

const diContainer = container;

const application = diContainer.get <IApplication> (types.Application);
application.initialize();
