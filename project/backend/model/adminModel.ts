import { Schema, model } from 'mongoose';

const adminSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    hasFullPrivileges: {
        type: Boolean,
        required: true
    }

});