import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';

export function createUserRouter(userRepository: UserRepository) {
  const router = Router();

  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  router.get('/', userController.getAllUsers);
  router.post('/', userController.createUserPreferences);
  
  /**
   * This method is not implemented as a standard RESTful PUT endpoint.
   * According to the requirements,
   * the user update is performed based on properties provided in the request body.
   */
  router.put('/', userController.editUserPreferences);

  return router;
}