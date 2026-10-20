/**
 * SSOT Domain Types for LaVida CARSS
 * Aligned with verified Google Apps Script backend (Code.gs)
 */
import { z } from 'zod';

// Endpoint 1: ?action=config
export interface AppConfigData {
  venue_name: string;
  tagline: string;
  currency: string;
  currency_symbol: string;
  whatsapp_number: string;
  whatsapp_enabled: boolean;
  operating_hours?: string;
  address?: string;
}

// Endpoint 2: ?action=carousel
export interface CarouselFeedItem {
  id: string;
  type?: string;
  category_id: string;
  category_name: string;
  item_id?: string;
  title: string;
  description: string;
  price?: number;
  price_unit?: string;
  media_url?: string;
  media_type?: 'video' | 'image' | string;
  schedule_text?: string;
  source_status?: string;
}

// Endpoint 3: ?action=catalog&domain=food | drinks
export interface CatalogItemData {
  item_id: string;
  category_id: string;
  service_domain: 'food' | 'drinks' | string;
  name: string;
  description: string;
  price: number;
  currency: string;
  media_url?: string;
  media_type?: string;
  variations?: any[];
  extras?: any[];
}

// Endpoint 4: ?action=carwash
export interface CarwashServiceData {
  service_id: string;
  name: string;
  vehicle_category: string;
  description: string;
  price: number;
  duration_minutes: number;
  media_url?: string;
  media_type?: string;
}

// Cart Item Model (Holds only item_id, name, price for display, quantity)
export interface CartItem {
  item_id: string;
  name: string;
  price: number;
  quantity: number;
  item_type?: 'menu_item' | 'carwash' | string;
}

// Order Customer Schema
export const CustomerSchema = z.object({
  name: z.string().min(2, 'Customer name is required'),
  phone: z.string().min(8, 'Valid phone number is required'),
  table_number: z.string().optional(),
  notes: z.string().optional(),
});

export type CustomerDetails = z.infer<typeof CustomerSchema>;

// Strict POST payload schema for ?action=createOrder
// Critical security: frontend must NOT send unit_price or line_total
export const CreateOrderItemSchema = z.object({
  item_type: z.string().default('menu_item'),
  item_id: z.string().min(1, 'Item ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

export const CreateOrderPayloadSchema = z.object({
  action: z.literal('createOrder'),
  idempotency_key: z.string().min(10, 'Valid idempotency key is required'),
  order_type: z.enum(['takeaway', 'table', 'lounge', 'carwash']).default('takeaway'),
  customer: CustomerSchema,
  items: z.array(CreateOrderItemSchema).min(1, 'Cart cannot be empty'),
});

export type CreateOrderPayload = z.infer<typeof CreateOrderPayloadSchema>;

// Six-Field Response Envelope from Apps Script
export interface AppsScriptResponse<T> {
  ok: boolean;
  data: T | null;
  error?: string | null;
  statusCode?: number;
  requestId?: string;
  schemaVersion?: string;
}

// Confirmed Order Receipt returned from server
export interface OrderConfirmationData {
  order_id: string;
  order_reference: string;
  status: string;
  customer: CustomerDetails;
  items: Array<{
    item_id: string;
    item_type: string;
    name: string;
    unit_price: number;
    quantity: number;
    line_total: number;
  }>;
  subtotal: number;
  total_amount: number;
  currency: string;
  formatted_total: string;
  created_at: string;
  idempotency_key: string;
  handoff_message: string;
}
