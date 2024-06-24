const { z } = require('zod');

const invoiceSchema = z.object({
    invoiceNo: z.string(),
    date: z.string().transform(str => new Date(str)),
    orderNo: z.string(),
    customerDetails: z.object({
        name: z.string(),
        address: z.string(),
        gstNo: z.string(),
        phoneNo: z.string(),
        email: z.string().email()
    }),
    products: z.array(z.object({
        description: z.string(),
        quantity: z.number(),
        price: z.number(),
        total: z.number()
    })),
    subtotal: z.number(),
    taxRate: z.number(),
    taxAmount: z.number(),
    totalAmount: z.number()
});

module.exports = {
    invoiceSchema
};