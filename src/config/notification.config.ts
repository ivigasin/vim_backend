import { NotificationConfigItem } from './notification-config-item';
import { getEnvVar, getEnvVarHttpMethod, getEnvVarNumber } from './config';


const notificationTypes: string[] = Array.from(
  new Set(
    Object.keys(process.env)
      .filter(key => key.startsWith('NOTIFICATION_') && key.endsWith('_ENDPOINT'))
      .map(key => key.replace('NOTIFICATION_', '').replace('_ENDPOINT', ''))
  )
);

export const notificationConfig: Record<string, NotificationConfigItem> = {};

for (const type of notificationTypes) {
  const lowerCaseType = type.toLowerCase();

  notificationConfig[lowerCaseType] = {
    endpoint: getEnvVar(`NOTIFICATION_${type}_ENDPOINT`),
    httpMethod: getEnvVarHttpMethod(`NOTIFICATION_${type}_HTTP_METHOD`, 'POST'),
    userProperty: getEnvVar(`NOTIFICATION_${type}_USER_PROPERTY`), 
    rateLimit: getEnvVarNumber(`NOTIFICATION_${type}_RATE_LIMIT`, 5),
    timeWindowMs: getEnvVarNumber(`NOTIFICATION_${type}_TIME_WINDOW_MS`, 1000),
    maxRetries: getEnvVarNumber(`NOTIFICATION_${type}_MAX_RETRIES`, 3),
    initialBackoffMs: getEnvVarNumber(`NOTIFICATION_${type}_INITIAL_BACKOFF_MS`, 1000),
    maxChunkSize: getEnvVarNumber(`NOTIFICATION_${type}_MAX_CHUNK_SIZE`, 10),
  };

  console.log('settings:',notificationConfig[lowerCaseType]);
}
