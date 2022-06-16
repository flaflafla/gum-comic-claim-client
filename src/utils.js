import Web3 from "web3";
import Web3EthContract from "web3-eth-contract";
import Web3Utils from "web3-utils";
import WalletConnectProvider from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import orderBy from "lodash.orderby";
import { KIDS_ADDRESS, PUPS_ADDRESS, STAKING_ADDRESS } from "./constants";
import kidsAbi from "./abis/kidsAbi.json";
import pupsAbi from "./abis/pupsAbi.json";
import stakingAbi from "./abis/stakingAbi.json";

const _connectMetaMask = async ({
  setAccount,
  setError,
  setKidsSmartContract,
  setPupsSmartContract,
  setStakingSmartContract,
  setContracts = false,
}) => {
  const { ethereum } = window || {};
  if (!ethereum) {
    console.error("Ethereum is not defined.");
    setError("Sorry, something went wrong. Please check your wallet.");
  }
  const metamaskIsInstalled = ethereum.isMetaMask;
  if (metamaskIsInstalled) {
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      ethereum.on("accountsChanged", (accounts) => {
        setAccount(accounts[0]);
      });
      // TODO - un-hardcode
      // setAccount(accounts[0]);
      setAccount("0x94dba0ef8c389932a8f443aa117822ae6c20efc3");
      if (setContracts) {
        Web3EthContract.setProvider(ethereum);
        const KidsSmartContract = new Web3EthContract(kidsAbi, KIDS_ADDRESS);
        const PupsSmartContract = new Web3EthContract(pupsAbi, PUPS_ADDRESS);
        const StakingSmartContract = new Web3EthContract(
          stakingAbi,
          STAKING_ADDRESS
        );
        setKidsSmartContract(KidsSmartContract);
        setPupsSmartContract(PupsSmartContract);
        setStakingSmartContract(StakingSmartContract);
      }
    } catch (err) {
      console.error(err);
      setError("Sorry, something went wrong. Please check your wallet.");
    }
  } else {
    setError("Please install MetaMask.");
  }
};

// TODO: deal with the smart contracts
const _connectWalletConnect = async ({
  setAccount,
  setError,
  setKidsSmartContract,
  setPupsSmartContract,
  setStakingSmartContract,
  setContracts = false,
}) => {
  const { REACT_APP_INFURA_ID: infuraId } = process.env;
  let provider;
  try {
    provider = new WalletConnectProvider({ infuraId });
    await provider.enable();
  } catch (err) {
    console.error(err);
    setError("Sorry, something went wrong.");
  }
  provider.on("accountsChanged", (accounts) => {
    setError("");
    setAccount(accounts[0]);
  });
  const web3 = new Web3(provider);
  try {
    const accounts = await web3.eth.getAccounts();
    setAccount(accounts[0]);
  } catch (err) {
    console.error(err);
    setError("Sorry, something went wrong. Please check your wallet.");
  }
};

// TODO: deal with the smart contracts
const _connectCoinbaseWallet = async ({
  setAccount,
  setError,
  setKidsSmartContract,
  setPupsSmartContract,
  setStakingSmartContract,
  setContracts = false,
}) => {
  const { REACT_APP_INFURA_ID } = process.env;
  const coinbaseWallet = new CoinbaseWalletSDK({
    appName: "Bubblegum Kids Comic",
    appLogoUrl: "/bgk-logo.png",
    darkMode: false,
  });
  const ethereum = coinbaseWallet.makeWeb3Provider(
    `https://mainnet.infura.io/v3/${REACT_APP_INFURA_ID}`,
    1
  );
  try {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAccount(accounts[0]);
  } catch (err) {
    console.error(err);
    setError("Sorry, something went wrong. Please check your wallet.");
  }
};

const _getCurrentBlockNumber = async ({ web3 }) => {
  const { ethereum } = window || {};
  let _currentBlock;
  if (ethereum) {
    _currentBlock = await ethereum.request({
      method: "eth_blockNumber",
    });
  } else if (web3) {
    _currentBlock = await web3.eth.getBlockNumber();
  }
  if (!_currentBlock) return null;
  return Web3Utils.hexToNumber(_currentBlock);
};

const checkForContractAndTokenIdMatch = ({
  bgContract,
  bgContracts,
  tokenId,
  tokenIds,
}) => {
  return (
    bgContracts.map((c) => parseInt(c)).includes(parseInt(bgContract)) &&
    tokenIds.map((t) => parseInt(t)).includes(parseInt(tokenId))
  );
};

const _getStakedByUser = async ({
  account,
  bgContract,
  tokenId,
  stakingSmartContract,
}) => {
  const options = {
    fromBlock: 0,
    toBlock: "latest",
    filter: {
      from: account,
    },
  };
  const userDespositEvents = await stakingSmartContract.getPastEvents(
    "Deposited",
    options
  );
  const userDepositAndLockEvents = await stakingSmartContract.getPastEvents(
    "DepositedAndLocked",
    options
  );
  const userWithdrawEvents = await stakingSmartContract.getPastEvents(
    "Withdrawn",
    options
  );
  const hasDeposited =
    userDespositEvents.length || userDepositAndLockEvents.length;
  if (!hasDeposited) return false;
  const _depositBlocks = [];
  for (const event of [...userDespositEvents, ...userDepositAndLockEvents]) {
    const { blockNumber, returnValues = {} } = event;
    const { bgContracts = [], tokenIds = [] } = returnValues;
    if (
      checkForContractAndTokenIdMatch({
        bgContract,
        bgContracts,
        tokenId,
        tokenIds,
      })
    ) {
      _depositBlocks.push(blockNumber);
    }
  }
  if (_depositBlocks.length === 0) return false;
  if (userWithdrawEvents.length === 0) return true;
  const depositBlocks = orderBy(_depositBlocks, [], ["desc"]);
  const _withdrawBlocks = [];
  for (const event of userWithdrawEvents) {
    const { blockNumber, returnValues = {} } = event;
    const { bgContracts = [], tokenIds = [] } = returnValues;
    if (
      checkForContractAndTokenIdMatch({
        bgContract,
        bgContracts,
        tokenId,
        tokenIds,
      })
    ) {
      _withdrawBlocks.push(blockNumber);
    }
  }
  if (_withdrawBlocks.length === 0) return true;
  const withdrawBlocks = orderBy(_withdrawBlocks, [], ["desc"]);
  if (withdrawBlocks[0] > depositBlocks[0]) return false;
  return true;
};

export {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
  _getCurrentBlockNumber,
  _getStakedByUser,
};
