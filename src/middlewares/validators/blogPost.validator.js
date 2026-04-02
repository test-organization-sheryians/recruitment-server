import Joi from "joi";

export const createBlogPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).required(),

  slug: Joi.string()
    .trim()
    .lowercase()
    .pattern(/^[a-z0-9-]+$/)
    .allow( "",null)
    .optional(),

  author: Joi.string().optional(),
  subtitle: Joi.string().allow("").optional(),

  readingTime: Joi.string().optional(),

  category: Joi.string()
    .hex()
    .length(24)
    .required(),

  
  technologies: Joi.array()
    .items(
      Joi.string().hex().length(24)
    )
    .optional()
    .default([]),


  hero: Joi.object({
    imageUrl: Joi.string().uri().required(),
    caption: Joi.string().allow("").optional(),
    altText: Joi.string().allow("").optional(),
  }).required(),

  content: Joi.object().required(),

  seo: Joi.object({
    metaTitle: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    keywords: Joi.array().items(Joi.string()).default([]),
    ogImage: Joi.string().uri().allow("").optional(),
  }).optional(),

  isPublished: Joi.boolean().default(false),
  allowNewsletter: Joi.boolean().default(true),
  status: Joi.string()
  .valid("draft", "published", "archived")
  .required(),

  stats: Joi.object({
  views: Joi.number(),
  likes: Joi.number(),
  shares: Joi.number()
}),

publishedAt: Joi.date().allow(null),
}).unknown(false);


export const searchBlogSchema = Joi.object({
  search: Joi.string().optional(),

  category: Joi.string()
    .hex()
    .length(24)
    .optional(),

  technologies: Joi.array()
    .items(Joi.string().hex().length(24))
    .optional(),

  page: Joi.number().min(1).optional(),

  limit: Joi.number().min(1).max(50).optional(),

  sortBy: Joi.string().optional(),

  sortOrder: Joi.string().valid("asc", "desc").optional()
});




export const updateBlogPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(200).optional(),
  subtitle: Joi.string().allow("").optional(),
  readingTime: Joi.string().optional(),
  category: Joi.array().items(Joi.string()).optional(),

  hero: Joi.object({
    imageUrl: Joi.string().uri().optional(),
    caption: Joi.string().allow("").optional(),
    altText: Joi.string().allow("").optional(),
  }).optional(),

  content: Joi.object().optional(),

  seo: Joi.object({
    metaTitle: Joi.string().allow("").optional(),
    metaDescription: Joi.string().allow("").optional(),
    keywords: Joi.array().items(Joi.string()).optional(),
    ogImage: Joi.string().uri().allow("").optional(),
  }).optional(),

  isPublished: Joi.boolean().optional(),
  allowNewsletter: Joi.boolean().optional(),
})
  .min(1)
  .unknown(false);
