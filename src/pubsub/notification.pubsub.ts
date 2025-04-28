import axios from 'axios';
import { notificationConfig }  from '../config/notification.config';
import { NotificationConfigItem } from '../config/notification-config-item';
import { User } from '../models/user.model';
import { RateLimiter } from '../utils/rate-limited-executor';


interface TaskGroup {
    config: typeof notificationConfig[keyof typeof notificationConfig];
    tasks: Array<() => Promise<void>>;
}


export class NotificationPubSub {
    private rateLimiters: Record<string, RateLimiter> = {};

    private getRateLimiter = (config: NotificationConfigItem): RateLimiter => {
        if (!this.rateLimiters[config.endpoint]) {
            console.log(`[PubSub] Creating new RateLimiter for endpoint: ${config.endpoint} with config:`, config);
            this.rateLimiters[config.endpoint] = new RateLimiter({
                rateLimit: config.rateLimit,
                rateLimitWindowMs: config.timeWindowMs,
                maxRetries: config.maxRetries,
                initialBackoffMs: config.initialBackoffMs,
                endpointName: config.endpoint,
            });
        } else {
            console.log(`[PubSub] Reusing existing RateLimiter for endpoint: ${config.endpoint}`);
        }
        return this.rateLimiters[config.endpoint];
    };

    public dispatch= async (user: User, messageContent: string): Promise<void> => {
        const taskGroups: Record<string, TaskGroup> = {};
    
        for (const [preference, enabled] of Object.entries(user.preferences)) {
          if (!enabled) continue;
    
          const config = notificationConfig[preference as keyof typeof notificationConfig];
          if (!config) continue;
    
          const userField = config.userProperty as keyof User;

          const userFieldValue = user[userField];
    
          if (!userFieldValue) continue;
    
          const data: any = {
            message: messageContent,
            [userField]: userFieldValue,
          };

          if (!taskGroups[config.endpoint]) {
            taskGroups[config.endpoint] = { config, tasks: [] };
          }

          console.log(`[PubSub] Preparing task for endpoint ${config.endpoint}, userField=${userField}, value=${userFieldValue}`);
    
          taskGroups[config.endpoint].tasks.push(async () => {
            try {
              await axios({
                method: config.httpMethod,
                url: config.endpoint,
                headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json',
                },
                data,
              });
            } catch (error: any) {
              console.error(`[PubSub] Failed sending to ${config.endpoint}:`, {
                status: error?.response?.status,
                data: error?.response?.data,
                message: error.message,
              });
              throw error;
            }
          });
        }
    
        await Promise.all(
          Object.values(taskGroups).map(group =>
            this.dispatchTasksForGroup(group.tasks, group.config)
          )
        );
    }

    private dispatchTasksForGroup = async (tasks: Array<() => Promise<void>>, config: NotificationConfigItem): Promise<void> => {
        console.log(`[PubSub] Dispatching ${tasks.length} tasks for group with config:`, config);
        const rateLimiter = this.getRateLimiter(config);
        console.log(`[PubSub] Executing tasks for endpoint ${config.endpoint} using RateLimiter.`);
        await rateLimiter.executeTasks(tasks);
        console.log(`[PubSub] Finished dispatching tasks for endpoint ${config.endpoint}.`);
    } 
}