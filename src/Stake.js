import { useCallback, useEffect, useState } from "react";
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
import {
  KIDS_ADDRESS,
  KIDS_IPFS_PREFIX,
  KIDS_OFFSET,
  PUPS_ADDRESS,
  PUPS_IPFS_PREFIX,
  PUPS_OFFSET,
} from "./constants";
import Moralis from "moralis";
import Detail from "./Detail";

const { REACT_APP_MORALIS_APP_ID, REACT_APP_MORALIS_SERVER_URL } = process.env;

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

const Stake = () => {
  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [kidsSmartContract, setKidsSmartContract] = useState(null);
  const [pupsSmartContract, setPupsSmartContract] = useState(null);
  const [stakingSmartContract, setStakingSmartContract] = useState(null);
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [kidsIds, setKidsIds] = useState([]);
  const [pupsIds, setPupsIds] = useState([]);
  const [collectionAddress, setCollectionAddress] = useState(null);
  const [detailId, setDetailId] = useState(-1);
  const [showDetail, setShowDetail] = useState(false);

  const getNfts = useCallback(async () => {
    const _kids =
      (await Moralis.Web3API.account.getNFTsForContract({
        address: "0x521bC9Bb5Ab741658e48eF578D291aEe05DbA358",
        token_address: "0xa5ae87B40076745895BB7387011ca8DE5fde37E0",
      })) || {};
    const _kidsIds = (_kids.result || []).map(({ token_id }) =>
      parseInt(token_id)
    );
    setKidsIds(_kidsIds);
    const _pups =
      (await Moralis.Web3API.account.getNFTsForContract({
        address: "0x521bC9Bb5Ab741658e48eF578D291aEe05DbA358",
        token_address: "0x86e9C5ad3D4b5519DA2D2C19F5c71bAa5Ef40933",
      })) || {};
    const _pupsIds = (_pups.result || []).map(({ token_id }) =>
      parseInt(token_id)
    );
    setPupsIds(_pupsIds);
  }, []);

  useEffect(() => {
    Moralis.start({
      serverUrl: REACT_APP_MORALIS_SERVER_URL,
      appId: REACT_APP_MORALIS_APP_ID,
    });
    getNfts();
  }, []);

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

  const handleManageClick = useCallback(
    ({ _collectionAddress, _detailId }) => {
      setCollectionAddress(_collectionAddress);
      setDetailId(_detailId);
      setShowDetail(true);
    },
    [setCollectionAddress, setDetailId, setShowDetail]
  );

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
      {showDetail && (
        <Detail
          detailId={detailId}
          collectionAddress={collectionAddress}
          setShowDetail={setShowDetail}
        />
      )}
      {!showDetail && (
        <>
          <TopBar />
          <Container>
            {[...kidsIds].map((id) => {
              const offsetId = (id + KIDS_OFFSET) % 10_000;
              return (
                <ItemContainer>
                  <ImageContainer>
                    <img alt="" src={`${KIDS_IPFS_PREFIX}${offsetId}.png`} />
                  </ImageContainer>
                  <Header>Kid #{offsetId}</Header>
                  <Button
                    onClick={() =>
                      handleManageClick({
                        _collectionAddress: KIDS_ADDRESS,
                        _detailId: id,
                      })
                    }
                  >
                    Manage
                  </Button>
                </ItemContainer>
              );
            })}
            {[...pupsIds].map((id) => {
              const offsetId = (id + PUPS_OFFSET) % 10_000;
              return (
                <ItemContainer>
                  <ImageContainer>
                    <img alt="" src={`${PUPS_IPFS_PREFIX}${offsetId}.png`} />
                  </ImageContainer>
                  <Header>Pup #{offsetId}</Header>
                  <Button
                    onClick={() =>
                      handleManageClick({
                        _collectionAddress: PUPS_ADDRESS,
                        _detailId: id,
                      })
                    }
                  >
                    Manage
                  </Button>
                </ItemContainer>
              );
            })}
          </Container>
        </>
      )}
    </>
  );
};

export default Stake;
