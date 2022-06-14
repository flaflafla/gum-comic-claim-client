import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import {
  BLOCKS_PER_DAY,
  IPFS_PREFIX,
  KIDS_ADDRESS,
  OFFSET,
  PUPS_ADDRESS,
} from "./constants";
import {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
} from "./utils";

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
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
`;

const ImageContainer = styled.div`
  padding: 60px;
  text-align: right;

  img {
    max-width: 600px;
  }
`;

const InfoContainer = styled.div`
  padding: 60px;
`;

const InnerInfoContainer = styled.div`
  margin-bottom: 60px;
`;

const Header = styled.h2`
  font-family: "Blatant", sans-serif;
  font-size: 36px;
  margin-bottom: 48px;
  margin-top: 100px;
`;

const LockIcon = styled.div``;

const StakedIcon = styled.div``;

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

const ButtonContainer = styled.div`
  margin-bottom: 12px;
`;

const SocialIcon = styled.div``;

const DepositInfoContainer = styled.div``;

const Info = styled.div`
  font-family: "Blatant", sans-serif;
  font-size: 24px;
  margin-bottom: 12px;
  color: #666;

  a {
    color: #ff74b4;
  }
`;

const Divider = styled.div`
  background-color: #ff74b4;
  height: calc(100% - 120px);
  margin-top: 60px;
`;

const Detail = ({ collectionAddress }) => {
  const { id } = useParams();

  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [kidsSmartContract, setKidsSmartContract] = useState(null);
  const [pupsSmartContract, setPupsSmartContract] = useState(null);
  const [stakingSmartContract, setStakingSmartContract] = useState(null);
  const [smartContract, setSmartContract] = useState(null);
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [ownerOf, setOwnerOf] = useState("");
  const [rewards, setRewards] = useState(0);
  const [lockBlock, setLockBlock] = useState(null);
  const [lockDuration, setLockDuration] = useState(-1);
  const [lockDurationsConfig, setLockDurationDays] = useState(null);

  useEffect(() => {
    if (collectionAddress === KIDS_ADDRESS && kidsSmartContract) {
      setSmartContract(kidsSmartContract);
    } else if (collectionAddress === PUPS_ADDRESS && pupsSmartContract) {
      setSmartContract(pupsSmartContract);
    }
  }, [
    collectionAddress,
    kidsSmartContract,
    pupsSmartContract,
    setSmartContract,
  ]);

  useEffect(() => {
    if (account && smartContract) {
      getOwnerOf(account);
    }
  }, [account, id, smartContract]);

  useEffect(() => {
    if (stakingSmartContract) {
      getRewards();
      getLockBlock();
      getLockDurationByTokenId();
    }
  }, [stakingSmartContract]);

  const getRewards = useCallback(async () => {
    let bgContract = -1;
    if (collectionAddress === KIDS_ADDRESS) {
      bgContract = 0;
    } else if (collectionAddress === PUPS_ADDRESS) {
      bgContract = 1;
    }
    if (bgContract < 0) return;
    const [rawRewards] = (await stakingSmartContract.methods
      .calculateRewards(account, [parseInt(id)], [bgContract])
      .call()) || [0];
    const _rewards = parseInt(rawRewards) / 10 ** 18;
    setRewards(_rewards);
  }, [account, id, stakingSmartContract, setRewards]);

  const getOwnerOf = useCallback(async () => {
    const _ownerOf = await smartContract.methods.ownerOf(id).call();
    setOwnerOf(_ownerOf);
  }, [account, smartContract, setOwnerOf]);

  const getLockBlock = useCallback(async () => {
    let bgContract = -1;
    if (collectionAddress === KIDS_ADDRESS) {
      bgContract = 0;
    } else if (collectionAddress === PUPS_ADDRESS) {
      bgContract = 1;
    }
    if (bgContract < 0) return;
    const _lockBlock = await stakingSmartContract.methods
      .lockBlocks(bgContract, parseInt(id))
      .call();
    setLockBlock(parseInt(_lockBlock));
  }, [account, id, stakingSmartContract, setLockBlock]);

  const getLockDurationByTokenId = useCallback(async () => {
    let bgContract = -1;
    if (collectionAddress === KIDS_ADDRESS) {
      bgContract = 0;
    } else if (collectionAddress === PUPS_ADDRESS) {
      bgContract = 1;
    }
    if (bgContract < 0) return;
    const _lockDuration = await stakingSmartContract.methods
      .lockDurationsByTokenId(bgContract, parseInt(id))
      .call();
    setLockDuration(parseInt(_lockDuration));
  }, [id, stakingSmartContract, setLockDuration]);

  const getLockDurationDays = useCallback(async () => {
    const _lockDurationDays = await stakingSmartContract.methods
      .lockDurationsConfig(lockDuration)
      .call();
    setLockDurationDays(parseInt(_lockDurationDays));
  }, [stakingSmartContract, setLockDurationDays, lockDuration]);

  useEffect(() => {
    if (lockDuration > -1) {
      getLockDurationDays();
    }
  }, [lockDuration]);

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

  // TODO
  const locked = true;
  const staked = true;

  const getLockInfo = useCallback(() => {
    if (locked) return "Locked until";
  }, [locked]);

  const getBoostInfo = useCallback(() => {
    return "Blahblahblah";
  }, []);

  let collectionName;
  if (collectionAddress === KIDS_ADDRESS) {
    collectionName = "Kid";
  } else if (collectionAddress === PUPS_ADDRESS) {
    collectionName = "Pup";
  }

  const parsedId = parseInt(id);

  if (isNaN(parsedId) || parsedId < 0 || parsedId > 9999) {
    return <div>No token with this id found</div>;
  }

  // related to reveal - see contract for context
  const offsetId = (parsedId + OFFSET) % 10_000;

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
      {!account && (
        <>
          <ConnectButton onClick={handleConnectButtonClick}>
            <img
              src={"/connect-wallet.png"}
              alt="connect button"
              id="connect-button"
            />
          </ConnectButton>
        </>
      )}
      <Container>
        <ImageContainer>
          <img src={`${IPFS_PREFIX}${offsetId}.png`} />
        </ImageContainer>
        <Divider />
        <InfoContainer>
          <Header>{`${collectionName} #${offsetId}`}</Header>
          {ownerOf && (
            <Info>
              Owned by:{" "}
              <a
                href={`https://etherscan.io/address/${ownerOf}`}
                target="_blank"
                rel="noreferrer noopener"
              >{`${ownerOf.slice(0, 6)}...${ownerOf.slice(36)}`}</a>
            </Info>
          )}
          {(staked || locked) && (
            <InnerInfoContainer>
              <DepositInfoContainer>
                {locked && <LockIcon />}
                {staked && !locked && <StakedIcon />}
                <Info>{getLockInfo()}</Info>
              </DepositInfoContainer>
              <Info>{getBoostInfo()}</Info>
              {rewards > 0 && <Info>Unclaimed rewards: {rewards} GUM</Info>}
            </InnerInfoContainer>
          )}
          <ButtonContainer>
            {rewards > 0 && <Button>Claim Balance</Button>}
          </ButtonContainer>
          <ButtonContainer>
            {locked && <Button>Extend Lock</Button>}
          </ButtonContainer>
          <ButtonContainer>
            {staked && !locked && <Button>Lock</Button>}
          </ButtonContainer>
        </InfoContainer>
      </Container>
    </>
  );
};

export default Detail;
