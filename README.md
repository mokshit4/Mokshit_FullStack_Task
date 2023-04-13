# Node.js Bitcoin Wallet
This repository contains a node.js script that allows you to create and import bitcoin wallets using BIP39 Mnemonic, and the mnemonics are stored in sqlite locally, generate an unused address for the same. It also allows to get the bitcoin balance and transaction details for a address on the bitcoin testnet.

## Dependencies
The script requires following dependencies
* [bitcoinjs-lib](https://github.com/bitcoinjs/bitcoinjs-lib)
* [bip39](https://github.com/bitcoinjs/bip39)
* [hdkey](https://github.com/cryptocoinjs/hdkey)
* [sqlite3](https://github.com/TryGhost/node-sqlite3)
* [axios](https://github.com/axios/axios)

## Usage
To use this script simply run 
`node index.js`
The script include following functions:
* `createWallet`: creates a new Bitcoin wallet and saves it to a local SQLite database.
* `importWallet(mnemonic)`: imports an existing Bitcoin wallet using a BIP39 mnemonic and saves it to a local SQLite database.
* `listWallets`: lists all Bitcoin wallets saved in the local SQLite database.
* `generateUnusedadd(mnemonic)`: generates an unused Bitcoin address for a given wallet mnemonic saved in the local SQLite database.
* `getTestnetBalance(address)`: retrieves the balance of a given Bitcoin address on the Bitcoin testnet.
* `getTestnetTransactions(address)`: retrieves the transaction history of a given Bitcoin address on the Bitcoin testnet.

Note: Just check that the mnemonic in generateUnusedAddress call is the one present in sqlite already or else import it. Test input is already coded in the function call.

