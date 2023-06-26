import mongoose from 'mongoose'; 

const blogSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    viewCount: {
        type: Number,
        default: 0
        },
    category: {
            type: String,
            required: true
            },
    isLiked: {
        type: Boolean,
        default: false
        },
    isDisliked: {
            type: Boolean,
            default: false
        },
    likes: [{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    image:{
        type: String,
        default: "https://images.pexels.com/photos/262508/pexels-photo-262508.jpeg?auto=compress&cs=tinysrgb&w=600"
    },
    images:[],
    author:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }], 
},
{
    toJSON: { virtual: true },
    toObject: { virtual: true },
    timestamps: {
        createdAt: 'created_at', // Use `created_at` to store the created date
        updatedAt: 'updated_at' // and `updated_at` to store the last updated date
      }, 
},

  );
            
const Blog = mongoose.model('Blog', blogSchema);

export default Blog;