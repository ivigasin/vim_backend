import { HttpMethod } from './config';

export interface NotificationConfigItem {
    endpoint: string;
    httpMethod: HttpMethod
    userProperty: string; 
    rateLimit: number;
    timeWindowMs: number;
    maxRetries: number;
    initialBackoffMs: number;
    maxChunkSize?: number;
  }