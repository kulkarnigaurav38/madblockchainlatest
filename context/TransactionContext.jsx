import React from "react";
import { ethers } from "ethers";

import { contractABI, contractAddress } from "../utils/constants";

export const TransactionContext = React.createContext();

//const { ethereum } = window;

const createEthereumContract = () => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionsContract = new ethers.Contract(
    contractAddress,
    contractABI,
    signer
  );

  return transactionsContract;
};

export const TransactionsProvider = ({ children }) => {
  const [formData, setformData] = React.useState({
    addressTo: "",
    amount: "",
    keyword: "",
    message: "",
  });
  //const [currentAccount, setCurrentAccount] = React.useState("");
  //const [isLoading, setIsLoading] = React.useState(false);
  //const [transactionCount, setTransactionCount] = React.useState(
  //localStorage.getItem("transactionCount")
  //);
  const [transactions, setTransactions] = React.useState([]);

  const handleChange = (e, name) => {
    setformData((prevState) => ({ ...prevState, [name]: e.target.value }));
  };

  const getAllTransactions = async () => {
    try {
      if (ethereum) {
        const transactionsContract = createEthereumContract();

        const availableTransactions =
          await transactionsContract.getAllTransactions();

        const structuredTransactions = availableTransactions.map(
          (transaction) => ({
            addressTo: transaction.receiver,
            addressFrom: transaction.sender,
            timestamp: new Date(
              transaction.timestamp.toNumber() * 1000
            ).toLocaleString(),
            message: transaction.message,
            amount: parseInt(transaction.amount._hex) / 10 ** 18,
          })
        );

        console.log(structuredTransactions);

        setTransactions(structuredTransactions);
      } else {
        console.log("Ethereum is not present");
      }
    } catch (error) {
      console.log(error);
    }
  };

  //   const checkIfWalletIsConnect = async () => {
  //     try {
  //       if (!ethereum) return alert("Please install MetaMask.");

  //       const accounts = await ethereum.request({ method: "eth_accounts" });

  //       if (accounts.length) {
  //         setCurrentAccount(accounts[0]);

  //         getAllTransactions();
  //       } else {
  //         console.log("No accounts found");
  //       }
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   };

  //   const checkIfTransactionsExists = async () => {
  //     try {
  //       if (ethereum) {
  //         const transactionsContract = createEthereumContract();
  //         const currentTransactionCount =
  //           await transactionsContract.getTransactionCount();

  //         window.localStorage.setItem(
  //           "transactionCount",
  //           currentTransactionCount
  //         );
  //       }
  //     } catch (error) {
  //       console.log(error);

  //       throw new Error("No ethereum object");
  //     }
  //   };

  //   const connectWallet = async () => {
  //     try {
  //       if (!ethereum) return alert("Please install MetaMask.");

  //       const accounts = await ethereum.request({
  //         method: "eth_requestAccounts",
  //       });

  //       setCurrentAccount(accounts[0]);
  //       window.location.reload();
  //     } catch (error) {
  //       console.log(error);

  //       throw new Error("No ethereum object");
  //     }
  //   };

  const sendTransaction = async () => {
    try {
      const { addressTo, amount, message } = formData;
      const transactionsContract = createEthereumContract();
      //const parsedAmount = ethers.utils.parseEther(amount);

      // await ethereum.request({
      //   method: "eth_sendTransaction",
      //   params: [
      //     {
      //       from: currentAccount,
      //       to: addressTo,
      //       gas: "0x5208",
      //       value: parsedAmount._hex,
      //     },
      //   ],
      // });

      const transactionHash = await transactionsContract.addToBlockchain(
        addressTo,
        amount,
        message
      );

      setIsLoading(true);
      console.log(`Loading - ${transactionHash.hash}`);
      await transactionHash.wait();
      console.log(`Success - ${transactionHash.hash}`);
      setIsLoading(false);

      const transactionsCount =
        await transactionsContract.getTransactionCount();

      setTransactionCount(transactionsCount.toNumber());
      //window.location.reload();
    } catch (error) {
      console.log(error);

      throw new Error("No ethereum object");
    }
  };

  //   React.useEffect(() => {
  //     //checkIfWalletIsConnect();
  //     //checkIfTransactionsExists();
  //   }, [transactionCount]);

  return (
    <TransactionContext.Provider
      value={{
        transactionCount,
        connectWallet,
        transactions,
        currentAccount,
        isLoading,
        sendTransaction,
        handleChange,
        formData,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};
