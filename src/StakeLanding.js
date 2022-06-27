import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
} from "./utils";
import { Button } from "./styles";

const Container = styled.div`
  padding: 42px;
  text-align: center;
`;

const Heading = styled.h1`
  font-family: "Showcard", sans-serif;
  font-size: 42px;
  text-align: center;
  margin: 0;
  line-height: 115%;

  @media only screen and (max-width: 600px) {
    font-size: 32px;
  }
`;

const Card = styled.div`
  margin: 42px auto;
  border: solid 3px #666;
  border-radius: 6px;
  width: 800px;
  padding: 20px 18px 42px;

  @media only screen and (max-width: 950px) {
    width: calc(100% - 32px);
  }
`;

const TopCard = styled.div`
  margin-bottom: 48px;
`;

const BottomCard = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 28px;
  position: relative;

  @media only screen and (max-width: 600px) {
    display: inherit;
  }
`;

const ConnectMessage = styled.div`
  color: #666;
  font-family: "Blatant", sans-serif;
  font-size: 28px;
  margin-bottom: 18px;

  @media only screen and (max-width: 950px) {
    font-size: 22px;
  }
`;

const SubHeading = styled.h2`
  font-family: "Showcard", sans-serif;
  font-size: 32px;
  text-align: center;
  margin: 0 0 32px;
  line-height: 115%;
  width: 100%;
  background-color: #ff74b4;
  color: #fff;
  padding: 8px 0 4px;

  @media only screen and (max-width: 600px) {
    font-size: 24px;
  }
`;

const BottomCardSection = styled.div`
  width: calc(50% - 20px);

  img {
    width: 100%;
    margin-bottom: 20px;
  }

  @media only screen and (max-width: 600px) {
    width: 100%;
    margin-bottom: 36px;
  }
`;

const StakeLanding = ({
  setAccount,
  setError,
  setKidsSmartContract,
  setPupsSmartContract,
  setStakingSmartContract,
}) => {
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);

  const closeModal = useCallback(() => {
    setShowConnectWalletModal(false);
  }, [setShowConnectWalletModal]);

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
      <Container>
        <Heading>Bubblegum Kids &amp;</Heading>
        <Heading>Bubblegum Puppies</Heading>
        <Card>
          <TopCard>
            <SubHeading>Stake</SubHeading>
            <ConnectMessage>
              Connect your wallet to stake Kids or Pups!
            </ConnectMessage>
            <Button
              onClick={handleConnectButtonClick}
              id="connect-button"
              width="300px"
            >
              Connect
            </Button>
          </TopCard>
          <SubHeading>Purchase</SubHeading>
          <BottomCard>
            <BottomCardSection>
              <img src="/bgk-example.png" alt="bubblegum kid" />
              <a
                href="https://market.bubblegumkids.com/collections/0xa5ae87b40076745895bb7387011ca8de5fde37e0"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button marginBottom="12px" width="100%">
                  Marketplace
                </Button>
              </a>
              <a
                href="https://opensea.io/collection/bubblegumkids"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button width="100%">OpenSea</Button>
              </a>
            </BottomCardSection>
            <BottomCardSection>
              <img src="/bgp-example.png" alt="bubblegum puppy" />
              <a
                href="https://market.bubblegumkids.com/collections/0x86e9c5ad3d4b5519da2d2c19f5c71baa5ef40933"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button marginBottom="12px" width="100%">
                  Marketplace
                </Button>
              </a>
              <a
                href="https://opensea.io/collection/bubblegumpuppies"
                target="_blank"
                rel="noreferrer noopener"
              >
                <Button width="100%">OpenSea</Button>
              </a>
            </BottomCardSection>
          </BottomCard>
        </Card>
      </Container>
    </>
  );
};

export default StakeLanding;
