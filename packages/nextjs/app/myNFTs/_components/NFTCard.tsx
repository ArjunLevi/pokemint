import { useState,useEffect } from "react";
import { Collectible } from "./MyHoldings";
import { Address, AddressInput } from "~~/components/scaffold-eth";
import { useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import sdk from "@farcaster/frame-sdk"; // Import the SDK

export const NFTCard = ({ nft }: { nft: Collectible }) => {
  const [transferToAddress, setTransferToAddress] = useState("");
  const { writeContractAsync } = useScaffoldWriteContract({ contractName: "YourCollectible" });
  

const handleShare = async () => {
  if (!nft.image) return;

  const powerLevel = nft.attributes?.find(a => a.trait_type === "Power")?.value || "???";
  
  // Warpcast requires HTTP(S) for image previews, not ipfs://
  const imageUrl = nft.image.startsWith("ipfs://") 
    ? nft.image.replace("ipfs://", "https://ipfs.filebase.io/ipfs/")
    : nft.image;

  const shareText = `I just caught ${nft.name} (Power: ${powerLevel})! ⚡️\n\nCatch yours on PokeMint by @arjunlevi.farcaster.eth`;
  
  // IMPORTANT: Replace yourdomain.com with your actual Vercel domain
  // This URL forces Farcaster to open your Mini App instead of a browser
  const miniAppLaunchUrl = `https://warpcast.com/~/frames/launch?domain=${window.location.hostname}`;

  try {
    // This is the native way for Farcaster/Base
    await sdk.actions.composeCast({
      text: shareText,
      embeds: [imageUrl, miniAppLaunchUrl],
    });
  } catch (error) {
    // Fallback for when the SDK action fails or is used outside the container
    const fallbackUrl = `https://warpcast.com/~/compose?text=${encodeURIComponent(shareText)}&embeds[]=${encodeURIComponent(imageUrl)}&embeds[]=${encodeURIComponent(miniAppLaunchUrl)}`;
    window.open(fallbackUrl, "_blank");
  }
};

const handleTransfer = async () => {
  try {
    await writeContractAsync({
      functionName: "transferFrom",
      args: [nft.owner, transferToAddress, BigInt(nft.id.toString())],
    });
  } catch (err) {
    console.error("Transfer error", err);
  }
};

const modalId = `nft_modal_${nft.id}`;

useEffect(() => {
  const init = async () => {
    try {
      await sdk.actions.ready();
    } catch (e) {
      console.error("SDK initialization failed", e);
    }
  };
  init();
}, []);

  return (
    <>
      {/* 1. THE GRID ITEM (Only Image) */}
      <div 
        className="cursor-pointer overflow-hidden rounded-xl bg-base-300 relative group aspect-[3/4] shadow-sm"
        onClick={() => (document.getElementById(modalId) as HTMLDialogElement).showModal()}
      >
        <img 
          src={nft.image} 
          alt={nft.name} 
          className="object-cover w-full h-full" 
        />
        <div className="absolute top-1 right-1">
          <span className="badge badge-secondary badge-xs opacity-80">#{nft.id}</span>
        </div>
      </div>

     {/* 2. THE POPUP MODAL (Fixed for Mobile Scrolling) */}
<dialog id={modalId} className="modal modal-bottom sm:modal-middle">
  <div className="modal-box p-2 bg-base-200 overflow-hidden flex flex-col max-h-[90vh]">
    {/* Close Button remains fixed at the top */}
    <form method="dialog">
      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10 bg-base-300/50">✕</button>
    </form>

    {/* Scrollable Container starts here */}
    <div className="overflow-y-auto w-full">
      {/* Large Image */}
      <figure className="w-full aspect-square">
        <img src={nft.image} alt={nft.name} className="w-full h-full object-cover" />
      </figure>

      {/* Details Section */}
      <div className="p-6 space-y-4">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">{nft.name}</h2>
          <p className="text-sm opacity-70 mt-2 leading-relaxed">{nft.description}</p>
        </div>

        {/* Stats/Power Pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {nft.attributes?.map((attr, index) => (
            <span key={index} className="badge badge-outline badge-md py-3 px-4">
              {attr.value}
            </span>
          ))}
        </div>

        <div className="divider opacity-10"></div>

        {/* Ownership & Transfer Section */}
        <div className="bg-base-300 p-5 rounded-3xl space-y-4 shadow-inner">
          <div className="flex flex-col items-center gap-1 mb-2">
            <span className="text-xs uppercase font-bold opacity-50">Current Owner</span>
            <Address address={nft.owner} />
          </div>
          
          <div className="form-control">
            <label className="label pt-0">
              <span className="label-text font-bold">Transfer To</span>
            </label>
            <AddressInput
              value={transferToAddress}
              placeholder="0x..."
              onChange={setTransferToAddress}
            />
          </div>
          
          <button className="btn btn-primary btn-block shadow-lg" onClick={handleTransfer}>
            Send NFT
          </button>
        </div>

        {/* Share Button at the very bottom */}
        <button 
          onClick={handleShare} 
          className="btn btn-outline btn-block border-primary/20 hover:bg-primary/10 mb-4"
        >
          Share
        </button>
      </div>
    </div>
    {/* End Scrollable Container */}
  </div>
  <form method="dialog" className="modal-backdrop"><button>close</button></form>
</dialog>
    </>
  );
};
