"use client";

import Link from "next/link";
import type { NextPage } from "next";
import { useAccount } from "wagmi";
import { RocketLaunchIcon, SparklesIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { Address } from "~~/components/scaffold-eth";

const Home: NextPage = () => {
  const { address: connectedAddress } = useAccount();

  return (
    <>
      <div className="flex items-center flex-col grow pt-10">
        {/* Hero Section */}
        <div className="flex-grow flex flex-col items-center justify-center text-center px-5 w-full max-w-4xl">
          <div className="relative">
            {/* Background Glow Effect */}
            <div className="absolute -inset-4 bg-primary/20 blur-3xl rounded-full opacity-50"></div>

            <h1 className="relative">
              <span className="block text-2xl md:text-3xl mb-2 font-medium">Welcome to</span>
              <span className="block text-6xl md:text-8xl font-black tracking-tighter text-primary">PokeMint</span>
            </h1>
          </div>

          <p className="mt-6 text-lg md:text-xl opacity-80 max-w-2xl">
            Discover, mint, and collect unique metallic desert guardians. Build your ultimate squad on the Base network.
          </p>

          <div className="mt-10 flex flex-col items-center gap-4">
            <Link
              href="/myNFTs"
              className="btn btn-primary btn-lg px-12 rounded-full text-xl shadow-xl hover:scale-105 transition-transform border-2 border-white/10"
            >
              <RocketLaunchIcon className="h-6 w-6 mr-2" />
              Catch your Poke
            </Link>

            {connectedAddress && (
              <div className="flex flex-col items-center bg-base-300/50 p-4 rounded-3xl backdrop-blur-sm border border-primary/10">
                <p className="text-xs uppercase font-bold opacity-50 mb-1">Trainer ID</p>
                <Address address={connectedAddress} />
              </div>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-10 py-20 w-full max-w-6xl">
          <div className="bg-base-200 p-8 rounded-3xl border border-primary/5 flex flex-col items-center text-center">
            <SparklesIcon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">Unique AI Art</h3>
            <p className="opacity-70">Every guardian is generated with reinforced carbon-fiber detail.</p>
          </div>

          <div className="bg-base-200 p-8 rounded-3xl border border-primary/5 flex flex-col items-center text-center">
            <TrophyIcon className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-xl font-bold">On-Chain Power</h3>
            <p className="opacity-70">Attributes are stored forever on Base, ready for future battles.</p>
          </div>

          <div className="bg-base-200 p-8 rounded-3xl border border-primary/5 flex flex-col items-center text-center">
            <div className="h-12 w-12 flex items-center justify-center bg-primary rounded-full mb-4">
              <span className="text-white font-bold">B</span>
            </div>
            <h3 className="text-xl font-bold">Base Native</h3>
            <p className="opacity-70">Lightning fast minting with near-zero gas fees.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
