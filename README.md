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
    <td>Public key</td>
    <td>The public key that was used to sign the transaction. The signature is generated based on this key.</td>
    <td>Public key in WIF format (with <code>STM</code> prefix).</td>
    <td>It can be unavailable in case of broken signature.</td>
  </tr>
  <tr>
    <td rowspan="3">Authority path</td>
    <td rowspan="3">The authority path evaluation starts from matching blockchain account to the public key calculated from signature. Then the algorithm iterates through account list retrieved in previous step and checks their authority, to find matching public key. It visits also all account based authority entries defined in given account to finally find the account required to satisfy transaction authority.</td>
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
    <td rowspan="2">ID of the transaction (transaction hash, which depends on the chosen pack type). Uniquely identifies the transaction within the blockchain network.</td>
    <td>The ID is presented in hex string format.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>The application displays the ID for both pack type variants, allowing users to see the representation for each type when the specific pack type is unknown.</td>
    <td>In situations where the pack type is unknown, the application faces uncertainty in selecting the appropriate serialization ID to display. To address this, it presents both serialization ID variants.</td>
  </tr>
  <tr>
    <td rowspan="2">Sig Digest</td>
    <td rowspan="2">The transaction digest calculated for signing purposes. It depends on transaction content (ID) and chosen chain ID.</td>
    <td>Sig Digest in hex string format</td>
    <td> - </td>
  </tr>
    <tr>
    <td>The application displays the Sig Digest for both pack type variants, allowing users to see the representation for each type when the specific pack type is unknown.</td>
    <td>In situations where the pack type is unknown, the application faces uncertainty in selecting the appropriate serialization Sig Digest to display. To address this, it presents both serialization Sig Digest variants.</td>
  </tr>
  <tr>
    <td rowspan="2">TaPoS</td>
    <td rowspan="2">Part of transaction data, matching rules defined in Transaction as Proof of Stake to conform blockchain sanity. In HIVE TaPoS data are valid for 64k blocks. You can find more information <a href="https://hive.pages.syncad.com/wax-doc/typescript/transaction-and-operation/#transaction-as-proof-of-stake-tapos">here.</a> </td>
    <td>Reference Block Number.</td>
    <td>This is the least significant 16 bits of the block number. It uniquely points to one of the 65536 blocks preceding the block where the transaction is included.</td>
  </tr>
  <tr>
    <td>Reference Block Prefix.</td>
    <td>This is a single 32-bit word from the hash of the block indicated by the Ref Block Num.</td>
  </tr>
  <tr>
    <td>Expiration Time</td>
    <td>The Expiration Time of the transaction indicates the time limit within the transaction must be included in a block to be considered valid. The maximum of expiration time in HIVE blockchain is 1 hour.</td>
    <td>The Expiration Time is presented in ISO 8601 format, which is a standardized way to represent date and time. It is an absolute value of date time.</td>
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
    <td rowspan="3">Signature that corresponds to the transaction required authority.</td>
    <td>Signature in hex string format.</td>
    <td> - </td>
  </tr>
  <tr>
    <td>No signature present (open authority)</td>
    <td>Open authority indicates that the transaction creator has no specified authorities in their account. The transaction can still be considered valid and processed without requiring a signature.</td>
  </tr>
  <tr>
    <td>Missing signature</td>
    <td>Missing signature informs that there is no matching signature to the required authorities, likely indicating that the transaction is invalid. It also can happen when the authority of creator account has been changed and public key decoded from signature does not match any account anymore.</td>
  </tr>
  <tr>
    <td rowspan="5">Authority</td>
    <td>The Account field points name of the account retrieved from transaction required authority set.</td>
    <td>Authority accounts (link to more account information)</td>
    <td>Account names included in required authorities for the transaction. By clicking on the account name, users are seamlessly redirected to our block explorer application, providing access to detailed account information.</td>
  </tr>
  <tr>
    <td rowspan="4">The Type field points authority type retrieved from transaction required authority set.</td>
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
    <td rowspan="3">The Satisfied property indicates whether the required authorities are covered by the transaction signatures (excluding open authority case). It also verifies that the authority weight meets or exceeds the required threshold.</td>
    <td>True</td>
    <td>This means that all the necessary conditions are fulfilled.</td>
  </tr>
  <tr>
    <td>False</td>
    <td>This means that not all the necessary conditions are fulfilled.</td>
  </tr>
  <tr>
    <td>Blockchain Forced True</td>
    <td>This means that the application is unable to explicitly confirm if all the necessary conditions are met. However, the transaction is valid, so we assume the fulfillment.</td>
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
    <td>The Account field points name of the account retrieved from transaction required authority set for specific operation.</td>
    <td>Authority account (link to more account information)</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="4">Authority Type</td>
    <td rowspan="4">The Type field points authority type retrieved from transaction required authority set for specific operation.</td>
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
    <td rowspan="3">The Satisfied property indicates whether the required authorities for given operation are covered by the transaction signatures (excluding open authority case). It also verifies that the authority weight meets or exceeds the required threshold.</td>
    <td>True</td>
    <td>This means that all the necessary conditions are fulfilled.</td>
  </tr>
  <tr>
    <td>False</td>
    <td>This means that not all the necessary conditions are fulfilled.</td>
  </tr>
  <tr>
    <td>Blockchain Forced True</td>
    <td>This means that the application is unable to explicitly confirm if all the necessary conditions are met. However, the transaction is valid, so  we assume the fulfillment.</td>
  </tr>
  <tr>
    <td>Operation Type</td>
    <td>The type of operation, such as a comment_operation.</td>
    <td>Operation type in plain text string format</td>
    <td> - </td>
  </tr>
  <tr>
    <td rowspan="2">Operation Content</td>
    <td rowspan="2">It contains the content of the operation in a chosen format, allowing for customizable representation of the operation details.</td>
    <td>Formatted operation</td>
    <td>A formatted operation refers to the presentation of operation details in a structured and organized way, making it simple to read the operation purpose.</td>
  </tr>
  <tr>
    <td>Operation JSON</td>
    <td>An operation in raw JSON format is a representation of operation details using JSON without any modifications or enhancements.</td>
  </tr>
</table>

#### Binary View Format

The binary view provides users with a detailed hexadecimal (hex) representation of a transaction, offering a clear and precise insight into its raw data format. Users have the flexibility to select specific ranges of the hex data, allowing them to copy either the binary (ANSI) or hex values as needed. As they interact with the data, the component dynamically highlights the selected hex range within the transaction's JSON representation, creating an intuitive visual link between the hex data and its structured JSON format. This feature enhances user understanding by enabling them to hover over and observe highlighted colors that map the hex parts directly to the corresponding elements in the transaction JSON. This way, the tranasction analysis is very simple and fast.

### Examples:

<table>
  <tr>
    <th colspan="4">
      <p align="center">Examples</p>
    </th>
  </tr>
  <tr>
    <td width="20%">
      <b>Title:</b> <br><br>
      Broken signature.
    </td>
    <td width="20%">
      <b>Invaid signature:</b> <br><br>
      20543...e7f91
    </td>
    <td width="20%">
      <b>Wrong public key:</b> <br><br>
      STM7u...ZrQnw
    </td>
    <td width="40%">
      <b>Description:</b> <br><br>
      The signature in this case is invalid, so we cannot calculate the correct public key. The public key calculated from the broken signature is not associated with any blockchain account. This means that we cannot deduce the authority path, and the required authorities for the transaction are not satisfied. Therefore, the transaction is marked as invalid.
    </td>
  </tr>
  <tr>
    <td width="20%">
      <b>Title:</b> <br><br>
      Public key without any reference.
    </td>
    <td width="20%">
      <b>Valid signature:</b> <br><br>
      20543...dc22e
    </td>
    <td width="20%">
      <b>Public key without reference:</b> <br><br>
      STM8W...pFtCF
    </td>
    <td width="40%">
      <b>Description:</b> <br><br>
      The signature in this case is valid, but the calculated public key is not associated with any blockchain account. This can happen when the account changed its authority (a public key) after the transaction was signed, broadcasted, and accepted by the blockchain. So the transaction is valid, but because we cannot identify the signer account, further authority analysis is impossible, i.e., we cannot deduce the authority path nor associate the given signature to the authorities required by specific operations. Even though it is a positive case, unfortunately, most of the information shown by the application is unavailable.
    </td>
  </tr>
  <tr>
    <td width="20%">
      <b>Title:</b> <br><br>
      Broken authority.
    </td>
    <td width="20%">
      <b>Valid signature:</b> <br><br>
      20543...dc22e
    </td>
    <td width="20%">
      <b>Public key with blockchain reference:</b> <br><br>
      STM8W...pFtCF
    </td>
    <td width="40%">
      <b>Description:</b> <br><br>
      The signature and the calculated public key in this case are valid, and we can find the account associated with the public key, but the found account no longer satisfies the required authority. For example, consider the account "alice", who gave agency authorization to "bob" for posting authority. "Bob" signed and broadcasted a transaction with "alice" as the required posting authority. Subsequently, "alice" changed her posting authority by removing "bob" from her account authorities. Now, we can find the account associated with the key used to sign the transaction, which belongs to "bob", but none of the transaction's required authorities relate to the signing key (no connection between "alice" and "bob").
    </td>
  </tr>
  <tr>
    <td width="20%">
      <b>Title:</b> <br><br>
      Open authority.
    </td>
    <td width="20%">
      <b>No signature.</b>
    </td>
    <td width="20%">
      <b>No public key.</b>
    </td>
    <td width="40%">
      <b>Description:</b> <br><br>
      In this case, the transaction is valid even though there is no signature. This can happen in situations where the account, whose authority is required for the transaction, has no specified authorities. Even so, the required authorities in this case will be satisfied, and the matching signature will be marked as "open authority."
    </td>
  </tr>
</table>

## Real examples

Below we present some real transactions examples. Simply copy the id, and paste into the application input to see the results.

1. Valid tranasction without any signature (open authority): `a94716f567611b9f930369c8f53df27d4efe5ad2`
2. Transaction directly signed with legacy serialization mode by the required authority account: `da9602787693edccdafa1e7325502e0bb14453d1`
3. Transaction directly signed with hf26 serialization mode by the required authority account: `7b84c7620c95eaf341821d4bfb126a219b0d0150`
4. Transaction with multiple operations and multiple signatures. All of them are directly authorized: `a7efc7be69861fdcdc39712e532beb8ddc701f03`
5. Transaction with single nest level for delegated authority: `897233fbcbe012e340478c8de7eb97755c542f09`
6. Transaction with 2 (maximum for valid transactiona) nest levels for delegated authority: `07e7d9ecaad2a11bc36db6d7046a55e231627574`
