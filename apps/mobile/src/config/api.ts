import { NativeModules } from 'react-native';

const fallbackBaseUrl = 'http://192.168.0.101:3000';

const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env;

const resolveBundlerHost = (): string | undefined => {
  const scriptURL = (NativeModules as { SourceCode?: { scriptURL?: string } }).SourceCode?.scriptURL;
  if (!scriptURL) {
    return undefined;
  }

  try {
    const url = new URL(scriptURL);
    return url.hostname;
  } catch {
    const match = scriptURL.match(/^https?:\/\/([^:/?#]+)(?::\d+)?/i);
    return match?.[1];
  }
};

const devServerHost = resolveBundlerHost();
const devServerBaseUrl = devServerHost ? `http://${devServerHost}:3000` : undefined;

export const API_BASE_URL = env?.EXPO_PUBLIC_API_BASE_URL ?? devServerBaseUrl ?? fallbackBaseUrl;
