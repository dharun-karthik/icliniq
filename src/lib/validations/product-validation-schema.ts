import { z } from 'zod';


export const CreateProductSchema = z.object({
  name: z.string({
    required_error: "Product name is required",
    invalid_type_error: "Product name must be a string",
  }).min(1, "Product name cannot be empty"),

  description: z.string({
    invalid_type_error: "Product description must be a string",
  }).default(''),

  price: z.number({
    required_error: "Product price is required",
    invalid_type_error: "Product price must be a number",
  }),

  stock: z.number({
    required_error: "Product stock is required",
    invalid_type_error: "Product stock must be a number",
  }),

});

export type CreateProductInput = z.infer<typeof CreateProductSchema>;

export const UpdateProductSchema = z.object({
  name: z.string({
    invalid_type_error: "Product name must be a string",
  }).min(1, "Product name cannot be empty").optional(),

  description: z.string({
    invalid_type_error: "Product description must be a string",
  }).optional(),

  price: z.number({
    invalid_type_error: "Product price must be a number",
  }).optional(),

  stock: z.number({
    invalid_type_error: "Product stock must be a number",
  }).optional(),

}).refine(
  (data) => Object.keys(data).length > 0,
  { message: "At least one field must be provided for update" }
);

export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;

export const ProductIdParamsSchema = z.object({
  id: z.string({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a string",
  }).min(1, "Product ID cannot be empty"),
});

export type ProductIdParams = z.infer<typeof ProductIdParamsSchema>;
