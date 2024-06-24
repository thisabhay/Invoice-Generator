const { getDB } = require('../config/db');
const { ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');
const z = require('zod');

const userSchema = z.object({
    name: z.string().min(2).max(50),
    gstNo: z.string(),
    phoneNo: z.string(),
    email: z.string().email(),
    addressLine1: z.string(),
    addressLine2: z.string().optional(),
    state: z.string(),
    password: z.string().min(6),
    date: z.date().default(() => new Date())
});

const findUserByEmail = async (email) => {
    const db = getDB();
    return await db.collection('users').findOne({ email });
};

const findUserById = async (id) => {
    const db = getDB();
    return await db.collection('users').findOne({ _id: new ObjectId(id) });
};

const createUser = async (userData) => {
    const validatedData = userSchema.parse(userData);
    const db = getDB();
    const salt = await bcrypt.genSalt(10);
    validatedData.password = await bcrypt.hash(validatedData.password, salt);
    const result = await db.collection('users').insertOne(validatedData);
    return result.insertedId;
};

module.exports = {
    findUserByEmail,
    findUserById,
    createUser,
    userSchema
};