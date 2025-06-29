export type ApiMode = 'mock' | 'rapidapi' | 'custom';

export interface ApiConfig {
  mode: ApiMode;
  rapidApi?: {
    key: string;
    host: string;
  };
  customApi?: {
    baseUrl: string;
    apiKey?: string;
  };
}

// API configuration from environment variables
export const apiConfig: ApiConfig = {
  mode: (process.env.NEXT_PUBLIC_API_MODE as ApiMode) || 'rapidapi',
  rapidApi: {
    key: process.env.NEXT_PUBLIC_RAPIDAPI_KEY || '',
    host: process.env.NEXT_PUBLIC_RAPIDAPI_HOST || 'instagram120.p.rapidapi.com'
  },
  customApi: {
    baseUrl: process.env.NEXT_PUBLIC_CUSTOM_API_URL || '',
    apiKey: process.env.NEXT_PUBLIC_CUSTOM_API_KEY || ''
  }
};

export const isApiConfigured = (): boolean => {
  switch (apiConfig.mode) {
    case 'mock':
      return true;
    case 'rapidapi':
      return !!apiConfig.rapidApi?.key;
    case 'custom':
      return !!apiConfig.customApi?.baseUrl;
    default:
      return false;
  }
};
