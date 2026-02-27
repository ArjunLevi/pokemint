import { connectorsForWallets, Wallet } from "@rainbow-me/rainbowkit";
import {
  coinbaseWallet,
  ledgerWallet,
  metaMaskWallet,
  rainbowWallet,
  safeWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";
// import { rainbowkitBurnerWallet } from "burner-connector";
// import * as chains from "viem/chains";
import scaffoldConfig from "~~/scaffold.config";

const { onlyLocalBurnerWallet, targetNetworks } = scaffoldConfig;

/**
 * Custom wrapper for Farcaster Mini App to satisfy RainbowKit types
 */

const farcasterWallet = (): Wallet => ({
  id: "farcaster",
  name: "Farcaster Wallet",
  iconUrl: "https://raw.githubusercontent.com/farcasterxyz/protocol/main/docs/logo.png",
  iconBackground: "#fff",
  // The (details) => ... structure is required for RainbowKit v2 compatibility
  createConnector: (details) => farcasterMiniApp(), 
});


export const wagmiConnectors = () => {
  if (typeof window === "undefined") return [];

  // 1. Define the Farcaster Wallet for RainbowKit
  const supportedWallets = [
  farcasterWallet,
  metaMaskWallet,
  walletConnectWallet,
  ledgerWallet,
  coinbaseWallet,
  rainbowWallet,
  safeWallet,
  ];

  return connectorsForWallets(
    [
      {
        groupName: "Farcaster",
        wallets: [farcasterWallet], // Pass the function
      },
      {
        groupName: "Others",
        wallets: supportedWallets,
      },
    ],
    {
      appName: "PokeMint",
      projectId: scaffoldConfig.walletConnectProjectId,
    }
  );
};