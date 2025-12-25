# rewordcommit

Reword your lazy commits with AI. Rewrites vague commit messages into clear, professional ones using Groq.

```bash
git commit -m "fix"   # oops
rewordcommit          # → "fix: handle null user in auth middleware"
```

## Install

```bash
npm install -g rewordcommit
```

## Setup

```bash
# Get your key from https://console.groq.com/keys
rewordcommit config set GROQ_API_KEY=gsk_your_key
```

## Usage

```bash
rewordcommit         # Interactive mode
rewordcommit -q      # Quick mode (auto-amend)
rewordcommit -c      # Conventional commit format
rewordcommit -p      # Push after amending
rewordcommit -v      # Show diff
rewordcommit -qcp    # All flags combined
```

Also available as `rwc`:

```bash
rwc -q
```

## Config

```bash
rewordcommit config get GROQ_API_KEY
rewordcommit config set model=llama-3.3-70b-versatile
rewordcommit config set max-length=80
rewordcommit config set locale=en
```

| Option | Default | Description |
|--------|---------|-------------|
| `GROQ_API_KEY` | - | Groq API key (required) |
| `model` | `llama-3.3-70b-versatile` | AI model |
| `max-length` | `100` | Max message length |
| `locale` | `en` | Output language |
| `timeout` | `10000` | API timeout (ms) |

## How it works

1. Reads your last commit message
2. Gets the diff from that commit  
3. Sends to Groq AI for rewriting
4. Shows old → new message
5. You confirm, edit, or cancel

## Links

- [GitHub](https://github.com/uvenkatateja/rewordcommit)
- [npm](https://www.npmjs.com/package/rewordcommit)

## License

MIT
