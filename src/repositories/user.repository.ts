import { console } from 'inspector';
import { ConflictError } from '../error/conflict.error';
import { NotFoundError } from '../error/notfound.error';
import { User, UserUpdateCriteria } from '../models/user.model';



export class UserRepository {
    private users: User[] = [];
    
    public findAll = async (): Promise<User[]> => {
        return this.users;        
    };

    public findById = async (userId: string): Promise<User | null> => {
        return this.users.find(user => user.userId === userId) || null;
    };

    public findByEmail = async (email: string): Promise<User | null> => {
        return this.users.find(user => user.email === email) || null;
    };

    public findByTelephone = async (telephone: string): Promise<User | null> => {
        return this.users.find(user => user.telephone === telephone) || null;
    };

    public create = async (userData: Omit<User, 'userId'>): Promise<User> => {        
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

    public updatePreferences = async (criteria: UserUpdateCriteria, preferences: User['preferences']): Promise<User> => {
        const user = await this.findUserByCriteria(criteria);
        if(!user) {
            throw new NotFoundError(`User not found`);    
        }
        user.preferences = preferences;
        return user;
    }

    public findUserByCriteria = async (criteria: UserUpdateCriteria): Promise<User | null> => {
        console.log('criteria', criteria);
        const { userId, email} = criteria;        
        console.log('users', this.users);

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