"use client";
import type {
  PostMethodArgs,
  MethodCallResponse,
  TransactionToSignResponse,
  Event,
} from "@curvegrid/multibaas-sdk";
import type { SendTransactionParameters } from "@wagmi/core";
import {
  Configuration,
  ContractsApi,
  EventsApi,
} from "@curvegrid/multibaas-sdk";
import { useAccount } from "wagmi";
import { useCallback, useMemo, useState } from "react";
import {
  keccak256,
  encodePacked,
  decodeAbiParameters,
  hexToNumber,
} from "viem";

function hashEmailAndPassword(email: string, password: string): string {
  // Encode the email and password using `abi.encodePacked`
  const packed = encodePacked(["string", "string"], [email, password]);

  // Compute the Keccak-256 hash of the packed data
  return keccak256(packed);
}

export type MultiBaasHook = ReturnType<typeof useMultiBaas>;

const useMultiBaas = () => {
  const mbBaseUrl = process.env.NEXT_PUBLIC_MULTIBAAS_DEPLOYMENT_URL || "";
  const mbApiKey = process.env.NEXT_PUBLIC_MULTIBAAS_DAPP_USER_API_KEY || "";
  const contractLabel = process.env.NEXT_PUBLIC_MULTIBAAS_CONTRACT_LABEL || "";
  const addressLabel = process.env.NEXT_PUBLIC_MULTIBAAS_ADDRESS_LABEL || "";

  const [recentLockBoxes, setRecentLockBoxes] = useState<ParsedEvent[]>([]);
  const [recentOpens, setRecentOpens] = useState<ParsedEvent[]>([]);

  const [lockBoxesCount, setLockBoxesCount] = useState<number>(0);
  const [opensCount, setOpensCount] = useState<number>(0);

  const [isFetching, setIsFetching] = useState<boolean>(false);

  const chain = "ethereum";

  const mbConfig = useMemo(() => {
    return new Configuration({
      basePath: new URL("/api/v0", mbBaseUrl).toString(),
      accessToken: mbApiKey,
    });
  }, [mbBaseUrl, mbApiKey]);

  // Memoize Api
  const contractsApi = useMemo(() => new ContractsApi(mbConfig), [mbConfig]);
  const eventsApi = useMemo(() => new EventsApi(mbConfig), [mbConfig]);

  const { address, isConnected } = useAccount();

  const callContractFunction = useCallback(
    async (
      methodName: string,
      args: PostMethodArgs["args"] = [],
      value: string | undefined = undefined
    ): Promise<
      MethodCallResponse["output"] | TransactionToSignResponse["tx"]
    > => {
      const payload: PostMethodArgs = {
        args,
        contractOverride: true,
        ...(isConnected && address ? { from: address } : {}),
        value,
      };

      const response = await contractsApi.callContractFunction(
        chain,
        addressLabel,
        contractLabel,
        methodName,
        payload
      );

      if (response.data.result.kind === "MethodCallResponse") {
        return response.data.result.output;
      } else if (response.data.result.kind === "TransactionToSignResponse") {
        return response.data.result.tx;
      } else {
        throw new Error(
          `Unexpected response type: ${response.data.result.kind}`
        );
      }
    },
    [contractsApi, chain, addressLabel, contractLabel, isConnected, address]
  );

  const lock = useCallback(
    async (
      email: string,
      password: string,
      amount: string
    ): Promise<SendTransactionParameters> => {
      const passwordAndEmailHash = hashEmailAndPassword(email, password);
      return await callContractFunction(
        "lock",
        [email, passwordAndEmailHash],
        amount
      );
    },
    [callContractFunction]
  );

  const unlock = useCallback(
    async (
      email: string,
      password: string,
      address: string
    ): Promise<SendTransactionParameters> => {
      return await callContractFunction("unlock", [email, password, address]);
    },
    [callContractFunction]
  );

  const getRecentLockBoxes = useCallback(async (): Promise<
    ParsedEvent[] | null
  > => {
    try {
      const eventSignature = "NewLockBox(string)";
      const response = await eventsApi.listEvents(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        chain,
        addressLabel,
        contractLabel,
        eventSignature,
        15
      );

      return response.data.result.map(parseEvent);
    } catch (err) {
      console.error("Error getting voted events:", err);
      return null;
    }
  }, [eventsApi, chain, addressLabel, contractLabel]);

  const getRecentOpens = useCallback(async (): Promise<
    ParsedEvent[] | null
  > => {
    try {
      const eventSignature = "LockBoxOpened(string)";
      const response = await eventsApi.listEvents(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        chain,
        addressLabel,
        contractLabel,
        eventSignature,
        15
      );

      return response.data.result.map(parseEvent);
    } catch (err) {
      console.error("Error getting voted events:", err);
      return null;
    }
  }, [eventsApi, chain, addressLabel, contractLabel]);

  const getAllLockBoxesCount = useCallback(async (): Promise<number | null> => {
    try {
      const eventSignature = "NewLockBox(string)";
      const response = await eventsApi.getEventCount(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        chain,
        addressLabel,
        contractLabel,
        eventSignature
      );

      return response.data.result;
    } catch (err) {
      console.error("Error getting voted events:", err);
      return null;
    }
  }, [eventsApi, chain, addressLabel, contractLabel]);

  const getAllOpensCount = useCallback(async (): Promise<number | null> => {
    try {
      const eventSignature = "LockBoxOpened(string)";
      const response = await eventsApi.getEventCount(
        undefined,
        undefined,
        undefined,
        undefined,
        undefined,
        false,
        chain,
        addressLabel,
        contractLabel,
        eventSignature
      );

      return response.data.result;
    } catch (err) {
      console.error("Error getting voted events:", err);
      return null;
    }
  }, [eventsApi, chain, addressLabel, contractLabel]);

  const fetchStats = useCallback(async () => {
    setIsFetching(true);
    try {
      const newLockBoxesCount = await getAllLockBoxesCount();
      if (newLockBoxesCount !== null) setLockBoxesCount(newLockBoxesCount);

      const newOpensCount = await getAllOpensCount();
      if (newOpensCount !== null) setOpensCount(newOpensCount);

      const newRecentLockBoxes = await getRecentLockBoxes();
      if (newOpensCount !== null) setRecentLockBoxes(newRecentLockBoxes!);

      const newRecentOpens = await getRecentOpens();
      if (newOpensCount !== null) setRecentOpens(newRecentOpens!);
    } catch (error) {
      console.error("Error fetching votes:", error);
    } finally {
      setIsFetching(false);
    }
  }, [
    getAllLockBoxesCount,
    getAllOpensCount,
    getRecentLockBoxes,
    getRecentOpens,
  ]);

  return {
    lock,
    unlock,
    getRecentLockBoxes,
    getRecentOpens,
    getAllLockBoxesCount,
    getAllOpensCount,
    fetchStats,
    recentLockBoxes,
    recentOpens,
    lockBoxesCount,
    opensCount,
    isFetching,
  };
};

export default useMultiBaas;

const parseEvent = (e: Event): ParsedEvent => {
  if (!e.event.rawFields) throw Error("Missing Raw Fields");
  const { data, transactionHash, blockNumber } = JSON.parse(
    e.event.rawFields
  ) as {
    data: `0x${string}`;
    transactionHash: `0x${string}`;
    blockNumber: `0x${string}`;
  };
  const decoded = decodeAbiParameters(
    [{ name: "address", type: "string" }],
    data
  );
  return {
    email: decoded[0],
    transactionHash,
    blockNumber: hexToNumber(blockNumber),
  };
};

export type ParsedEvent = {
  email: string;
  transactionHash: `0x${string}`;
  blockNumber: number;
};
