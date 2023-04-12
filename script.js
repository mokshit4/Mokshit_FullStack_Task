const bitcoin = require('bitcoinjs-lib');
const bip39 = require('bip39');
const hdkey = require('hdkey');
const sqlite3 = require('sqlite3');
const axios = require('axios');

// Connect to the local SQLite database
const db = new sqlite3.Database("./btc_wallets.sqlite");

// Create a table callled wallets table if it does not exist
db.run(
    "CREATE TABLE IF NOT EXISTS wallets (id INTEGER PRIMARY KEY, mnemonic TEXT, address TEXT, used INTEGER Default 1)"
  );  

// Create a new wallet using BIP39 mnemonic
const createWallet = async () => {
  // Generate a new mnemonic
  const mnemonic = bip39.generateMnemonic();

  // Derive the seed from the mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Create a root key from the seed for the testnet
  const root = hdkey.fromMasterSeed(seed, bitcoin.networks.testnet);

  // Derive the first account from the root key
  const addrNode = root.derive("m/44'/1'/0'/0/0"); // m/44'/0'/0'/0/0 for mainnet
  const address = bitcoin.payments.p2pkh({
    pubkey: addrNode.publicKey,
    network: bitcoin.networks.testnet,
  }).address;

  // Save the new wallet to the database
  await db.run("INSERT INTO wallets (mnemonic, address) VALUES (?, ?)", [
    mnemonic,
    address,
  ]);

  console.log(`New Wallet's First Address: ${address}`);
  console.log(`Mnemonic: ${mnemonic}`);
};

// Import an existing wallet using BIP39 mnemonic
const importWallet = async (mnemonic) => {
  // mnemonic validation
  if (!bip39.validateMnemonic(mnemonic)) {
    console.log("Invalid mnemonic");
    return;
  }
  // Derive the seed from the mnemonic
  const seed = await bip39.mnemonicToSeed(mnemonic);

  // Create a root key from the seed
  const root = hdkey.fromMasterSeed(seed, bitcoin.networks.testnet);

  // Derive the first account from the root key
  const addrNode = root.derive("m/44'/1'/0'/0/0"); // m/44'/0'/0'/0/0 for mainnet
  const address = bitcoin.payments.p2pkh({
    pubkey: addrNode.publicKey,
    network: bitcoin.networks.testnet,
  }).address;

  // Save the imported wallet to the database
  await db.run("INSERT INTO wallets (mnemonic, address) VALUES (?, ?)", [
    mnemonic,
    address,
  ]);

  console.log(`Imported Wallet Address: ${address}`);
};

// List all wallets from the local database
const listWallets = async () => {
  db.all('SELECT * FROM wallets', [], (err, rows) => {
    if (err) {
      throw err;
    }
    console.log(rows);
  });
};
 
// Generate an unused address for the mnemonic
const generateUnusedadd = async (mnemonic) => {
  db.get(`SELECT * FROM wallets WHERE mnemonic = ?`, [mnemonic], async (err, row) => {
    if (err) {
      throw err;
    }
    let used = row.used;
    used++;
        // Derive the seed from the mnemonic
    const seed = await bip39.mnemonicToSeed(mnemonic);

    // Create a root key from the seed
    const root = hdkey.fromMasterSeed(seed, bitcoin.networks.testnet);

    // Derive the first account from the root key
    const addrNode = root.derive(`m/44'/1'/0'/0/${used}`);
    const address = bitcoin.payments.p2pkh({
      pubkey: addrNode.publicKey,
      network: bitcoin.networks.testnet,
    }).address;
    await db.run("UPDATE wallets SET used = ? WHERE mnemonic = ?", [used, mnemonic]);
    console.log(`Unused Wallet Address: ${address}`);
  });

};

// Get Tesnet Bitcoin Balance for the address

async function getTestnetBalance(address) {
  try {
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/balance`
    );
    const balance = response.data.balance / 100000000;
    console.log(`Balance of address ${address}: ${balance} BTC`);
  } catch (err) {
    console.error(`Error retrieving balance for address ${address}:`, err);
  }
}
// Get Testnet Transaction details
async function getTestnetTransactions(address) {
  try {
    const response = await axios.get(
      `https://api.blockcypher.com/v1/btc/test3/addrs/${address}/full`
    );
    const transactions = response.data.txs.map((tx) => ({
      hash : tx.hash,
      value:
        tx.outputs.find((output) => output.addresses.includes(address)).value /
        100000000, // Convert from satoshis to BTC
      received_at: tx.received,
    }));
    console.log(`Transactions for address ${address}:`, transactions);
  } catch (err) {
    console.error(`Error retrieving transactions for address ${address}:`, err);
  }
}

// Call the functions as needed
createWallet();
importWallet(
  "film symptom famous evoke extra cereal holiday purchase duty book resemble tool"
);
listWallets();
generateUnusedadd(
  "bring coffee gun rebel diagram crumble express another slim cattle horror symbol"
);
getTestnetBalance("n2k9PRj7h1MVWS2BVXsUYsGEpTaE6v7LTi");
getTestnetTransactions("n2k9PRj7h1MVWS2BVXsUYsGEpTaE6v7LTi");