import { command, Command } from 'cleye';
import { green, red, dim } from 'kolorist';
import { config } from '../lib/config.js';
import { AppError } from '../lib/errors.js';

export const configCmd: Command = command(
  {
    name: 'config',
    parameters: ['<action>', '[key=value...]'],
    help: {
      description: 'Manage configuration',
      examples: [
        'rewordcommit config get GROQ_API_KEY',
        'rewordcommit config set GROQ_API_KEY=gsk_xxx',
      ],
    },
  },
  async (argv) => {
    try {
      const { action, keyValue: args } = argv._;

      if (action === 'get') {
        const cfg = await config.load(true);
        for (const key of args) {
          const val = (cfg as any)[key];
          console.log(`${key}=${val ?? dim('(not set)')}`);
        }
      } else if (action === 'set') {
        const pairs = args.map((s) => {
          const idx = s.indexOf('=');
          return [s.slice(0, idx), s.slice(idx + 1)] as [string, string];
        });
        await config.set(pairs);
        console.log(`${green('✔')} Saved`);
      } else {
        throw new AppError(`Unknown action: ${action}`);
      }
    } catch (err: any) {
      console.error(`${red('✖')} ${err.message}`);
      process.exit(1);
    }
  }
);
