import { ConflictError } from '../error/conflict.error';
import { NotFoundError } from '../error/notfound.error';
import { User, UserUpdateCriteria } from '../models/user.model';

export class UserRepository {
    private users: User[] = [];
    
    public findAll = (): User[] => {
        return this.users;        
    };

    public findById = (userId: string): User | null => {
        return this.users.find(user => user.userId === userId) || null;
    };

    public findByEmail = (email: string): User | null => {
        return this.users.find(user => user.email === email) || null;
    };

    public findByTelephone = (telephone: string): User | null => {
        return this.users.find(user => user.telephone === telephone) || null;
    };

    public create =  (userData: Omit<User, 'userId'>): User => {        
        if(this.emailExists(userData.email)) {
            throw new ConflictError(`Email ${userData.email} already exists`)
        }

        if(userData.telephone && this.telephoneExists(userData.telephone)) {
            throw new ConflictError(`Telephone ${userData.telephone} already exists`)
        }


        const newUser: User = {
            userId: (this.users.length + 1).toString(),
            ...userData,
        };
        this.users.push(newUser);
        return newUser;
    }

    public updatePreferences =  (criteria: UserUpdateCriteria, preferences: User['preferences']): User => {
        const user =  this.findUserByCriteria(criteria);
        if(!user) {
            throw new NotFoundError(`User not found`);    
        }
        user.preferences = preferences;
        return user;
    }

    public findUserByCriteria =  (criteria: UserUpdateCriteria): User | null => {        
        const { userId, email} = criteria;                

        return this.users.find(user => 
            (email && user.email === email) ||            
            (userId && user.userId === userId)     
        ) || null;
    }

    private emailExists = (email: string, excludeUserId?: string): boolean => {
        return this.users.some(user => user.email === email && user.userId !== excludeUserId);
    }

    private telephoneExists = (telephone: string, excludeUserId?: string): boolean => {
        return this.users.some(user => 
          user.telephone === telephone && user.userId !== excludeUserId
        );
      }
}