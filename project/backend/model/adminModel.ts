import mongoose, { Document, Schema } from "mongoose";

// Interfaccia per il documento Admin
interface IAdmin extends Document {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    hasFullPrivileges: boolean;
}

// Schema Mongoose
const adminSchema = new Schema<IAdmin>({
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

// Modello Mongoose
const Admin = model<IAdmin>('Admin', adminSchema);

export default Admin;
