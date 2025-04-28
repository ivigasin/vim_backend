import dotenv from 'dotenv';

dotenv.config();

export const getEnvVar = (name: string): string => {
    const value = process.env[name];
    if(!value) {
        throw new Error(`Environment variable ${name} is not defined.`);
    }

    return value;
}

const allowedHttpMethods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const;

export type HttpMethod = typeof allowedHttpMethods[number];

export function getEnvVarHttpMethod(name: string, defaultValue: HttpMethod = 'POST'): HttpMethod {
    const value = process.env[name];
  
    if (value === undefined) {
      return defaultValue;
    }
  
    const upperValue = value.toUpperCase();
  
    if (!allowedHttpMethods.includes(upperValue as HttpMethod)) {
      throw new Error(`Environment variable ${name} must be one of ${allowedHttpMethods.join(', ')}. Got: ${value}`);
    }
  
    return upperValue as HttpMethod;
  }


export const getEnvVarNumber = (name: string, defaultValue: number): number => {
    const value = process.env[name];
    if (value === undefined) {
      return defaultValue;
    }
    const parsed = Number(value);
    if (isNaN(parsed)) {
      throw new Error(`Environment variable ${name} must be a valid number.`);
    }
    return parsed;
  }

export const config = {
    port: parseInt(process.env.PORT || '8080', 10),
    allowedUsername: getEnvVar('ALLOWED_USERNAME'),
}