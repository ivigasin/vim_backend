import { Request, Response, NextFunction } from 'express';
import { UserService } from '../services/user.service';
export class UserController {
    constructor(private userService: UserService) {}
    
    public createUserPreferences = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, telephone, preferences } = req.body;
            const user = await this.userService.createUserPreferencies({
                email, telephone, preferences                
            })
            res.status(201).json(user)
        } catch (error){
            next(error)
        }
    }

    public  getAllUsers = async(req: Request, res: Response, next: NextFunction) => {
        try {
            const users = await this.userService.getAllUsers();
            res.status(200).json(users);
        } catch (error) {
            next(error)
        }
    }

    public editUserPreferences =  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
           const { email, telephone, preferences } = req.body;
           const user = await this.userService.editUserPreferences({
            email, telephone, 
           }, preferences);
           res.status(201).json(user);     
        } catch (error) {
            next(error);
        }
    }
}