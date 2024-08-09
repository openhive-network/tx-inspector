# Transaction inspector

This app allows to check all important information about your transaction, like `id`, `sig digest`, `public keys` etc.
It will check if the transaction is valid and will display the whole authority path.
Also in case of any problems with your transaction, it will help you to diagnose and direct you to the potenatial solution.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
pnpm run dev
```

## Production

Build the application for production:

```bash
pnpm run build
```

Locally preview production build:

```bash
pnpm run preview
```
