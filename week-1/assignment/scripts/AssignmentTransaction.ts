import {
  SystemProgram,
  TransactionMessage,
  VersionedTransaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { payer, newWallet, connection, DESTINATION_PUBLICKEY } from "@/lib/vars";
import { explorerURL, printConsoleSeparator } from "@/lib/helpers";

(async () => {
  console.log("Payer for creating Transfer Account: ", payer.publicKey.toBase58());
  console.log("Creating Transfer Account...");

  const halfASol = LAMPORTS_PER_SOL / 2;
  const space = 0;

  const balanceForRentExemption = await connection.getMinimumBalanceForRentExemption(space);

  // Create a new account instruction
  const createNewAccountIx = SystemProgram.createAccount({
    fromPubkey: payer.publicKey,
    newAccountPubkey: newWallet.publicKey,
    lamports: balanceForRentExemption + halfASol,
    space: space,
    programId: SystemProgram.programId,
  });

  console.log("New Account created: ", newWallet.publicKey.toBase58());

  const transferAmount = LAMPORTS_PER_SOL / 10; // 0.1 SOL

  // Transfer lamports from the new account to the destination
  const transferFromNewAccountToDestinationIx = SystemProgram.transfer({
    fromPubkey: newWallet.publicKey,
    toPubkey: DESTINATION_PUBLICKEY,
    lamports: transferAmount,
  });

  const recentBlockhash = await connection.getLatestBlockhash().then(res => res.blockhash);
  const remainingBalanceNewAccount = 0.4 * LAMPORTS_PER_SOL + balanceForRentExemption;

  // Transfer remaining balance to the payer
  const closeNewAccountIx = SystemProgram.transfer({
    fromPubkey: newWallet.publicKey,
    toPubkey: payer.publicKey,
    lamports: remainingBalanceNewAccount,
  });

  // Create the transaction message
  const message = new TransactionMessage({
    payerKey: payer.publicKey,
    recentBlockhash,
    instructions: [createNewAccountIx, transferFromNewAccountToDestinationIx, closeNewAccountIx],
  }).compileToV0Message();

  // Create the transaction
  const tx = new VersionedTransaction(message);

  // Sign the transaction with both the payer and newWallet
  tx.sign([payer, newWallet]);

  // Send the transaction
  const sig = await connection.sendTransaction(tx);

  // Print the result
  printConsoleSeparator();
  console.log("Transaction Completed!");
  console.log("Transaction Signature: ", sig);
  console.log(explorerURL({ txSignature: sig }));
})();
