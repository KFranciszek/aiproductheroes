// lib/storage-security.ts
export class SecureStorage {
  private static readonly ENCRYPTION_KEY = 'braintask_encryption_key';

  static async setItem(key: string, value: any): Promise<void> {
    const data = JSON.stringify(value);
    const encrypted = await this.encrypt(data);
    localStorage.setItem(key, encrypted);
  }

  static async getItem<T>(key: string): Promise<T | null> {
    const encrypted = localStorage.getItem(key);
    if (!encrypted) return null;

    try {
      const decrypted = await this.decrypt(encrypted);
      return JSON.parse(decrypted);
    } catch {
      return null;
    }
  }

  static async removeItem(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  private static async encrypt(data: string): Promise<string> {
    // Proste szyfrowanie - w produkcji użyj crypto-js lub podobnej biblioteki
    const key = this.ENCRYPTION_KEY;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return btoa(result);
  }

  private static async decrypt(encrypted: string): Promise<string> {
    const data = atob(encrypted);
    const key = this.ENCRYPTION_KEY;
    let result = '';
    for (let i = 0; i < data.length; i++) {
      result += String.fromCharCode(data.charCodeAt(i) ^ key.charCodeAt(i % key.length));
    }
    return result;
  }
}

// Hook do bezpiecznego przechowywania danych
export function useSecureStorage() {
  const setSecureItem = async (key: string, value: any) => {
    await SecureStorage.setItem(key, value);
  };

  const getSecureItem = async <T>(key: string): Promise<T | null> => {
    return await SecureStorage.getItem<T>(key);
  };

  return { setSecureItem, getSecureItem };
}


