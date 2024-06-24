const { z } = require('zod');

const registrationSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long').max(50, 'Name must not exceed 50 characters'),
    gstNo: z.string().min(1, 'GST No is required'),
    phoneNo: z.string().min(1, 'Phone No is required'),
    email: z.string().email('Invalid email address'),
    addressLine1: z.string().min(1, 'Address Line 1 is required'),
    addressLine2: z.string().optional(),
    state: z.string().min(1, 'State is required'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

const loginSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters long')
});

module.exports = {
    registrationSchema,
    loginSchema
};