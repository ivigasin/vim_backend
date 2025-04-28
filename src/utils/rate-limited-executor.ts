export const sleep = (ms: number): Promise<void> => {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  
  export interface RateLimiterOptions {
    rateLimit: number;  
    rateLimitWindowMs: number;
    endpointName?: string;
    maxRetries?: number;
    initialBackoffMs?: number; 
    maxChunkSize?: number;
  }
  
  export class RateLimiter {
    private allowedRequests: number;
    private timeFrameSize: number;
    private timestamps: number[] = [];
  
    constructor(private options: RateLimiterOptions) {
      this.allowedRequests = options.rateLimit;
      this.timeFrameSize = options.rateLimitWindowMs;
      console.log(`[RateLimiter] Initialized with options:`, options);
    }
  
    private shouldAllow(currentTimestamp: number): boolean {
      const windowStart = currentTimestamp - this.timeFrameSize;
  
      while (this.timestamps.length > 0 && this.timestamps[this.timestamps.length - 1] <= windowStart) {
        this.timestamps.pop();
      }
  
      if (this.timestamps.length < this.allowedRequests) {
        this.timestamps.unshift(currentTimestamp); // Add new timestamp
        return true;
      } else {
        return false;
      }
    }
  
    public executeTasks = async (tasks: Array<() => Promise<void>>): Promise<void> => {
      const { endpointName, maxRetries = 3, initialBackoffMs = 1000, maxChunkSize } = this.options;
  
      console.log(`[RateLimiter] Starting execution of ${tasks.length} tasks${endpointName ? ` for ${endpointName}` : ''}.`);
      console.log(`[RateLimiter] Allowing up to ${this.allowedRequests} tasks every ${this.timeFrameSize}ms.`);
  
      // If chunking is enabled
      if (maxChunkSize && maxChunkSize > 0) {
        console.log(`[RateLimiter] Splitting tasks into chunks of size ${maxChunkSize}.`);
        const chunks = this.chunkArray(tasks, maxChunkSize);
        for (let c = 0; c < chunks.length; c++) {
          console.log(`[RateLimiter] Executing chunk ${c + 1}/${chunks.length}...`);
          await this.executeChunk(chunks[c], maxRetries, initialBackoffMs);
        }
      } else {
        // Normal execution without chunking
        await this.executeChunk(tasks, maxRetries, initialBackoffMs);
      }
  
      console.log(`[RateLimiter] Finished executing all tasks${endpointName ? ` for ${endpointName}` : ''}.`);
    };
  
    private executeChunk = async (chunk: Array<() => Promise<void>>, maxRetries: number, initialBackoffMs: number): Promise<void> => {
      for (let i = 0; i < chunk.length; i++) {
        const now = Date.now();
  
        if (!this.shouldAllow(now)) {
          const nextAvailableTime = (this.timestamps[this.timestamps.length - 1] || now) + this.timeFrameSize;
          const waitTime = nextAvailableTime - now;
          console.warn(`[RateLimiter] Rate limit reached. Sleeping for ${waitTime}ms...`);
          await sleep(waitTime);
        }
  
        console.log(`[RateLimiter] Executing task ${i + 1}/${chunk.length} in current chunk...`);
  
        let success = false;
        let attempt = 0;
        let backoff = initialBackoffMs;
  
        while (!success && attempt <= maxRetries) {
          try {
            await chunk[i]();
            success = true;
            console.log(`[RateLimiter] Task ${i + 1} succeeded on attempt ${attempt + 1}.`);
          } catch (error) {
            attempt++;
            if (attempt > maxRetries) {
              console.error(`[RateLimiter] Task ${i + 1} failed after ${maxRetries} retries.`);
              break;
            }
  
            if (error instanceof Error) {
              console.warn(`[RateLimiter] Task ${i + 1} failed on attempt ${attempt}: ${error.message}`);
            } else {
              console.warn(`[RateLimiter] Task ${i + 1} failed on attempt ${attempt}.`);
            }
  
            console.log(`[RateLimiter] Backing off for ${backoff}ms before retrying...`);
            await sleep(backoff);
            backoff *= 2;
          }
        }
      }
    };
  
    private chunkArray = <T>(array: T[], chunkSize: number): T[][] => {
      const chunks: T[][] = [];
      for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
      }
      return chunks;
    };
  }
  