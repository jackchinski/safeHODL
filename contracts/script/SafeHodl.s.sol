// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {SafeHodl} from "../src/SafeHodl.sol";

contract SafeHodlScript is Script {
    SafeHodl public safeHodl;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        safeHodl = new SafeHodl();

        vm.stopBroadcast();
    }
}
