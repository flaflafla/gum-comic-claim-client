import { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
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
  KIDS_OFFSET,
  PUPS_ADDRESS,
  PUPS_OFFSET,
} from "./constants";
import Moralis from "moralis";
import Detail from "./Detail";
import StakeLanding from "./StakeLanding";
import { Button } from "./styles";

const {
  REACT_APP_API_URL,
  REACT_APP_MORALIS_APP_ID,
  REACT_APP_MORALIS_SERVER_URL,
} = process.env;

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
  const [kidsIds, setKidsIds] = useState([]);
  const [pupsIds, setPupsIds] = useState([]);
  const [collectionAddress, setCollectionAddress] = useState(null);
  const [detailId, setDetailId] = useState(-1);
  const [showDetail, setShowDetail] = useState(false);
  const [imgSrcs, setImgSrcs] = useState({});
  const [loading, setLoading] = useState(true);

  const getNfts = useCallback(async () => {
    // const _kids =
    //   (await Moralis.Web3API.account.getNFTsForContract({
    //     address: "0x521bC9Bb5Ab741658e48eF578D291aEe05DbA358",
    //     token_address: "0xa5ae87B40076745895BB7387011ca8DE5fde37E0",
    //   })) || {};
    // const _kidsIds = (_kids.result || []).map(({ token_id }) =>
    //   parseInt(token_id)
    // );
    // setKidsIds(_kidsIds);
    // const _pups =
    //   (await Moralis.Web3API.account.getNFTsForContract({
    //     address: "0x521bC9Bb5Ab741658e48eF578D291aEe05DbA358",
    //     token_address: "0x86e9C5ad3D4b5519DA2D2C19F5c71bAa5Ef40933",
    //   })) || {};
    // const _pupsIds = (_pups.result || []).map(({ token_id }) =>
    //   parseInt(token_id)
    // );
    // setPupsIds(_pupsIds);
    setKidsIds([0, 1]);
    // setPupsIds([0, 1]);
  }, []);

  const getImages = useCallback(() => {
    const _imgSrcs = {
      bgk: {},
      bgp: {},
    };
    const kidsIdsWithCollection = kidsIds.map((id) => ({
      id,
      collection: "bgk",
    }));
    const pupsIdsWithCollection = pupsIds.map((id) => ({
      id,
      collection: "bgp",
    }));
    Promise.all(
      [...kidsIdsWithCollection, ...pupsIdsWithCollection].map(
        ({ id, collection }) => {
          const offset = collection === "bgk" ? KIDS_OFFSET : PUPS_OFFSET;
          const offsetId = (id + offset) % 10_000;
          return fetch(`${REACT_APP_API_URL}/images/${collection}/${offsetId}`)
            .then((res) => res.json())
            .then((data) => data);
        }
      )
    )
      .then((data) => {
        for (const item of data) {
          const { src, collection, id } = item.data || {};
          _imgSrcs[collection][id] = src;
        }
        setImgSrcs(_imgSrcs);
        setLoading(false);
      })
      .catch(console.error);
  }, [kidsIds, pupsIds, setImgSrcs]);

  useEffect(() => {
    if (!kidsIds.length && !pupsIds.length) return;
    getImages();
  }, [kidsIds, pupsIds, getImages]);

  useEffect(() => {
    Moralis.start({
      serverUrl: REACT_APP_MORALIS_SERVER_URL,
      appId: REACT_APP_MORALIS_APP_ID,
    });
    getNfts();
  }, []);

  const handleManageClick = useCallback(
    ({ _collectionAddress, _detailId }) => {
      setCollectionAddress(_collectionAddress);
      setDetailId(_detailId);
      setShowDetail(true);
    },
    [setCollectionAddress, setDetailId, setShowDetail]
  );

  const kidsIdsWithCollection = kidsIds.map((id) => ({
    id,
    collection: "bgk",
  }));

  const pupsIdsWithCollection = pupsIds.map((id) => ({
    id,
    collection: "bgp",
  }));

  if (!account) {
    return (
      <StakeLanding
        setAccount={setAccount}
        setError={setError}
        setKidsSmartContract={setKidsSmartContract}
        setPupsSmartContract={setPupsSmartContract}
        setStakingSmartContract={setStakingSmartContract}
      />
    );
  }

  if (loading) {
    return (
      <div style={{ paddingTop: "68px", textAlign: "center" }}>
        <img src="/loading.gif" alt="loading" />
      </div>
    );
  }

  return (
    <>
      {showDetail && (
        <Detail
          _account={account}
          detailId={detailId}
          detailKidsSmartContract={kidsSmartContract}
          detailPupsSmartContract={pupsSmartContract}
          detailStakingSmartContract={stakingSmartContract}
          collectionAddress={collectionAddress}
          setShowDetail={setShowDetail}
          imgSrcs={imgSrcs}
        />
      )}
      <div style={{ display: showDetail ? "none" : "inherit" }}>
        <TopBar />
        <Container>
          {[...kidsIdsWithCollection, ...pupsIdsWithCollection].map(
            ({ id, collection }) => {
              const offset = collection === "bgk" ? KIDS_OFFSET : PUPS_OFFSET;
              const offsetId = (id + offset) % 10_000;
              const header = `${
                collection === "bgk" ? "Kid " : "Pup "
              }#${offsetId}`;
              const _collectionAddress =
                collection === "bgk" ? KIDS_ADDRESS : PUPS_ADDRESS;
              const imgSrc = imgSrcs?.[collection]?.[offsetId] || "";
              return (
                <ItemContainer key={`${collection}-${id}`}>
                  <ImageContainer>
                    {imgSrc && <img alt="" src={imgSrc} />}
                  </ImageContainer>
                  <Header>{header}</Header>
                  <Button
                    onClick={() =>
                      handleManageClick({
                        _collectionAddress,
                        _detailId: id,
                      })
                    }
                  >
                    Manage
                  </Button>
                </ItemContainer>
              );
            }
          )}
        </Container>
      </div>
    </>
  );
};

export default Stake;
