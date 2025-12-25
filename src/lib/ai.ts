import Groq from 'groq-sdk';
import { AppError } from './errors.js';
import type { Config } from './config.js';

const PROMPT = `You are an expert at writing precise, informative git commit messages by analyzing code diffs.

PROCESS:
1. Read the git diff carefully - identify files changed, functions modified, logic added/removed
2. Determine the primary purpose: new feature? bug fix? refactoring?
3. Extract concrete details: specific function names, file paths, key logic changes
4. Write a commit message that clearly communicates WHAT changed and WHY

FORMAT: <type>: <specific description>
- Use imperative mood (add, fix, update - NOT added, fixed, updating)
- Be SPECIFIC - mention actual functions, components, files, or logic
- Avoid vague words like "stuff", "things", "various", "some"
- Output ONLY the final commit message, no explanations

TYPE SELECTION:
- feat: new functionality or capability for users
- fix: resolves a bug, error, or incorrect behavior
- refactor: restructures code without changing external behavior
- perf: improves performance (speed, memory, efficiency)
- docs: documentation only (README, comments, guides)
- style: formatting, whitespace, semicolons (no logic change)
- test: adds, updates, or fixes tests
- build: build system, dependencies, package configs
- ci: CI/CD pipelines, GitHub Actions, deployment
- chore: maintenance tasks, tooling, configs

EXAMPLES (learn from these):

DIFF: + function validateEmail(email: string) { ... } in src/utils/validation.ts
BAD: "feat: add validation"
GOOD: "feat: add email validation utility function"

DIFF: - if (user.profile) { ... } + if (user?.profile) { ... } in getUserData()
BAD: "fix: bug"
GOOD: "fix: prevent null reference error in getUserData"

DIFF: Split 300-line UserService.ts into UserService, UserValidator, UserRepository
BAD: "refactor: update user code"
GOOD: "refactor: split UserService into separate concerns"

DIFF: + React.memo() wrapper on ProductCard component
BAD: "perf: optimize"
GOOD: "perf: memoize ProductCard to prevent re-renders"

DIFF: Updated axios from 0.27.2 to 1.6.0 in package.json
BAD: "chore: update deps"
GOOD: "build: upgrade axios to v1.6.0"

GOAL: A developer reading your commit message should understand the change without viewing the diff.`;

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

    const truncatedDiff = diff.length > 6000 ? diff.slice(0, 6000) + '\n...[truncated]' : diff;
    const conventionalHint = conventional ? '\n- MUST follow conventional commit format strictly' : '';

    try {
      const res = await client.chat.completions.create({
        model: cfg.model,
        messages: [
          { role: 'system', content: PROMPT },
          {
            role: 'user',
            content: `Analyze the code changes below and write a specific, informative commit message.

ORIGINAL MESSAGE: "${oldMessage}"

GIT DIFF:
${truncatedDiff}

REQUIREMENTS:
- Maximum ${cfg.maxLength} characters
- Language: ${cfg.locale}
- Extract specific details from the diff (function names, files, logic changes)${conventionalHint}
- Output ONLY the commit message, nothing else`,
          },
        ],
        temperature: 0.4,
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
