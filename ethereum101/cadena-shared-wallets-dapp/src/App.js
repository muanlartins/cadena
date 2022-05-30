import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contracts/SharedWallet.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [customerAddress, setCustomerAddress] = useState(null);
  const [currentBalance, setCurrentBalance] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [inputValue, setInputValue] = useState({ withdraw: "", deposit: "", message: ""});

  const contractAddress = '0xd11A60B57ebA495A5a639514eAe368ba98d90277';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setCustomerAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use our bank.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }

  const getBalance = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const sharedWalletContract = new ethers.Contract(contractAddress, contractABI, signer);

        let balance = await sharedWalletContract.balance();
        balance = balance/(10**18);
        setCurrentBalance(balance.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getMessage = async () => {
    try {
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const sharedWalletContract = new ethers.Contract(contractAddress, contractABI, signer);

        let message = await sharedWalletContract.message();
        message = utils.parseBytes32String(message);
        setMessage(message.toString());
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const setMessageHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {

        //read data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const sharedWalletContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await sharedWalletContract.setMessage(utils.formatBytes32String(inputValue.message));
        await txn.wait();

        getMessage();
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const depositHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        //write data
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const sharedWalletContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await sharedWalletContract.deposit({ value: ethers.utils.parseEther(inputValue.deposit) });
        await txn.wait();

        getBalance();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const withdrawHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const sharedWalletContract = new ethers.Contract(contractAddress, contractABI, signer);

        let myAddress = await signer.getAddress()

        const txn = await sharedWalletContract.withdraw(myAddress, ethers.utils.parseEther(inputValue.withdraw));
        await txn.wait();

        getBalance();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getBalance();
    getMessage();
  });

  return (
    <main>
      <h1>Shared Wallet</h1>
      <h2>Balance: {currentBalance}</h2>
      <form>
        <input
          type="text"
          onChange={handleInputChange}
          name="deposit"
          placeholder="0.0000 ETH"
          value={inputValue.deposit}
        />
        <button
          onClick={depositHandler}>Deposit Money In ETH</button>
      </form>
      <form>
        <input
          type="text"
          onChange={handleInputChange}
          name="withdraw"
          placeholder="0.0000 ETH"
          value={inputValue.withdraw}
        />
        <button
          onClick={withdrawHandler}>
          Withdraw Money In ETH
        </button>
      </form>
      <form>
        <input
          type="text"
          onChange={handleInputChange}
          name="message"
          value={inputValue.message}
        />
        <button
          onClick={setMessageHandler}>
          Send Message
        </button>
      </form>
      <h3>{message}</h3>
    </main>
  );
}
export default App;
