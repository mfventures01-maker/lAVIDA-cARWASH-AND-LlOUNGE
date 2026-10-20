/**
 * Centralized Typed Client for LaVida CARSS BFF API
 * Single source of truth for all frontend data retrieval and mutations.
 */
import {
  AppsScriptResponse,
  AppConfigData,
  CarwashServiceData,
  CarouselFeedItem,
  CatalogItemData,
  CreateOrderPayload,
  OrderConfirmationData,
} from '../types/lavida';

const API_BASE = '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<AppsScriptResponse<T>> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const json: AppsScriptResponse<T> = await res.json();
    return json;
  } catch (err: any) {
    return {
      ok: false,
      data: null,
      error: err.message || 'Network request failed',
      requestId: 'client_err_' + Math.random().toString(36).substring(2, 9),
      schemaVersion: '1',
    };
  }
}

export const laVidaClient = {
  async getConfig(): Promise<AppsScriptResponse<AppConfigData>> {
    return request<AppConfigData>('/config');
  },

  async getCarousel(): Promise<AppsScriptResponse<CarouselFeedItem[]>> {
    return request<CarouselFeedItem[]>('/carousel');
  },

  async getCatalog(domain: 'food' | 'drinks' = 'food'): Promise<AppsScriptResponse<CatalogItemData[]>> {
    return request<CatalogItemData[]>(`/catalog?domain=${domain}`);
  },

  async getCarwashServices(): Promise<AppsScriptResponse<CarwashServiceData[]>> {
    return request<CarwashServiceData[]>('/carwash');
  },

  async getDiagnostic(): Promise<any> {
    const res = await fetch(`${API_BASE}/diagnostic`);
    return res.json();
  },

  async createOrder(payload: CreateOrderPayload): Promise<AppsScriptResponse<OrderConfirmationData>> {
    return request<OrderConfirmationData>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
