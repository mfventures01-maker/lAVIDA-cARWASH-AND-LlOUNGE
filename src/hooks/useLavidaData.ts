import { useState, useEffect, useCallback } from 'react';
import {
  AppConfigData,
  CarouselFeedItem,
  CatalogItemData,
  CarwashServiceData,
  AppsScriptResponse,
} from '../types/lavida';

const APPS_SCRIPT_BASE_URL =
  'https://script.google.com/macros/s/AKfycbyzgGSIW8Bs5cQkwUXEuAl8uRSBbpfbK0U_gmUlStruNnu6D1S9djrpT7PyKgEwAnvW/exec';

// Robust fetcher that tries the live Apps Script endpoint first, then falls back via BFF proxy if CORS/Auth redirect happens
async function fetchEndpoint<T>(action: string, queryParams: Record<string, string> = {}): Promise<T | null> {
  const params = new URLSearchParams({ action, ...queryParams });
  const directUrl = `${APPS_SCRIPT_BASE_URL}?${params.toString()}`;
  const proxyUrl = `/api/${action === 'catalog' ? 'catalog' : action}?${params.toString()}`;

  // 1. Attempt direct fetch to Apps Script URL
  try {
    const res = await fetch(directUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
    });

    const contentType = res.headers.get('content-type') || '';
    if (res.ok && contentType.includes('application/json')) {
      const json: AppsScriptResponse<T> = await res.json();
      if (json.ok && json.data) {
        return json.data;
      }
    }
  } catch (directErr) {
    // Direct CORS error or network block - proceed to BFF proxy
  }

  // 2. Fallback to BFF same-origin proxy route
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
    console.error(`[LaVida SSOT] Failed to retrieve action "${action}":`, proxyErr);
  }

  return null;
}

export function useLavidaData() {
  const [config, setConfig] = useState<AppConfigData | null>(null);
  const [carousel, setCarousel] = useState<CarouselFeedItem[]>([]);
  const [foodItems, setFoodItems] = useState<CatalogItemData[]>([]);
  const [drinkItems, setDrinkItems] = useState<CatalogItemData[]>([]);
  const [carwashServices, setCarwashServices] = useState<CarwashServiceData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadAllData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [cfg, car, food, drinks, wash] = await Promise.all([
        fetchEndpoint<AppConfigData>('config'),
        fetchEndpoint<CarouselFeedItem[]>('carousel'),
        fetchEndpoint<CatalogItemData[]>('catalog', { domain: 'food' }),
        fetchEndpoint<CatalogItemData[]>('catalog', { domain: 'drinks' }),
        fetchEndpoint<CarwashServiceData[]>('carwash'),
      ]);

      if (cfg) setConfig(cfg);
      if (car) setCarousel(car);
      if (food) setFoodItems(food);
      if (drinks) setDrinkItems(drinks);
      if (wash) setCarwashServices(wash);

      if (!cfg && !car && !food && !drinks && !wash) {
        setError('Google Apps Script endpoint is currently requiring authentication or unreachable.');
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
    loading,
    error,
    refetch: loadAllData,
  };
}
