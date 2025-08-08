interface AppConfig {
  API_URL: string;
}

declare global {
  interface Window {
    APP_CONFIG: AppConfig;
  }
}

export {};
