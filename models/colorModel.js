import mongoose from 'mongoose';

const { Schema } = mongoose;

const colorSchema = new Schema({
    title: {
        type: String, 
        required: true,
        unique: true,
        index: true,
    },

},{
    timestamps: true,
});

export default mongoose.model('Color', colorSchema);