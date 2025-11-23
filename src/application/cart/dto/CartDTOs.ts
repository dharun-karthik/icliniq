export interface AddItemToCartDTO {
  productId: string;
  quantity: number;
}

export interface UpdateItemQuantityDTO {
  productId: string;
  quantity: number;
}

export interface CartResponseDTO {
  productId: string;
  quantity: number;
}

