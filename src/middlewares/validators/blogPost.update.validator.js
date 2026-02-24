import Joi from "joi";

export const updateBlogPostSchema = Joi.object({

  title: Joi.string().trim().min(3).max(200),

  subtitle: Joi.string().allow(""),

  readingTime: Joi.string(),

  category: Joi.array().items(Joi.string()),

  technologies: Joi.array().items(Joi.string()),

  hero: Joi.object({
    imageUrl: Joi.string().uri(),
    caption: Joi.string().allow(""),
    altText: Joi.string().allow("")
  }),

  content: Joi.object(),

  seo: Joi.object({
    metaTitle: Joi.string().allow(""),
    metaDescription: Joi.string().allow(""),
    keywords: Joi.array().items(Joi.string()),
    ogImage: Joi.string().uri().allow("")
  }),

  isPublished: Joi.boolean(),

   status: Joi.string()
    .valid("draft", "published", "archived")
    .optional()


})
.unknown(false);   
