// CLI for interfacing with SafeHODL //

import { ethers, Wallet, Contract, solidityPackedKeccak256 } from "ethers";
import figlet from "figlet";
import {Command} from "commander";

import chalk from 'chalk';
import fs from 'fs';
import path from 'path';

import * as dotenv from 'dotenv'
dotenv.config()


const readlineSync = require('readline-sync');

const log = console.log;


var callerPrivateKey = process.env.PRIVKEY;

const program = new Command();

const contract_address_polygon_sepolia = process.env.CONTRACT_ADDRESS_POLYGON || "";
const contract_address_unichain_sepolia = process.env.CONTRACT_ADDRESS_UNICHAIN || "";
const contract_address_mantle_sepolia = process.env.CONTRACT_ADDRESS_MANTLE || "";

const rpc_polygon = process.env.POLYGON_RPC_URL || "";
const rpc_unichain = process.env.UNICHAIN_RPC_URL || "";
const rpc_mantle = process.env.MANTLE_RPC_URL || "";


const contractABIpath = path.join(__dirname, 'ABIs/abi.json');
const contractABI = JSON.parse(fs.readFileSync(contractABIpath, 'utf8'));


figlet("SafeHODL", async function (err, data) {
  if (err) {
    console.log("Something went wrong...");
    console.dir(err);
    return;
  }
  console.log(data);

  const actionToDo = readlineSync.question(log(chalk.blue('Select action to do: (1 - Lock, 2 - Unlock)')));

  const receiverEmail = "";
  const password = "";
  const amountToLock = "";
  const receiverAddress = "";

  const selectedChain = readlineSync.question(log(chalk.blue('Select chain: (1 - Polygon Sepolia, 2 - Mantle Sepolia, 3 - Unichain Sepolia)')));

    if (selectedChain == 1) {
        log(chalk.green('Selected Polygon Sepolia'))
        // Polygon Sepolia

        const provider = new ethers.JsonRpcProvider(rpc_polygon);
        const wallet = new ethers.Wallet(callerPrivateKey as string, provider);
        const safeHODLContract = new ethers.Contract(
            contract_address_polygon_sepolia,
            contractABI,
            wallet
        );
        
        await callContract(safeHODLContract, actionToDo);

    } else if (selectedChain == 2) {
        // Mantle Sepolia

        const provider = new ethers.JsonRpcProvider(rpc_mantle);
        const wallet = new ethers.Wallet(callerPrivateKey as string, provider);
        const safeHODLContract = new ethers.Contract(
            contract_address_mantle_sepolia,
            contractABI,
            wallet
        );

        await callContract(safeHODLContract, actionToDo);

    } else if (selectedChain == 3) {
        // Unichain Sepolia

        const provider = new ethers.JsonRpcProvider(rpc_unichain);
        const wallet = new ethers.Wallet(callerPrivateKey as string, provider);
        const safeHODLContract = new ethers.Contract(
            contract_address_unichain_sepolia,
            contractABI,
            wallet
        );

        await callContract(safeHODLContract, actionToDo);

    }

    async function callContract(safeHODLContract, actionToDo) {
        console.log(actionToDo);
        if (actionToDo == 1) {
            log(chalk.green('Selected Lock'))
        
            // Lock
            const receiverEmail = readlineSync.question(log(chalk.blue('Provide receiver email address:')));
            const password = readlineSync.question(log(chalk.blue('Provide unlocking password')));
            const amountToLock = readlineSync.question(log(chalk.blue('Provide amount to lock')));
    
            // Offline calculate the locking hash
            const lockingHash = solidityPackedKeccak256([ "string", "string" ], [ receiverEmail, password ]);
    
    
            const tx = await safeHODLContract.lock(
                receiverEmail,
                lockingHash,
                {
                  value: String(amountToLock),
                }
            );
    
            log(chalk.blue('TX sent. Hash: ' + tx.hash));
    
        } else if (actionToDo == 2) {
            // Unlock
            const receiverEmail = readlineSync.question(log(chalk.blue('Provide your email address:')));
            const password = readlineSync.question(log(chalk.blue('Provide your password')));
            const receiverAddress = readlineSync.question(log(chalk.blue('Provide destination address:')));
    
            const tx = await safeHODLContract.unlock(
                receiverEmail,
                password,
                receiverAddress
            );
    
            log(chalk.blue('TX sent. Hash: ' + tx.hash));
        }
    }

   

   

});




