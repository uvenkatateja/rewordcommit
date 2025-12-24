import { intro, outro, spinner, select, text, isCancel, confirm } from '@clack/prompts';
import { black, dim, green, red, yellow, bgCyan } from 'kolorist';
import { git } from '../lib/git.js';
import { ai } from '../lib/ai.js';
import { config } from '../lib/config.js';
import { AppError } from '../lib/errors.js';

const BANNER = `
╔══════════════════════════════════════════════════════════════════════════════════════════════════╗
║ ██████╗ ███████╗██╗    ██╗ ██████╗ ██████╗ ██████╗  ██████╗ ██████╗ ███╗   ███╗███╗   ███╗██╗████████╗ ║
║ ██╔══██╗██╔════╝██║    ██║██╔═══██╗██╔══██╗██╔══██╗██╔════╝██╔═══██╗████╗ ████║████╗ ████║██║╚══██╔══╝ ║
║ ██████╔╝█████╗  ██║ █╗ ██║██║   ██║██████╔╝██║  ██║██║     ██║   ██║██╔████╔██║██╔████╔██║██║   ██║    ║
║ ██╔══██╗██╔══╝  ██║███╗██║██║   ██║██╔══██╗██║  ██║██║     ██║   ██║██║╚██╔╝██║██║╚██╔╝██║██║   ██║    ║
║ ██║  ██║███████╗╚███╔███╔╝╚██████╔╝██║  ██║██████╔╝╚██████╗╚██████╔╝██║ ╚═╝ ██║██║ ╚═╝ ██║██║   ██║    ║
║ ╚═╝  ╚═╝╚══════╝ ╚══╝╚══╝  ╚═════╝ ╚═╝  ╚═╝╚═════╝  ╚═════╝ ╚═════╝ ╚═╝     ╚═╝╚═╝     ╚═╝╚═╝   ╚═╝    ║
╚══════════════════════════════════════════════════════════════════════════════════════════════════╝`;

interface Flags {
  quick?: boolean;
  push?: boolean;
  verbose?: boolean;
  conventional?: boolean;
}

export async function runAmend(flags: Flags) {
  try {
    console.log(BANNER);
    intro(bgCyan(black(' rewordcommit ')));

    await git.assertRepo();
    const s = spinner();

    // Step 1: Get last commit
    s.start('Reading last commit');
    const oldMsg = await git.lastCommitMessage();
    if (!oldMsg) throw new AppError('No commits found');
    s.stop(`Last commit: ${dim(oldMsg)}`);

    // Step 2: Get diff
    s.start('Analyzing changes');
    const diff = await git.lastCommitDiff();
    if (!diff) throw new AppError('Could not read commit diff');
    if (flags.verbose) {
      const preview = diff.length > 1500 ? diff.slice(0, 1500) + '\n...' : diff;
      console.log(`\n${dim('─── Diff ───')}\n${preview}\n`);
    }
    s.stop('Changes analyzed');

    // Step 3: Generate new message
    const cfg = await config.load();
    s.start('Generating better message');
    const newMsg = await ai.rewrite(cfg, oldMsg, diff, flags.conventional);
    s.stop('Message ready');

    console.log(`\n  ${dim('Old:')} ${red(oldMsg)}`);
    console.log(`  ${dim('New:')} ${green(newMsg)}\n`);

    // Step 4: Apply
    let finalMsg = newMsg;

    if (!flags.quick) {
      const action = await select({
        message: 'What to do?',
        options: [
          { value: 'use', label: 'Use this message' },
          { value: 'edit', label: 'Edit first' },
          { value: 'cancel', label: 'Cancel' },
        ],
      });

      if (isCancel(action) || action === 'cancel') {
        outro('Cancelled');
        return;
      }

      if (action === 'edit') {
        const edited = await text({
          message: 'Edit message:',
          initialValue: newMsg,
          validate: (v) => v.trim() ? undefined : 'Cannot be empty',
        });
        if (isCancel(edited)) {
          outro('Cancelled');
          return;
        }
        finalMsg = String(edited).trim();
      }
    }

    await git.amend(finalMsg);

    // Step 5: Push if requested
    if (flags.push) {
      const unpushed = await git.hasUnpushedCommits();
      if (!unpushed) {
        console.log(`\n  ${yellow('⚠')} Commit already pushed`);
        const ok = await confirm({ message: 'Force push?' });
        if (!ok || isCancel(ok)) {
          outro(`${green('✔')} Amended (not pushed)`);
          return;
        }
      }
      s.start('Pushing');
      await git.forcePush();
      s.stop('Pushed');
    }

    outro(`${green('✔')} Done!`);
  } catch (err: any) {
    outro(`${red('✖')} ${err.message}`);
    if (!(err instanceof AppError) && process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}
