import { z } from 'zod';

export const AddItemToCartSchema = z.object({
  productId: z.string({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a string",
  }).min(1, "Product ID cannot be empty"),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  }).int("Quantity must be an integer").min(1, "Quantity must be at least 1"),
});

export const UpdateItemQuantitySchema = z.object({
  productId: z.string({
    required_error: "Product ID is required",
    invalid_type_error: "Product ID must be a string",
  }).min(1, "Product ID cannot be empty"),
  quantity: z.number({
    required_error: "Quantity is required",
    invalid_type_error: "Quantity must be a number",
  }).int("Quantity must be an integer").min(1, "Quantity must be at least 1"),
});

