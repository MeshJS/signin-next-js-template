import Head from "next/head";
import { CardanoWallet, MeshBadge, useWallet } from "@meshsdk/react";
import { backendGetNonce, backendVerifySignature } from "../backend";
import { useState } from "react";

export default function Home() {
  const { wallet, connected } = useWallet();
  const [state, setState] = useState(0);

  async function frontendStartLoginProcess() {
    if (connected) {
      setState(1);
      const userAddress = (await wallet.getRewardAddresses())[0];
      const res = await backendGetNonce(userAddress);
      await frontendSignMessage(res.nonce);
    }
  }

  async function frontendSignMessage(nonce) {
    try {
      const userAddress = (await wallet.getRewardAddresses())[0];
      const signature = await wallet.signData(userAddress, nonce);
      const res = await backendVerifySignature(nonce, userAddress, signature);
      if (res.result === true) {
        setState(2);
      } else {
        setState(3);
      }
    } catch (error) {
      setState(0);
    }
  }

  return (
    <div className="container">
      <Head>
        <title>Mesh App on Cardano</title>
        <meta name="description" content="A Cardano dApp powered my Mesh" />
        <link rel="icon" href="https://meshjs.dev/favicon/favicon-32x32.png" />
        <link
          href="https://meshjs.dev/css/template.css"
          rel="stylesheet"
          key="mesh-demo"
        />
      </Head>

      <main className="main">
        <h1 className="title">
          <a href="https://meshjs.dev/">Mesh</a> Sign in with Wallet
        </h1>

        <div className="demo">
          {state == 0 && (
            <CardanoWallet
              label="Sign In"
              onConnected={() => frontendStartLoginProcess()}
            />
          )}
          {state == 1 && <div>Signing in...</div>}
          {state == 2 && (
            <div style={{ color: "#3D9970" }}>Signed in successful</div>
          )}
          {state == 3 && (
            <div style={{ color: "#FF4136" }}>Signed in failed</div>
          )}
        </div>

        <div className="grid">
          <a href="https://meshjs.dev/apis" className="card">
            <h2>Documentation</h2>
            <p>
              Our documentation provide live demos and code samples; great
              educational tool for learning how Cardano works.
            </p>
          </a>

          <a
            href="https://meshjs.dev/guides/prove-wallet-ownership"
            className="card"
          >
            <h2>Prove ownership guide</h2>
            <p>
              Learn more about cryptographically prove the ownership of a wallet
              by signing a piece of data using data sign.
            </p>
          </a>

          <a href="https://meshjs.dev/react" className="card">
            <h2>React components</h2>
            <p>
              Useful React UI components and hooks, seamlessly integrate them
              into your app, and bring the user interface to life.
            </p>
          </a>
        </div>
      </main>

      <footer className="footer">
        <MeshBadge dark={true} />
      </footer>
    </div>
  );
}
