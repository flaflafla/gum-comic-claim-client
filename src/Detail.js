import { useCallback, useEffect, useState } from "react";
import moment from "moment";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import TopBar from "./TopBar";
import {
  BLOCKS_PER_DAY,
  KIDS_ADDRESS,
  KIDS_OFFSET,
  PUPS_ADDRESS,
  PUPS_OFFSET,
  STAKING_ADDRESS,
} from "./constants";
import {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
  _getCurrentBlockNumber,
  _getStakedByUser,
} from "./utils";
import { Button } from "./styles";

const { REACT_APP_API_URL } = process.env;

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1px 1fr;
  position: relative;
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

const ExtraInfo = styled.div`
  font-family: "Blatant", sans-serif;
  padding: 12px;
  margin-bottom: 12px;
  background-color: #eee;
  border-radius: 6px;
  font-size: 18px;
  color: #666;
  max-width: 320px;
`;

const Divider = styled.div`
  background-color: #ff74b4;
  height: calc(100% - 120px);
  margin-top: 60px;
`;

const CloseButton = styled.button`
  width: 44px;
  height: 44px;
  font-size: 32px;
  border: 1px solid #666;
  border-radius: 600px;
  padding: 4px;
  background-color: transparent;
  color: #666;
  position: absolute;
  top: 30px;
  right: 80px;
  cursor: pointer;

  :hover {
    border-color: white;
    background-color: #ff74b4;
    color: white;
  }
`;

// TODO: detail isn't working when you click through from staking page
const Detail = ({
  _account,
  collectionAddress,
  detailId,
  detailKidsSmartContract,
  detailPupsSmartContract,
  detailStakingSmartContract,
  imgSrcs,
  setShowDetail,
}) => {
  const { id: _id } = useParams();
  const id = parseInt(detailId ?? _id);

  const [account, setAccount] = useState("");
  const [error, setError] = useState("");
  const [kidsSmartContract, setKidsSmartContract] = useState(null);
  const [pupsSmartContract, setPupsSmartContract] = useState(null);
  const [stakingSmartContract, setStakingSmartContract] = useState(null);
  const [smartContract, setSmartContract] = useState(null);
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [ownerOf, setOwnerOf] = useState("");
  const [rewards, setRewards] = useState(0);
  const [locked, setLocked] = useState(false);
  const [lockBlock, setLockBlock] = useState(null);
  const [lockDuration, setLockDuration] = useState(-1);
  const [lockDurationDays, setLockDurationDays] = useState(null);
  const [currentBlockNumber, setCurrentBlockNumber] = useState(null);
  const [staked, setStaked] = useState(false);
  const [stakedByUser, setStakedByUser] = useState(false);
  const [bgContract, setBgContract] = useState(-1);
  const [lockExpirationBlock, setLockExpirationBlock] = useState(null);
  const [lockExpirationDate, setLockExpirationDate] = useState(null);
  const [showLockedExplanation, setShowLockedExplanation] = useState(false);
  const [lockBoostRate, setLockBoostRate] = useState(0);
  const [imgSrc, setImgSrc] = useState("");

  const getRewards = useCallback(async () => {
    debugger;
    if (bgContract < 0) return;
    const [rawRewards] = (await stakingSmartContract.methods
      .calculateRewards(account, [id], [bgContract])
      .call()) || [0];
    const _rewards = parseInt(rawRewards) / 10 ** 18;
    setRewards(_rewards);
  }, [account, bgContract, id, stakingSmartContract, setRewards]);

  const getStakedByUser = useCallback(async () => {
    if (bgContract < 0) return;
    const _stakedByUser = await _getStakedByUser({
      account,
      bgContract,
      tokenId: id,
      stakingSmartContract,
    });
    return _stakedByUser;
  }, [account, bgContract, id, stakingSmartContract]);

  const getOwnerOf = useCallback(async () => {
    const _ownerOf = await smartContract.methods.ownerOf(id).call();
    if (_ownerOf === STAKING_ADDRESS) {
      setStaked(true);
      const _stakedByUser = await getStakedByUser();
      setStakedByUser(_stakedByUser);
    } else {
      setOwnerOf(_ownerOf);
    }
  }, [
    id,
    smartContract,
    setOwnerOf,
    setStaked,
    getStakedByUser,
    setStakedByUser,
  ]);

  const getLockBlock = useCallback(async () => {
    if (bgContract < 0) return;
    const _lockBlock = await stakingSmartContract.methods
      .lockBlocks(bgContract, id)
      .call();
    setLockBlock(parseInt(_lockBlock));
  }, [bgContract, id, stakingSmartContract, setLockBlock]);

  const getLockDurationByTokenId = useCallback(async () => {
    if (bgContract < 0) return;
    const _lockDuration = await stakingSmartContract.methods
      .lockDurationsByTokenId(bgContract, id)
      .call();
    setLockDuration(parseInt(_lockDuration));
  }, [id, bgContract, stakingSmartContract, setLockDuration]);

  const getLockDurationDays = useCallback(async () => {
    const _lockDurationDays = await stakingSmartContract.methods
      .lockDurationsConfig(lockDuration)
      .call();
    setLockDurationDays(parseInt(_lockDurationDays));
  }, [stakingSmartContract, setLockDurationDays, lockDuration]);

  const getLockBoostRate = useCallback(async () => {
    const _lockBoostRate = await stakingSmartContract.methods
      .lockBoostRates(lockDuration)
      .call();
    setLockBoostRate(parseInt(_lockBoostRate));
  }, [stakingSmartContract, setLockBoostRate, lockDuration]);

  const getCurrentBlockNumber = useCallback(async () => {
    const _currentBlockNumber = await _getCurrentBlockNumber({});
    setCurrentBlockNumber(_currentBlockNumber);
  }, [setCurrentBlockNumber]);

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

  const getImage = useCallback(() => {
    let collection = "";
    if (collectionAddress === KIDS_ADDRESS) {
      collection = "bgk";
    } else if (collectionAddress === PUPS_ADDRESS) {
      collection = "bgp";
    }
    const offset = collection === "bgk" ? KIDS_OFFSET : PUPS_OFFSET;
    const offsetId = (id + offset) % 10_000;
    const _src = imgSrcs?.[collection]?.[offsetId];
    if (_src) {
      setImgSrc(_src);
      return;
    }
    fetch(`${REACT_APP_API_URL}/images/${collection}/${offsetId}`)
      .then((res) => res.json())
      .then(({ data = {} }) => {
        const { src } = data;
        setImgSrc(src);
      })
      .catch(console.error);
  }, [collectionAddress, id, imgSrcs, setImgSrc]);

  useEffect(() => {
    if (!detailKidsSmartContract) return;
    setKidsSmartContract(detailKidsSmartContract);
  }, [detailKidsSmartContract, setKidsSmartContract]);

  useEffect(() => {
    if (!detailPupsSmartContract) return;
    setPupsSmartContract(detailPupsSmartContract);
  }, [detailPupsSmartContract, setPupsSmartContract]);

  useEffect(() => {
    if (!detailStakingSmartContract) return;
    setStakingSmartContract(detailStakingSmartContract);
  }, [detailStakingSmartContract, setStakingSmartContract]);

  useEffect(() => {
    if (!_account) return;
    setAccount(_account);
  }, [_account, setAccount]);

  useEffect(() => {
    if (id > -1 && collectionAddress) {
      getImage();
    }
  }, [collectionAddress, id]);

  useEffect(() => {
    let _bgContract = -1;
    if (collectionAddress === KIDS_ADDRESS) {
      if (kidsSmartContract) {
        setSmartContract(kidsSmartContract);
      }
      _bgContract = 0;
    } else if (collectionAddress === PUPS_ADDRESS) {
      _bgContract = 1;
      if (pupsSmartContract) {
        setSmartContract(pupsSmartContract);
      }
    }
    setBgContract(_bgContract);
  }, [
    collectionAddress,
    setBgContract,
    kidsSmartContract,
    pupsSmartContract,
    setSmartContract,
  ]);

  useEffect(() => {
    if (account && smartContract) {
      getOwnerOf(account);
    }
  }, [account, getOwnerOf, smartContract]);

  useEffect(() => {
    if (stakingSmartContract) {
      getRewards();
      getLockBlock();
      getLockDurationByTokenId();
    }
  }, [
    getRewards,
    getLockBlock,
    getLockDurationByTokenId,
    stakingSmartContract,
  ]);

  useEffect(() => {
    if (lockDuration > -1) {
      getLockDurationDays();
      getCurrentBlockNumber();
      getLockBoostRate();
    }
  }, [
    getLockDurationDays,
    getCurrentBlockNumber,
    getLockBoostRate,
    lockDuration,
  ]);

  useEffect(() => {
    if (lockBlock && lockDurationDays > 0 && currentBlockNumber) {
      const lockDurationBlocks = lockDurationDays * BLOCKS_PER_DAY;
      const _lockExpirationBlock = lockBlock + lockDurationBlocks;
      const blocksUntilExpiration = _lockExpirationBlock - currentBlockNumber;
      const _locked = blocksUntilExpiration > 0;
      setLocked(_locked);
      if (_locked) {
        setLockExpirationBlock(_lockExpirationBlock);
        const _lockExpirationDate = moment()
          .add(`${Math.ceil(blocksUntilExpiration / 6000)} days`)
          .format("MMM DD, YYYY");
        setLockExpirationDate(_lockExpirationDate);
      }
    }
  }, [currentBlockNumber, lockDurationDays, lockBlock, setLocked]);

  let collectionName;
  if (collectionAddress === KIDS_ADDRESS) {
    collectionName = "Kid";
  } else if (collectionAddress === PUPS_ADDRESS) {
    collectionName = "Pup";
  }

  const parsedId = id;

  if (isNaN(parsedId) || parsedId < 0 || parsedId > 9999) {
    return <div>No token with this id found</div>;
  }

  // related to reveal - see contract for context
  const offsetId =
    (parsedId +
      (collectionAddress === KIDS_ADDRESS ? KIDS_OFFSET : PUPS_OFFSET)) %
    10_000;

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
        {detailId > -1 && (
          <CloseButton onClick={() => setShowDetail(false)}>×</CloseButton>
        )}
        <ImageContainer>
          {imgSrc && <img alt={`${collectionName} ${id}`} src={imgSrc} />}
        </ImageContainer>
        <Divider />
        <InfoContainer>
          <Header>{`${collectionName} #${offsetId}`}</Header>
          {!account && (
            <div>
              <InnerInfoContainer>
                <Info>Connect your wallet to see more details!</Info>
              </InnerInfoContainer>
              <ButtonContainer>
                <Button onClick={handleConnectButtonClick} id="connect-button">
                  Connect
                </Button>
              </ButtonContainer>
            </div>
          )}
          {ownerOf && (
            <Info>
              Owned by:{" "}
              <a
                href={`https://etherscan.io/address/${ownerOf}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {ownerOf === account
                  ? "You"
                  : `${ownerOf.slice(0, 6)}...${ownerOf.slice(36)}`}
              </a>
            </Info>
          )}
          {staked && (
            <InnerInfoContainer>
              <DepositInfoContainer>
                {locked && <LockIcon />}
                {/* TODO: staked icon */}
                {!locked && <Info>Staked</Info>}
                {locked && (
                  <>
                    <Info>
                      Locked until {lockExpirationDate}{" "}
                      <img
                        onClick={() =>
                          setShowLockedExplanation(!showLockedExplanation)
                        }
                        src="/infoIcon.svg"
                        alt="info"
                        style={{ cursor: "pointer", verticalAlign: "top" }}
                      />
                    </Info>
                    {showLockedExplanation && (
                      <ExtraInfo>
                        This date is an estimate. The lock will expire at block{" "}
                        {lockExpirationBlock}.
                      </ExtraInfo>
                    )}
                  </>
                )}
              </DepositInfoContainer>
              {locked && lockBoostRate > 0 && (
                <Info>Rewards boost: {lockBoostRate / 100}x</Info>
              )}
              {rewards > 0 && <Info>Unclaimed rewards: {rewards} GUM</Info>}
            </InnerInfoContainer>
          )}
          <ButtonContainer>
            {rewards > 0 && <Button>Claim Balance</Button>}
          </ButtonContainer>
          <ButtonContainer>
            {stakedByUser && locked && <Button>Extend Lock</Button>}
          </ButtonContainer>
          <ButtonContainer>
            {stakedByUser && !locked && <Button>Lock</Button>}
          </ButtonContainer>
          <ButtonContainer>
            {stakedByUser && !locked && <Button>Unstake</Button>}
          </ButtonContainer>
        </InfoContainer>
      </Container>
    </>
  );
};

export default Detail;
