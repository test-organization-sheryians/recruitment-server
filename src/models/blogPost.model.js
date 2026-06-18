import mongoose from 'mongoose';
// import slugify from 'slugify';



const BlogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },

  subtitle: {
    type: String,
    trim: true,
    default: ""
  },

  readingTime: {
    type: String,
    default: "0 min read"
  },

  category: {
     type:mongoose.Schema.Types.ObjectId,
     ref: 'JobCategory',
     required: true,
     index: true
  },

  technologies: [{
  type: mongoose.Schema.Types.ObjectId,
  ref: 'Skill',
  index: true
  }],

  hero: {
    imageUrl: { type: String, required: true },
    caption: { type: String, default: "" },
    altText: { type: String, default: "" }
  },

  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  author: {
  type: mongoose.Schema.Types.ObjectId,
  ref: 'User', 
  required: false
 },

  seo: {
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    keywords: { type: [String], default: [] },
    ogImage: { type: String, default: "" }
  },

  stats: {
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 }
  },

  isPublished: {
    type: Boolean,
    default: false
  },
  publishedAt: {
    type: Date,
    default: null
  },

  allowNewsletter: {
    type: Boolean,
    default: true
  },
  status :{
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft',
    required: true
  }
  
}, { timestamps: true });

const BlogPost = mongoose.model('BlogPost', BlogPostSchema);

export default BlogPost;
