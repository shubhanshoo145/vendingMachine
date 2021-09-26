// Imports
import { IConfig } from 'config';
import { injectable, inject } from 'inversify';
import * as moment from 'moment';
import { Document, Model, Types } from 'mongoose';

import types from '../../../constants/types';
import { createLogger, format, Logger, transports } from 'winston';
import { ILoggerService } from '../../../commons/interfaces/services/ILoggerService';

@injectable()
export class LoggerService implements ILoggerService {
  private winston: Logger;
  private readonly MAX_TRANSFORMATION_DEPTH: number = 5;

  constructor(@inject(types.Config) config: IConfig) {

    this.winston = createLogger({
      transports: [
        new transports.Console({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.json(),
          ),
          handleExceptions: true,
        }),
      ],
      exitOnError: false,
    });
  }

  public silly(message: string, metadata?: any): void {
    this.winston.silly(message, this.transformPayload(metadata));
  }

  public debug(message: string, metadata?: any): void {
    this.winston.debug(message, this.transformPayload(metadata));
  }

  public verbose(message: string, metadata?: any): void {
    this.winston.verbose(message, this.transformPayload(metadata));
  }

  public info(message: string, metadata?: any): void {
    this.winston.info(message, this.transformPayload(metadata));
  }

  public warn(message: string, metadata?: any): void {
    this.winston.warn(message, this.transformPayload(metadata));
  }

  public error(message, metadata?: any): void {
    this.winston.error(message, this.transformPayload(metadata));
  }

  private transformPayload(target: any): any {
    if (!target) {
      return {};
    }

    return this.transformProperty(target);
  }

  private transformProperty(node: any, depth = 0): any {
    if (node && Array.isArray(node)) {
      if (depth > this.MAX_TRANSFORMATION_DEPTH) {
        return 'Maximum depth reached, aborting further transformation';
      }

      return node.map((entry) => {
        return this.transformProperty(entry, depth + 1);
      });
    }

    if (node && typeof (node) === 'object') {
      if (depth > this.MAX_TRANSFORMATION_DEPTH) {
        return 'Maximum depth reached, aborting further transformation';
      }

      let transformedNode = node;
      const resultObject = Object.create(transformedNode);

      if (node instanceof Error) {
        return {
          errorMessage: node.message,
          errorStack: node.stack,
          errorData: node['data'] || {},
        };
      }

      if (node instanceof Types.ObjectId) {
        return (node as Types.ObjectId).toString();
      }

      if (node instanceof Date || node instanceof moment) {
        return (node as any).toISOString();
      }

      if (node instanceof Model) {
        transformedNode = (node as Document).toObject();
      }

      Object.keys(transformedNode).forEach((key) => {
        resultObject[key] = this.transformProperty(transformedNode[key], depth + 1);
      });
      return resultObject;
    }

    return node;
  }
}
