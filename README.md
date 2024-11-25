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

### Signatures Section

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
    <td>Signature in hex string format.</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="3">Pack</td>
    <td rowspan="3">Determines how the transaction has been serialized. There are allowed two serialization forms: Legacy (where assets have been serialized, using their token textual names i.e. "1.000000 VESTS"); HF26 (where assets have been serialized, using NAI form i.e. <code>{"amount":"1000000","precision":6,"nai":"@@000000037"}</code>).</td>
    <td>HF26</td>
    <td>HF26 serialization used for the transaction.</td>
  </tr>
  <tr>
    <td>Legacy</td>
    <td>Legacy serialization used for the transaction.</td>
  </tr>
  <tr>
    <td>Unknown</td>
    <td>Unknown indicates that the application cannot correctly determine the pack type. It can happen for transactions not containing any assets (which are sensitive to chosen serialization mode).</td>
  </tr>
  <tr>
    <td rowspan="2">Public key</td>
    <td rowspan="2">The public key that was used to sign the transaction. The signature is generated based on this key.</td>
    <td>Public key in WIF format (with <code>STM</code> prefix).</td>
    <td> - </td>
  </tr>
  <tr>
    <td>It can be unavailable in case of broken signature.</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="3">Authority path</td>
    <td rowspan="3">The authority path evaluation starts from matching blockchain accounts to the public key calculated from signature. Then the algorithm iterates through account list retrieved in previous step and checks their authority, to find matching public key. It visits also all account based authority entries defined in given account to finally find the account required to satisfy transaction authority.</td>
    <td>Direct signing</td>
    <td>If the transaction was signed by the account directly responsible for its required authority, the authority path will include only this single account. This means that the public key is included in this account's authorities.</td>
  </tr>
  <tr>
    <td>Delegated authority</td>
    <td>Delegated authority means that the account which signed the transaction is different than account required to satisfy its authority. The blockchain accepts a maximum of 2 levels of authority delegations (which means that the authority path in a correct transaction can have a maximum of 3 accounts). The authority path will contain entries, starting from the signer account, then showing delegated accounts up to required authority account. Each path entry contains information related to weight, threshold and authority level specified at given authority definition.</td>
  </tr>
  <tr>
    <td>No authority path</td>
    <td>Authority path can be not determined, when public key calculated from signature is invalid or does not match to any blockchain account. There can be no matching account for given public key because the account authority was changed over time and this key is not referenced anymore. That can happen for old valid blockchain transactions specific to accounts which changed their authority.</td>
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
    <td>The ID is presented in string format, which differs depending on the pack type.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>The application displays the ID for both pack type variants, allowing users to see the representation for each type when the specific pack type is unknown.</td>
    <td>In situations where the pack type is unknown, the application faces uncertainty in selecting the appropriate serialization ID to display. To address this, it presents both serialization ID variants.</td>
  </tr>
  <tr>
    <td rowspan="2">Sig Digest</td>
    <td rowspan="2">Sig Digest of the transaction, calculated based on chain ID.</td>
    <td>Sig Digest in string format based on the pack type.</td>
    <td> - </td>
  </tr>
    <tr>
    <td>The application displays the Sig Digest for both pack type variants, allowing users to see the representation for each type when the specific pack type is unknown.</td>
    <td>In situations where the pack type is unknown, the application faces uncertainty in selecting the appropriate serialization Sig Digest to display. To address this, it presents both serialization Sig Digest variants.</td>
  </tr>
  <tr>
    <td rowspan="2">TaPoS</td>
    <td rowspan="2">Transaction as Proof of Stake.</td>
    <td>Reference Block Number.</td>
    <td>The Blockchain ref block num is a reference number that denotes the specific block within the blockchain that the transaction is linked to. This number helps in identifying the block's position within the chain, serving as a critical piece of data for transaction verification and tracking within the blockchain ecosystem.</td>
  </tr>
  <tr>
    <td>Reference Block Prefix.</td>
    <td>The Blockchain ref block prefix is a unique value extracted from the reference block header, providing a concise point of reference for transactions. This prefix aids in verifying the transaction's placement and association with a specific block in the blockchain.</td>
  </tr>
  <tr>
    <td>Expiration Time</td>
    <td>The Expiration Time of the transaction indicates the time limit within which the transaction must be included in a block for it to be considered valid. The maximum of expiration time in HIVE blockchain is 1 hour.</td>
    <td>The Expiration Time is presented in ISO 8601 format, which is a standardized way to represent date and time.</td>
    <td> - </td>
  </tr>
</table>

### Required Authorities Section

<table>
  <tr>
    <th width="20%">Field Name</th>
    <th width="30%">Description</th>
    <th width="20%">Potential Output</th>
    <th width="30%">Meaning</th>
  </tr>
  <tr>
    <td rowspan="3">Matching Signature</td>
    <td rowspan="3">Signature that corresponds to the authority accounts.</td>
    <td>Signature in string format</td>
    <td> - </td>
  </tr>
  <tr>
    <td>Open authority</td>
    <td>Open authority indicates that the transaction creator has no specified authorities in their account, allowing the transaction to be valid without any signature.</td>
  </tr>
  <tr>
    <td>Missing signature</td>
    <td>Missing signature signifies that there is no signature for the required authorities for the transaction, likely indicating that the transaction is invalid.</td>
  </tr>
  <tr>
    <td>Authority accounts</td>
    <td>Authority accounts specify which account's authority is required for the transaction.</td>
    <td>Authority accounts (link to more account information)</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="4">Authority Type</td>
    <td rowspan="4">Indicates one of the four possible authority types based on the account's authorities and public key.</td>
    <td>Posting</td>
    <td>The public key is within the posting authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Owner</td>
    <td>The public key is within the owner authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Active</td>
    <td>The public key is within the active authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Other</td>
    <td>The public key can be within one of the authorities of the required authority account.</td>
  </tr>
  <tr>
    <td rowspan="3">Satisfied</td>
    <td rowspan="3">The Satisfied property indicates whether the required authorities are covered by the transaction signatures, also checking if the authority weight meets the required threshold.</td>
    <td>True</td>
    <td>This means that all the necessary conditions are met.</td>
  </tr>
  <tr>
    <td>False</td>
    <td>This means that the necessary conditions are not met.</td>
  </tr>
  <tr>
    <td>Blockchain Forced True</td>
    <td>This means that the application cannot confirm if the necessary conditions are met, but the transaction is valid, so assumed fulfillment is accepted.</td>
  </tr>
</table>

### Body Section

#### Formatted/JSON format

<table>
  <tr>
    <th width="20%">Field Name</th>
    <th width="30%">Description</th>
    <th width="20%">Potential Output</th>
    <th width="30%">Meaning</th>
  </tr>
  <tr>
    <td>Authority Account</td>
    <td>Specifies the account whose authority is required for the operation.</td>
    <td>Authority account (link to more account information)</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="4">Authority Type</td>
    <td rowspan="4">Represents one of the four possible authority types for the operation, based on the account's authorities and public key.</td>
    <td>Posting</td>
    <td>The public key is part of the posting authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Owner</td>
    <td>The public key is part of the owner authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Active</td>
    <td>The public key is part of the active authority of the required authority account.</td>
  </tr>
  <tr>
    <td>Other</td>
    <td>The public key is included within one of the authorities of the required authority account.</td>
  </tr>
  <tr>
    <td rowspan="3">Satisfied</td>
    <td rowspan="3">Shows whether the required authorities for the operation are covered by the transaction signatures, checking if the authority weight meets the required threshold.</td>
    <td>True</td>
    <td>Indicates that all necessary conditions are met.</td>
  </tr>
  <tr>
    <td>False</td>
    <td>Indicates that the necessary conditions are not met.</td>
  </tr>
  <tr>
    <td>Blockchain Forced True</td>
    <td>Indicates that the application cannot verify if the necessary conditions are met, but the transaction is valid, assuming conditions are fulfilled.</td>
  </tr>
  <tr>
    <td>Operation Type</td>
    <td>The type of operation, such as a comment_operation.</td>
    <td>Operation type in string format</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="2">Operation Content</td>
    <td rowspan="2">Contains the content of the operation in a chosen format.</td>
    <td>Formatted operation</td>
    <td>An operation in a formatted, easy-to-read format.</td>
  </tr>
  <tr>
    <td>Operation JSON</td>
    <td>An operation in raw JSON format.</td>
  </tr>
</table>

#### Binary View Format

The binary view offers a hexadecimal (hex) representation of the transaction.
The user can select a specific range and copy its binary or hex.
The component highlights the selected hex range within the transaction's JSON representation.
Additionally, as the user hovers over and follows the highlighted colors, they can see which hex parts correspond to the actual transaction JSON.
