#!/usr/bin/env node
import { cli } from 'cleye';
import { runAmend } from './core/amend.js';
import { configCmd } from './core/config-cmd.js';

cli(
  {
    name: 'rewordcommit',
    version: '1.0.2',
    flags: {
      quick: {
        type: Boolean,
        description: 'Auto-amend without review',
        alias: 'q',
      },
      push: {
        type: Boolean,
        description: 'Force push after amending',
        alias: 'p',
      },
      verbose: {
        type: Boolean,
        description: 'Show diff details',
        alias: 'v',
      },
      conventional: {
        type: Boolean,
        description: 'Use conventional commit format',
        alias: 'c',
      },
    },
    commands: [configCmd],
    help: {
      description: 'AI-powered commit message rewriter - reword your lazy commits',
    },
  },
  (argv) => {
    runAmend(argv.flags);
  }
);
