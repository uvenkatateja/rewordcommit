import fs from 'fs/promises';
import path from 'path';
import os from 'os';
import ini from 'ini';
import { AppError } from './errors.js';

const CONFIG_FILE = path.join(os.homedir(), '.rewordcommit');

export interface Config {
  GROQ_API_KEY: string;
  model: string;
  locale: string;
  timeout: number;
  maxLength: number;
}

interface RawConfig {
  GROQ_API_KEY?: string;
  model?: string;
  locale?: string;
  timeout?: string;
  'max-length'?: string;
}

async function exists(p: string) {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function read(): Promise<RawConfig> {
  if (!(await exists(CONFIG_FILE))) return {};
  const content = await fs.readFile(CONFIG_FILE, 'utf8');
  return ini.parse(content);
}

export const config = {
  async load(silent = false): Promise<Config> {
    const raw = await read();
    const env = process.env;

    const apiKey = env.GROQ_API_KEY || raw.GROQ_API_KEY;
    if (!apiKey && !silent) {
      throw new AppError('Set API key: rewordcommit config set GROQ_API_KEY=gsk_xxx');
    }
    if (apiKey && !apiKey.startsWith('gsk_') && !silent) {
      throw new AppError('Invalid API key format');
    }

    return {
      GROQ_API_KEY: apiKey || '',
      model: raw.model || 'llama-3.3-70b-versatile',
      locale: raw.locale || 'en',
      timeout: parseInt(raw.timeout || '10000', 10),
      maxLength: Math.min(200, Math.max(20, parseInt(raw['max-length'] || '100', 10))),
    };
  },

  async set(pairs: [string, string][]) {
    const raw = await read();
    const valid = ['GROQ_API_KEY', 'model', 'locale', 'timeout', 'max-length'];

    for (const [k, v] of pairs) {
      if (!valid.includes(k)) {
        throw new AppError(`Invalid key: ${k}`);
      }
      (raw as any)[k] = v;
    }

    await fs.writeFile(CONFIG_FILE, ini.stringify(raw), 'utf8');
  },
};
