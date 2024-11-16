// CLI for interfacing with SafeHODL //

import { ethers, Wallet, Contract, ContractReceipt } from "ethers";
import figlet from "figlet";
import {Command} from "commander";
import { env } from "bun";
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';


const readlineSync = require('readline-sync');

const log = console.log;


var callerPrivateKey = "";

const program = new Command();

const contract_address_polygon_sepolia = env.CONTRACT_ADDRESS_POLYGON_SEPOLIA;
const contract_address_unichain_sepolia = env.CONTRACT_ADDRESS_UNICHAIN_SEPOLIA;
const contract_address_mantle_sepolia = env.CONTRACT_ADDRESS_MANTLE_SEPOLIA;


const contractABIpath = path.join(__dirname, 'ABIs/abi.json');
const contractABI = JSON.parse(fs.readFileSync(contractABIpath, 'utf8'));


figlet("SafeHODL", function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);

  const actionToDo = readlineSync.question(log(chalk.blue('Select action to do: (1 - Lock, 2 - Unlock)')));

  if (actionToDo == 1) {
      // Lock
      const receiverEmail = readlineSync.question(log(chalk.blue('Provide receiver email address:')));
      const password = readlineSync.question(log(chalk.blue('Provide unlocking password')));


  } else if (actionToDo == 2) {
      // Unlock
      const receiverEmail = readlineSync.question(log(chalk.blue('Provide your email address:')));
      const password = readlineSync.question(log(chalk.blue('Provide your password')));
      const receiverAddress = readlineSync.question(log(chalk.blue('Provide destination address:')));
      

  }

  const selectedChain = readlineSync.question(log(chalk.blue('Select chain: (1 - Polygon Sepolia, 2 - Unichain Sepolia, 3 - Mantle Sepolia)')));

  if (selectedChain == 1) {
    // Polygon Sepolia

    const provider = new ethers.JsonRpcProvider(env.POLYGON_SEPOLIA_RPC_URL);
    const wallet = new ethers.Wallet(callerPrivateKey as string, provider);
    const safeHODLContract = new ethers.Contract(
        contract_address_polygon_sepolia,
        contractABI,
        wallet
    );

   




}

});




