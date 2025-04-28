import Joi from 'joi';

const userPreferencesSchema = Joi.object({
    email: Joi.boolean().optional(),
    sms: Joi.boolean().optional()
}).optional(); 


const telephoneRegex = /^\+[0-9]{5,15}$/;

export const createUserSchema = Joi.object({
    email: Joi.string().email().required(), 
    telephone: Joi.string().pattern(telephoneRegex).required(), 
    preferences: userPreferencesSchema,
});

export const editUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    telephone: Joi.string().pattern(telephoneRegex).optional(), 
    preferences: userPreferencesSchema,
});
