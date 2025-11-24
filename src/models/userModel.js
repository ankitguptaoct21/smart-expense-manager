import mongoose from "mongoose";
import bcrypt from "bcrypt";

import appConfig from "../config/index.js";

const { Schema, model } = mongoose;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
        minLength: [2, 'Name must be at least 2 characters'],
        maxLength: [50, 'Name must be at most 50 characters']
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        trim: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },

    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters'],
        select: false,
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },

    isVerified: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
});

userSchema.index({ email: 1 }, { unique: true, background: true });

userSchema.pre('save', async function (next) {
    // Only run when password is set/modified
    if (!this.isModified('password')) {
        return next();
    }

    try {
        const salt = await bcrypt.genSalt(appConfig.bcrypt_salt_round);
        this.password = await bcrypt.hash(this.password, salt);
        return next();
    } catch (err) {
        return next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
    // `this.password` must be present
    if (!this.password) {
        // if password not selected, throw helpful error
        throw new Error('Password not selected. Use .select("+password") when querying.');
    }

    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.set('toJSON', {
    virtuals: true,
    transform(doc, ret, options) {
        // remove fields
        delete ret.password;
        delete ret.__v;

        // convert _id to id (string) and delete _id if present
        if (ret._id) {
            ret.id = String(ret._id);
            delete ret._id;
        }

        return ret;
    },
});

userSchema.statics.findByEmailWithPassword = function (email) {
    return this.findOne({ email }).select('+password').exec();
};

const User = model('User', userSchema);

export default User;
