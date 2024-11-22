# Transaction inspector

This app allows to check all important information about your transaction, like `id`, `sig digest`, `public keys` etc.
It will check if the transaction is valid and will display the whole authority path.
Also in case of any problems with your transaction, it will help you to diagnose and direct you to the potenatial solution.

## Setup

Make sure to install the dependencies:

```bash
pnpm install
```

## Configure

Make sure to configure the project using `.env` file. Copy `.env.example` to `.env` and adjust your configuration for your needs.

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
# This command should be used to preview the application on local server:
pnpm run preview

# you can use optional parameters `--host` and `--port` to specify custom endpoint for server listening, i.e.: `--host 0.0.0.0 --port 5005`

# For real production deployments, please use directly:
node ./.output/server/index.mjs

#To customize host and port, please use `HOST` and `PORT` environment variables to point such data, i.e.:
HOST=0.0.0.0 PORT=5005 node ./.output/server/index.mjs
```
