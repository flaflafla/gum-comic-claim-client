import { useCallback, useState } from "react";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import TopBar from "./TopBar";
import {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
  _getCurrentBlockNumber,
  _getStakedByUser,
} from "./utils";
import { IPFS_PREFIX } from "./constants";

const ConnectButton = styled.button`
  background-color: transparent;
  border: none;
  margin: 18px auto 0 auto;
  cursor: pointer;

  :hover {
    margin-top: 17px;
    img {
      width: 122px;
    }
  }

  img {
    width: 120px;
  }
`;

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  padding-top: 80px;
`;

const ItemContainer = styled.div`
  width: 300px;
  margin: 0 30px 100px 30px;
  border-radius: 6px;
  text-align: center;
`;

const ImageContainer = styled.div`
  img {
    width: 100%;
  }
`;

const Header = styled.h2`
  font-family: "Blatant", sans-serif;
  font-size: 24px;
  margin-bottom: 18px;
  color: #666;
`;

const Button = styled.button`
  background-color: #fff;
  border: solid 3px #ff74b4;
  border-radius: 12px;
  color: #666;
  cursor: pointer;
  font-family: "Blatant", sans-serif;
  font-size: 20px;
  height: 42px;
  width: 220px;

  &:hover {
    background-color: #ff74b4;
    color: #fff;
  }
`;

const SocialIcon = styled.div``;

const Info = styled.div`
  font-family: "Blatant", sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
  color: #666;

  a {
    color: #ff74b4;
  }
`;

const DUMMY_IDS = [12, 800, 1032, 9, 4732, 123, 4322, 9092, 555];

const Stake = () => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [kidsSmartContract, setKidsSmartContract] = useState(null);
  const [pupsSmartContract, setPupsSmartContract] = useState(null);
  const [stakingSmartContract, setStakingSmartContract] = useState(null);
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);

  const connectMetaMask = useCallback(
    () =>
      _connectMetaMask({
        setAccount,
        setError,
        setKidsSmartContract,
        setPupsSmartContract,
        setStakingSmartContract,
        setContracts: true,
      }),
    [
      setAccount,
      setError,
      setKidsSmartContract,
      setPupsSmartContract,
      setStakingSmartContract,
    ]
  );

  const connectWalletConnect = useCallback(
    () =>
      _connectWalletConnect({
        setAccount,
        setError,
        setKidsSmartContract,
        setPupsSmartContract,
        setStakingSmartContract,
        setContracts: true,
      }),
    [
      setAccount,
      setError,
      setKidsSmartContract,
      setPupsSmartContract,
      setStakingSmartContract,
    ]
  );

  const connectCoinbaseWallet = useCallback(
    () =>
      _connectCoinbaseWallet({
        setAccount,
        setError,
        setKidsSmartContract,
        setPupsSmartContract,
        setStakingSmartContract,
        setContracts: true,
      }),
    [
      setAccount,
      setError,
      setKidsSmartContract,
      setPupsSmartContract,
      setStakingSmartContract,
    ]
  );

  const handleConnectButtonClick = useCallback(() => {
    setShowConnectWalletModal(true);
  }, [setShowConnectWalletModal]);

  const closeModal = useCallback(() => {
    setShowConnectWalletModal(false);
  }, [setShowConnectWalletModal]);

  return (
    <>
      {showConnectWalletModal && (
        <ConnectWalletModal
          closeModal={closeModal}
          connectMetaMask={connectMetaMask}
          connectWalletConnect={connectWalletConnect}
          connectCoinbaseWallet={connectCoinbaseWallet}
        />
      )}
      <TopBar />
      <Container>
        {DUMMY_IDS.map((id) => (
          <ItemContainer>
            <ImageContainer>
              <img alt="" src={`${IPFS_PREFIX}${id}.png`} />
            </ImageContainer>
            <Header>Kid #{id}</Header>
            <Button>Manage</Button>
          </ItemContainer>
        ))}
      </Container>
    </>
  );
};

export default Stake;
