import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public getAllUsers = async (): Promise<User[]> => {
    console.log(`[UserService] Fetching all users...`);
    const users = await this.userRepository.findAll();
    console.log(`[UserService] Found ${users.length} users.`);
    return users;
  };

  public getUserById = async (userId: string): Promise<User | null> => {
    console.log(`[UserService] Fetching user by ID: ${userId}`);
    const user = await this.userRepository.findById(userId);
    
    if (user) {
      console.log(`[UserService] User found: ${userId}`);
    } else {
      console.warn(`[UserService] User not found: ${userId}`);
    }
    return user;
  };

  public createUserPreferencies = async (userData: Omit<User, 'userId'>): Promise<User> => {    
    console.log(`[UserService] Creating user with data: ${JSON.stringify(userData)}`);
    const user = await this.userRepository.create(userData);
    console.log(`[UserService] User created with ID: ${user.userId}`);
    return user;
  };

  public editUserPreferences = async (
    criteria: { email?: string; telephone?: string; userId?: string },
    preferences: User['preferences']
  ): Promise<User> => {
    console.log(`[UserService] Editing user preferences for criteria: ${JSON.stringify(criteria)}`);
    const user = await this.userRepository.updatePreferences(criteria, preferences);
    console.log(`[UserService] Updated preferences for user ID: ${user.userId}`);
    return user;
  };
}
