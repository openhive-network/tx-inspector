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

## App specification

Below is information about the individual fields in the tables. It explains what they mean and how to read them correctly.

### Signatures section

<table>
  <tr>
    <th width="20%">Field Name</th>
    <th width="30%">Description</th>
    <th width="20%" >Potential Output</th>
    <th width="30%">Meaning</th>
  </tr>
  <tr>
    <td>Signature</td>
    <td>The signature generated from the public key used to sign the transaction.</td>
    <td>Signature in string format</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="3">Pack</td>
    <td rowspan="3">Type of pack, based on how the transaction has been serialized.</td>
    <td>HF26</td>
    <td>HF26 serialization used for the transaction.</td>
  </tr>
  <tr>
    <td>Legacy</td>
    <td>Legacy serialization used for the transaction.</td>
  </tr>
  <tr>
    <td>Unknown</td>
    <td>Unknown indicates that the application cannot correctly determine the pack type. The transaction is likely incorrect in this situation.</td>
  </tr>
  <tr>
    <td>Public key</td>
    <td>The public key that was used to sign the transaction. The signature is generated based on this key.</td>
    <td>Public key in WIF format (with <code>STM</code> prefix).</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="3">Authority path</td>
    <td rowspan="3">The authority path determination is based on the public key. The algorithm iterates through accounts on the blockchain that are involved in the transaction and checks their authority to find the correct public key, display all authority dependents, and finally identify the account that signed the transaction.</td>
    <td>Direct signing</td>
    <td>If the transaction was signed directly by the transaction creator, the authority path will include only a single account. This means that the public key is included in this account's authorities.</td>
  </tr>
  <tr>
    <td>Delegated authority</td>
    <td>Delegated authority means that the transaction creator did not sign the transaction themselves. Instead, they delegated the signing to another account, referred to as a single nest level. The blockchain accepts a maximum of 2 nest levels (which means that the authority path in a correct transaction can have a maximum of 3 accounts). The authority path will then display from the account that signed the transaction to the account that created the transaction, showing all dependents, including authority weight and required threshold.</td>
  </tr>
  <tr>
    <td>No authority path</td>
    <td>If the public key is incorrect or some of the accounts involved in the transaction have changed their authorities, then the algorithm cannot find any account linked to the public key. This means we cannot deduce the authority path. If some authorities have changed, the transaction is correct, but in other cases, it may indicate that the transaction is invalid.</td>
  </tr>
</table>

### Transaction Section

<table>
  <tr>
    <th width="20%">Field Name</th>
    <th width="30%">Description</th>
    <th width="20%">Potential Output</th>
    <th width="30%">Meaning</th>
  </tr>
  <tr>
    <td rowspan="2">ID</td>
    <td rowspan="2">ID of the transaction. Uniquely identifies the transaction within the blockchain network.</td>
    <td>ID in string format based on the pack type.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>Both serialization variants ID.</td>
    <td>If the pack type is unknown, the application is unable to determine which serialization ID to display, so it presents both variants.</td>
  </tr>
  <tr>
    <td rowspan="2">Sig Digest</td>
    <td rowspan="2">Sig Digest of the transaction, calculated based on chain ID.</td>
    <td>Sig Digest in string format based on the pack type.</td>
    <td> - </td>
  </tr>
    <tr>
    <td>Both serialization variants Sig Digest.</td>
    <td>If the pack type is unknown, the application is unable to determine which serialization Sig Digest to display, so it presents both variants.</td>
  </tr>
  <tr>
    <td rowspan="2">TaPoS</td>
    <td rowspan="2">Transaction as Proof of Stake.</td>
    <td>Reference Block Number.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>Reference Block Prefix.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>Expiration Time</td>
    <td>Expiration Time of the transaction.</td>
    <td>Expiration Time in ISO 8601 format</td>
    <td> - </td>
  </tr>
</table>
