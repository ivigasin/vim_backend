import Joi from 'joi';

export const sendNotificationSchema = Joi.object({
    userId: Joi.string().optional(),
    email: Joi.string().email().optional(),
    message: Joi.string().required()
}).xor('userId', 'email') 
  .messages({
    'object.missing': 'Either userId or email must be provided', 
    'object.xor': 'Only one of userId or email should be provided'
  });