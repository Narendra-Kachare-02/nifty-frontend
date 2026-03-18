const isProduction = import.meta.env.MODE === 'production';
const isLoggerEnabled = import.meta.env.VITE_ENABLE_LOGGER === 'true';

class Logger {
  private shouldLog(): boolean {
    return !isProduction && isLoggerEnabled;
  }

  info(...args: any[]): void {
    if (this.shouldLog()) {
      console.log('[INFO]', ...args);
    }
  }

  warn(...args: any[]): void {
    if (this.shouldLog()) {
      console.warn('[WARN]', ...args);
    }
  }

  error(...args: any[]): void {
    if (this.shouldLog()) {
      console.error('[ERROR]', ...args);
    }
  }

  debug(...args: any[]): void {
    if (this.shouldLog()) {
      console.debug('[DEBUG]', ...args);
    }
  }

  api(method: string, url: string, data?: any): void {
    if (this.shouldLog()) {
      console.log(`[API ${method.toUpperCase()}]`, url, data || '');
    }
  }

  saga(action: string, ...args: any[]): void {
    if (this.shouldLog()) {
      console.log(`[SAGA] ${action}`, ...args);
    }
  }
}

export const logger = new Logger();
