const {z}=require('zod');

const registrationSchema=z.object({
    name:z.string().min(1,'Name is required'),
    gstNo:z.string().min(1,'GST No is Required'),
    phoneNo:z.string().min(1,'Phone No is required'),
    email:z.string().email("Invalid email address ,@gmail.com required"),
    addressLine1:z.string().min(1,"Address Line 1 is required"),
    addressLine2:z.string().optional(),
    state:z.string().min(1,'State is required'),
    password:z.string().min(4,'Password must be at least 6 characters long')
});

const loginSchema=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,'Password must be at least 4 Characters Long')
});

module.exports={
    registrationSchema,
    loginSchema
}