
import { toast } from '@/hooks/use-toast';

interface ApiRequestOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

export async function apiRequest<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  try {
    const response = await fetch(`/api${path}`, {
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'An error occurred');
    }

    return response.json();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An error occurred';
    toast({
      variant: "destructive",
      title: "Error",
      description: message,
    });
    throw error;
  }
}
