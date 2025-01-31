import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import abi from "./utils/WavePortal.json";
import './App.css';

export default function App() {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalWaves, setTotalWaves] = useState(0);
  const [message, setMessage] = useState("");
  const [waves, setWaves] = useState([]);
  const contractAddress = "0x62C5CB1549df45e407a73fDAC21Dc93192375c52";
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have Metamask!");
      return
    } else {
      console.log("We have the ethereum object!")
    }

    const accounts = await ethereum.request({method: "eth_accounts"});
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found!");
    }
  }

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get Metamask!");
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts"} );
      console.log("Connected with account:", accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      console.log(error);
    }
  } 

  const wave = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Ethereum object doesn't exist.");
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getWaveCount();
        console.log("Retrieved total count:", count.toNumber());

        const waveTxn = await wavePortalContract.wave(message, { gasLimit: 300000 });
        setMessage("");
        console.log("Mining...", waveTxn.hash);

        await waveTxn.wait();
        console.log("Mined...", waveTxn.hash);

        count = await wavePortalContract.getWaveCount();
        console.log("Retrieved total count:", count.toNumber());
        getWaves();
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getWaves = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        console.log("Dude, ethereum object is missing!");
        return;
      } else {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);

        let count = await wavePortalContract.getWaveCount();
        console.log("Retrieved total count:", count.toNumber());
        setTotalWaves(count.toNumber());

        let waves = [];
        let rawWaves = await wavePortalContract.getWaves();
        rawWaves.forEach(wave => {
          waves.push({
            address: wave.waver,
            timestamp: new Date(wave.timestamp * 1000),
            message: wave.message
          });
        });
        
        setWaves(waves);
        console.log(waves);
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getWaves();
  }, []);

  useEffect(() => {
    let wavePortalContract;
    
    const onNewWave = (from, timestamp, message) => {
      console.log("NewWave received", from, timestamp, message);
      setWaves(prevState => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message: message
        },
      ])
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      wavePortalContract = new ethers.Contract(contractAddress, contractABI, signer);
      wavePortalContract.on("NewWave", onNewWave);
    }

    return () => {
      if (wavePortalContract) {
        wavePortalContract.off("NewWave", onNewWave);
      }
    }
  }, []);

  
  return (
    <div className="mainContainer">

      <div className="dataContainer">
        <div className="header">
        👋 Hey there!
        </div>

        <div className="bio">
        I am Sumit, your friendly neighborhood crypto-bro. Connect your Ethereum wallet and wave at me!
        </div>
        <input 
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button className="waveButton" onClick={wave}>
          Wave at Me
        </button>
        <div>Total waves {totalWaves}</div>

        {!currentAccount && (
          <button className="waveButton" onClick={connectWallet}>
          Connect Wallet
          </button>
        )}

        <ul>
          {waves.map((wave) => <li>{wave.address} said: {wave.message}</li>)}
        </ul>
      </div>
    </div>
  );
}
