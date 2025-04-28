import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UserController } from '../controllers/user.controller';
import { UserRepository } from '../repositories/user.repository';
import { validateRequest } from '../middlewares/validation.middleware'; // Import the validation middleware
import { createUserSchema, editUserSchema } from '../validators/user.validator'; // Import the schemas

export function createUserRouter(userRepository: UserRepository) {
  const router = Router();

  const userService = new UserService(userRepository);
  const userController = new UserController(userService);

  router.get('/', userController.getAllUsers);
  // Apply validation middleware to the POST route
  router.post('/', validateRequest(createUserSchema), userController.createUserPreferences);
  
  /**
   * This method is not implemented as a standard RESTful PUT endpoint.
   * According to the requirements,
   * the user update is performed based on properties provided in the request body.
   */
  // Apply validation middleware to the PUT route
  router.put('/', validateRequest(editUserSchema), userController.editUserPreferences);

  return router;
}