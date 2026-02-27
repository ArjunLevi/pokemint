import { Space_Grotesk } from "next/font/google";
import "@rainbow-me/rainbowkit/styles.css";
import { ScaffoldEthAppWithProviders } from "~~/components/ScaffoldEthAppWithProviders";
import { ThemeProvider } from "~~/components/ThemeProvider";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata = {
  ...getMetadata({
    title: "PokeMint",
    description: "Built with Base Network",
  }),
  other: {
    "base:app_id": "6981b2e51672d70694e2940b",
    // 1. Farcaster Mini App Config
    "fc:miniapp": JSON.stringify({
      version: "next",
      imageUrl: "https://pokemon-base.vercel.app/walking-character.gif",
      button: {
        title: "Poke Mint",
        action: {
          type: "launch_miniapp",
          name: "PokeMint App",
          url: "https://pokemon-base.vercel.app/",
        },
      },
    }),
    // 2. Standard Frame Tags for Base/Warpcast Preview
    "fc:frame": "vNext",
    "fc:frame:image": "https://pokemon-base.vercel.app/walking-character.gif",
    "fc:frame:image:aspect_ratio": "1:1", // Best for Pokemon cards
    "og:image": "https://pokemon-base.vercel.app/walking-character.gif",

    "talentapp:project_verification":
      "794fd39df40d422f1925286ceaae3137b503872860a205ff4083aecea16968dfaec145d9dca633830f2628eda0c2cb6991684de2d31e4a6550888391d1391454",
  },
};

const ScaffoldEthApp = ({ children }: { children: React.ReactNode }) => {
  return (
    <html suppressHydrationWarning className={`${spaceGrotesk.variable} font-space-grotesk`}>
      <body>
        <ThemeProvider enableSystem>
          <ScaffoldEthAppWithProviders>{children}</ScaffoldEthAppWithProviders>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
