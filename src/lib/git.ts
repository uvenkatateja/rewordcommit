import { execa } from 'execa';
import { AppError } from './errors.js';

const EXCLUDE_FILES = [
  'package-lock.json',
  'pnpm-lock.yaml', 
  'yarn.lock',
  '*.lock',
];

export const git = {
  async assertRepo() {
    const { failed } = await execa('git', ['rev-parse', '--git-dir'], { reject: false });
    if (failed) throw new AppError('Not a git repository');
  },

  async lastCommitMessage(): Promise<string | null> {
    try {
      const { stdout } = await execa('git', ['log', '-1', '--format=%s']);
      return stdout.trim() || null;
    } catch {
      return null;
    }
  },

  async lastCommitDiff(): Promise<string | null> {
    const excludes = EXCLUDE_FILES.map((f) => `:(exclude)${f}`);
    try {
      const { stdout } = await execa('git', ['diff', 'HEAD~1', 'HEAD', ...excludes]);
      return stdout || null;
    } catch {
      // First commit - use show instead
      try {
        const { stdout } = await execa('git', ['show', 'HEAD', '--format=']);
        return stdout || null;
      } catch {
        return null;
      }
    }
  },

  async amend(message: string) {
    await execa('git', ['commit', '--amend', '-m', message]);
  },

  async hasUnpushedCommits(): Promise<boolean> {
    try {
      const { stdout } = await execa('git', ['cherry', '-v']);
      return stdout.trim().length > 0;
    } catch {
      return true;
    }
  },

  async forcePush() {
    await execa('git', ['push', '--force-with-lease']);
  },
};
