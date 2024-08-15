import dotenv from "dotenv";
import { Connection, clusterApiUrl } from "@solana/web3.js";
import { loadKeypairFromFile, loadOrGenerateKeypair } from "./helpers";
import { PublicKey } from "@metaplex-foundation/js";

// load the env variables from file
dotenv.config();
dotenv.config({ path: ".env.local" });
console.log("Payer Address: ", process.env.LOCAL_PAYER_JSON_ABSPATH);

/**
 * Load the `payer` keypair from the local file system, or load/generate a new
 * one and storing it within the local directory
 */
export const payer = process.env?.LOCAL_PAYER_JSON_ABSPATH
  ? loadKeypairFromFile(process.env?.LOCAL_PAYER_JSON_ABSPATH)
  : loadOrGenerateKeypair("payer");

// generate a new Keypair for testing, named `wallet`
export const newWallet = loadOrGenerateKeypair("NewWallet");

// load the env variables and store the cluster RPC url
export const CLUSTER_URL = process.env.RPC_URL ?? clusterApiUrl("devnet");

// create a new rpc connection
export const connection = new Connection(CLUSTER_URL, "single");

// define an address to also transfer lamports too
export const DESTINATION_PUBLICKEY = new PublicKey("63EEC9FfGyksm7PkVC6z8uAmqozbQcTzbkWJNsgqjkFs");
