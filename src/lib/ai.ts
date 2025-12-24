import Groq from 'groq-sdk';
import { AppError } from './errors.js';
import type { Config } from './config.js';

const PROMPT = `You rewrite vague git commit messages into clear, professional ones.

Rules:
- Output ONLY the commit message, nothing else
- Format: type: description (no scope)
- Imperative mood (add, fix, update - not added, fixed)
- Be specific based on the code changes
- Max length specified below

Types: feat, fix, docs, style, refactor, perf, test, build, ci, chore

Examples:
"fix" → "fix: handle null user in auth middleware"
"wip" → "feat: add password reset flow"
"update" → "refactor: simplify cart total calculation"`;

export const ai = {
  async rewrite(
    cfg: Config,
    oldMessage: string,
    diff: string,
    conventional?: boolean
  ): Promise<string> {
    const client = new Groq({
      apiKey: cfg.GROQ_API_KEY,
      timeout: cfg.timeout,
    });

    const truncatedDiff = diff.length > 6000 ? diff.slice(0, 6000) + '\n...' : diff;
    const conventionalHint = conventional ? '\nMUST use conventional commit format.' : '';

    try {
      const res = await client.chat.completions.create({
        model: cfg.model,
        messages: [
          { role: 'system', content: PROMPT },
          {
            role: 'user',
            content: `Rewrite this commit message:\n\nOLD: "${oldMessage}"\n\nCHANGES:\n${truncatedDiff}\n\nMax ${cfg.maxLength} chars. Language: ${cfg.locale}.${conventionalHint}`,
          },
        ],
        temperature: 0.3,
        max_tokens: 100,
      });

      const msg = res.choices[0]?.message?.content?.trim();
      if (!msg) throw new AppError('Empty AI response');

      return sanitize(msg, cfg.maxLength);
    } catch (err: any) {
      if (err instanceof Groq.APIError) {
        throw new AppError(`Groq error: ${err.status} - ${err.message}`);
      }
      if (err.code === 'ENOTFOUND') {
        throw new AppError('Network error - check your connection');
      }
      throw err;
    }
  },
};

function sanitize(msg: string, maxLen: number): string {
  let clean = msg
    .trim()
    .replace(/^["']|["']$/g, '')
    .replace(/\n/g, ' ')
    .replace(/\.$/, '');

  if (clean.length > maxLen) {
    const cut = clean.slice(0, maxLen);
    const space = cut.lastIndexOf(' ');
    clean = space > maxLen * 0.5 ? cut.slice(0, space) : cut;
  }

  return clean;
}
