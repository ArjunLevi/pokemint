"use client";

import { MyHoldings } from "./_components";
import { useEffect, useState } from "react";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RainbowKitCustomConnectButton } from "~~/components/scaffold-eth";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";
import { addToIPFS } from "~~/utils/tokenization/ipfs-fetch";
import nftsMetadata from "~~/utils/tokenization/nftsMetadata";
import { parseEther } from "viem"
import { Attribution } from "ox/erc8021";

const DATA_SUFFIX = Attribution.toDataSuffix({
  codes: ["bc_mid74fnm"],
});


const MyNFTs: NextPage = () => {
  const { address: connectedAddress, isConnected, isConnecting } = useAccount();
  const [availableIndices, setAvailableIndices] = useState<number[]>([]);
  // const [isMinting, setIsMinting] = useState(false); // 🟢 CHANGE 1: Track minting state for the overlay

  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourCollectible" });

  const { data: tokenIdCounter } = useScaffoldReadContract({
    contractName: "YourCollectible",
    functionName: "tokenIdCounter",
    watch: true,
  });

  // 🟢 CHANGE 2: Unified LocalStorage Logic
  // Combined your multiple useEffects into one clean initialization logic
  useEffect(() => {
    const savedPool = localStorage.getItem("pokemint_pool");
    if (savedPool && JSON.parse(savedPool).length > 0) {
      setAvailableIndices(JSON.parse(savedPool));
    } else {
      const newPool = Array.from({ length: nftsMetadata.length }, (_, i) => i);
      setAvailableIndices(newPool);
      localStorage.setItem("pokemint_pool", JSON.stringify(newPool));
    }
  }, []);

  const handleMintItem = async () => {
    if (tokenIdCounter === undefined || availableIndices.length === 0) return;

    // setIsMinting(true); // 🟢 CHANGE 3: Start full-screen loading
    const poolIndex = Math.floor(Math.random() * availableIndices.length);
    const nftIndex = availableIndices[poolIndex];
    const currentTokenMetaData = nftsMetadata[nftIndex];
  
    const notificationId = notification.loading("Searching in the tall grass...");

    try {
      const uploadedItem = await addToIPFS(currentTokenMetaData); 

      await writeContractAsync({
        functionName: "mintItem",
        args: [connectedAddress, uploadedItem.path],
        value: parseEther("0.000005"),
        dataSuffix: DATA_SUFFIX,
      }, {
        // 🟢 CHANGE 4: Use onBlockConfirmation to update state WITHOUT refreshing
        onBlockConfirmation: (txnReceipt) => {
          notification.remove(notificationId);
          notification.success(`Gotcha! ${currentTokenMetaData.name} caught! 🎉`);
          
          // Update the pool locally
          const updatedPool = availableIndices.filter(i => i !== nftIndex);
          setAvailableIndices(updatedPool);
          localStorage.setItem("pokemint_pool", JSON.stringify(updatedPool));
        }
      });
      
    } catch (error) {
      notification.remove(notificationId);
      notification.error("The Poké fled!");
      console.error(error);
    }
  };

  return (
    <>
      <div className="flex items-center flex-col pt-10">
        <div className="px-5">
          <h1 className="text-center mb-4">
            <span className="block text-4xl font-black italic tracking-tighter text-slate-700">
              MY <span className="text-red-500">POKÉs</span>
            </span>
          </h1>
        </div>
      </div>

      <div className="flex justify-center px-6">
        {!isConnected || isConnecting ? (
          <RainbowKitCustomConnectButton />
        ) : (
          <button 
            className="btn btn-primary w-medium max-w-xs h-10 rounded-2xl border-none shadow-lg text-lg font-black italic tracking-widest overflow-hidden"
            style={{ backgroundColor: '#ff0000' }}
            onClick={handleMintItem}
          >
            CATCH A POKÉ
          </button>
        )}
      </div>
      <MyHoldings />
    </>
  );
};

export default MyNFTs;