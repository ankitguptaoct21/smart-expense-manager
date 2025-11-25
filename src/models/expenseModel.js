import mongoose from "mongoose";

const { Schema, model } = mongoose;

const expenseSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, "Title is required."],
        trim: true
    },
    subtitle: {
        type: String,
        required: [true, "Sub-title is required."],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required."],
        trim: true,
        index: true
    },
    subcategory: {
        type: String,
        required: [true, "Sub-category is required."],
        trim: true,
        index: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required."],
        min: [1, "Amount must be greater than 0."]
    },
    date: {
        type: Date,
        default: Date.now(),
        index: true
    },
    notes: {
        type: String,
        required: [true, "Notes are required."],
        trim: true
    },
    deletedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true
});

// Soft delete method
expenseSchema.methods.softDelete = async () => {
    this.deletedAt = Date.now();
    return await this.save();
}

// Remove internal fields in response
expenseSchema.methods.toJSON = () => {
    const obj = this.toObject();
    delete obj.__v;

    if (obj._id) {
        obj.id = String(obj._id);
        delete obj._id;
    }

    return obj;
}

const Expense = model("Expense", expenseSchema);

export default Expense;
