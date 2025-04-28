export interface UserPreferences {
    email: boolean;
    sms: boolean;
}

export interface User {
    userId: string;
    email: string;
    telephone: string;
    preferences: UserPreferences;
}

export interface UserUpdateCriteria {
    userId?: string;
    email?: string;
}