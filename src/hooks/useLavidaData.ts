import { useState, useEffect, useCallback } from 'react';
import {
  AppConfigData,
  CarouselFeedItem,
  CatalogItemData,
  CarwashServiceData,
  AppsScriptResponse,
} from '../types/lavida';

// FORCE all traffic through the local Express BFF proxy (/api/*) to bypass CORS.
async function fetchEndpoint<T>(endpoint: string, queryParams: Record<string, string> = {}): Promise<T | null> {
  const params = new URLSearchParams(queryParams);
  const proxyUrl = `/api/${endpoint}${params.toString() ? '?' + params.toString() : ''}`;

  try {
    const res = await fetch(proxyUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    if (res.ok) {
      const json: AppsScriptResponse<T> = await res.json();
      if (json.ok && json.data) {
        return json.data;
      }
    }
  } catch (proxyErr) {
    console.error(`[LaVida SSOT] Failed to retrieve endpoint "${endpoint}":`, proxyErr);
  }

  return null;
}

export function useLavidaData() {
  const [config, setConfig] = useState<AppConfigData | null>(null);
  const [carousel, setCarousel] = useState<CarouselFeedItem[]>([]);
  const [foodItems, setFoodItems] = useState<CatalogItemData[]>([]);
  const [drinkItems, setDrinkItems] = useState<CatalogItemData[]>([]);
  const [carwashServices, setCarwashServices] = useState<CarwashServiceData[]>([]);
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cfg, car, food, drinks, wash, offs] = await Promise.all([
        fetchEndpoint<AppConfigData>('config'),
        fetchEndpoint<CarouselFeedItem[]>('carousel', { limit: '200' }),
        fetchEndpoint<CatalogItemData[]>('catalog', { domain: 'food' }),
        fetchEndpoint<CatalogItemData[]>('catalog', { domain: 'drinks' }),
        fetchEndpoint<CarwashServiceData[]>('carwash'),
        fetchEndpoint<any[]>('offers'),
      ]);

      if (cfg) setConfig(cfg);
      if (car) setCarousel(car);
      if (food) setFoodItems(food);
      if (drinks) setDrinkItems(drinks);
      if (wash) setCarwashServices(wash);
      if (offs) setOffers(offs);

      if (!cfg && !car && !food && !drinks && !wash && !offs) {
        setError('Google Apps Script backend is unreachable. Ensure the Web App is deployed with "Who has access: Anyone".');
      }
    } catch (err: any) {
      setError(err.message || 'Error communicating with Apps Script SSOT.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  return {
    config,
    carousel,
    foodItems,
    drinkItems,
    carwashServices,
    offers,
    loading,
    error,
    refetch: loadAllData,
  };
}