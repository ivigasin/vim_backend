import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';

export class UserService {
  constructor(private userRepository: UserRepository) {}

  public getUserById =  (userId: string): User | null => {
    console.log(`[UserService] Fetching user by ID: ${userId}`);
    const user =  this.userRepository.findById(userId);

    if (user) {
      console.log(`[UserService] User found: ${userId}`);
    } else {
      console.warn(`[UserService] User not found: ${userId}`);
    }
    return user;
  };

  public createUserPreferencies =  (userData: Omit<User, 'userId'>): User => {    
    console.log(`[UserService] Creating user with data: ${JSON.stringify(userData)}`);
    const user =  this.userRepository.create(userData);
    console.log(`[UserService] User created with ID: ${user.userId}`);
    return user;
  };

  public editUserPreferences =  (
    criteria: { email?: string; telephone?: string; userId?: string },
    preferences: User['preferences']
  ): User => {
    console.log(`[UserService] Editing user preferences for criteria: ${JSON.stringify(criteria)}`);
    const user =  this.userRepository.updatePreferences(criteria, preferences);
    console.log(`[UserService] Updated preferences for user ID: ${user.userId}`);
    return user;
  };
  
}
