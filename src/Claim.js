import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import ConfirmationModal from "./ConfirmationModal";
import SuccessModal from "./SuccessModal";
import ErrorModal from "./ErrorModal";
import {
  _connectMetaMask,
  _connectWalletConnect,
  _connectCoinbaseWallet,
} from "./utils";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 80px);
  padding: 0 40px;

  @media only screen and (max-width: 1000px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto;
  }
`;

const TopBar = styled.div`
  display: grid;
  grid-column: 1/-1;
  height: 100px;
  grid-template-columns: 1fr auto 1fr;
  background-color: #ff74b4;
  padding: 0 40px;
  width: calc(100% - 80px);
`;

const Logo = styled.img`
  width: 100px;
  margin: 23px 0;
`;

const PreviewContainer = styled.div`
  padding: 40px 40px 40px 0;

  @media only screen and (max-width: 1000px) {
    grid-row: 2;
    padding: 0 0 40px 0;
  }
`;

const ClaimContainer = styled.div`
  padding: 40px 0;

  @media only screen and (max-width: 1000px) {
    grid-row: 1;
  }
`;

const PreviewImage = styled.img`
  width: 100%;
  margin-bottom: 40px;
`;

const Heading = styled.h1`
  font-family: "Showcard", sans-serif;
  margin-top: 0;
  font-size: 42px;
  text-align: center;
`;

const Text = styled.div`
  font-family: "Blatant", sans-serif;
  font-size: 22px;
  line-height: 25px;
  margin-bottom: 26px;
  color: #666;
`;

const Emphasis = styled.div`
  font-family: "Showcard", sans-serif;
  font-size: 24px;
  text-align: center;
  padding: 0 40px;
  width: calc(100% - 80px);
`;

const CenteredButtonContainer = styled.div`
  width: 100%;
  text-align: center;
`;

const ConnectButton = styled.button`
  background-color: transparent;
  border: none;
  margin: 60px auto 0 auto;
  cursor: pointer;

  :hover {
    margin-top: 58px;
    img {
      width: 186px;
    }
  }

  img {
    width: 180px;
  }
`;

const Account = styled.div`
  font-family: "Blatant", sans-serif;
  font-size: 22px;
  line-height: 25px;
  margin-bottom: 26px;
  text-align: center;

  a {
    color: inherit;
    text-decoration: none;
  }

  @media only screen and (max-width: 800px) {
    width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    margin: 0 auto 26px auto;
  }

  @media only screen and (max-width: 560px) {
    width: 200px;
  }
`;

const EligibleCount = styled.div`
  font-family: "Showcard", sans-serif;
  font-size: 20px;
  text-align: center;
  color: #333;
  padding: 16px 40px;
`;

const PlusMinusButton = styled.button`
  width: 26px;
  height: 26px;
  border: 2px solid #ff74b4;
  border-radius: 100%;
  background-color: #ff74b4;
  color: #fff;
  font-size: 18px;
  cursor: pointer;

  ${({ disabled }) =>
    disabled &&
    `
  background-color: #999;
  border: 2px solid #999;
  cursor: inherit;
  `}
`;

const ClaimCount = styled.div`
  font-family: "Showcard", sans-serif;
  font-size: 28px;
  text-align: center;
  color: #333;
  padding: 0 16px;
  border-radius: 12px;
`;

const ClaimButton = styled.button`
  background-color: transparent;
  border: none;
  margin: 12px auto 0 auto;
  cursor: not-allowed;

  img {
    width: 130px;
  }

  ${({ disabled }) =>
    !disabled &&
    `
    cursor: pointer;

    :hover {
      margin-top: 10px;
  
      img {
        width: 136px;
      }
    }
  `}
`;

const CountContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr auto 80px auto 1fr;
  margin-top: 28px;
  margin-bottom: 28px;
`;

const AddressInput = styled.textarea`
  font-family: "Blatant", sans-serif;
  font-size: 18px;
  border: 2px solid #666;
  line-height: 22px;
  margin-bottom: 26px;
  padding: 8px 12px;
  color: #444;
  resize: none;
  width: 100%;
  border-radius: 4px;
  width: calc(100% - 40px);
  outline: none;

  :focus {
    border: 2px solid #ff74b4;
  }
`;

const AddressInputContainer = styled.div`
  text-align: center;
`;

const Overlay = styled.div`
  z-index: 1;
  position: absolute;
  width: 100%;
  height: 100%;
`;

const Claim = () => {
  const [account, setAccount] = useState("");
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [showConfirmOrderModal, setShowConfirmOrderModal] = useState(false);
  const [eligibleCount, setEligibleCount] = useState(-1);
  const [error, setError] = useState("");
  const [claimCount, setClaimCount] = useState(0);
  const [address, setAddress] = useState("");
  const [alreadyOrderedCount, setAlreadyOrderedCount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const connectMetaMask = useCallback(
    () => _connectMetaMask({ setAccount, setError }),
    [setAccount, setError]
  );

  const connectWalletConnect = useCallback(
    () => _connectWalletConnect({ setAccount, setError }),
    [setAccount, setError]
  );

  const connectCoinbaseWallet = useCallback(
    () => _connectCoinbaseWallet({ setAccount, setError }),
    [setAccount, setError]
  );

  const handleConnectButtonClick = useCallback(() => {
    setShowConnectWalletModal(true);
  }, [setShowConnectWalletModal]);

  const closeModal = useCallback(() => {
    setShowConnectWalletModal(false);
  }, [setShowConnectWalletModal]);

  const closeErrorModal = useCallback(() => {
    setError("");
  }, [setError]);

  const closeConfirmationModal = useCallback(() => {
    setShowConfirmOrderModal(false);
  }, [setShowConfirmOrderModal]);

  const closeSuccessModal = useCallback(() => {
    setShowSuccessModal(false);
  }, [setShowSuccessModal]);

  const getBalances = useCallback(() => {
    const { REACT_APP_API_URL: apiUrl } = process.env;
    fetch(`${apiUrl}/accounts/${account}/balances`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const {
          data: { kidCount = 0, pupCount = 0 },
        } = json;
        const _eligibleCount = Math.min(kidCount, pupCount);
        setEligibleCount(_eligibleCount);
      })
      .catch((err) => {
        console.error(err);
        setError(
          "Sorry, we weren't able to get information about your eligibility."
        );
      });
  }, [account, setEligibleCount, setError]);

  const getOrders = useCallback(() => {
    const { REACT_APP_API_URL: apiUrl } = process.env;
    fetch(`${apiUrl}/orders/${account}`)
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        const { data } = json;
        const totalCount = data.reduce((prev, cur) => {
          const { count } = cur;
          const newTotalCount = prev + count;
          return newTotalCount;
        }, 0);
        setAlreadyOrderedCount(totalCount);
      })
      .catch((err) => {
        console.error(err);
        setError("Sorry, we weren't able to get your previous orders.");
      });
  }, [account, setAlreadyOrderedCount, setError]);

  useEffect(() => {
    if (!account) {
      setEligibleCount(-1);
    } else {
      getBalances();
      getOrders();
    }
  }, [account, setEligibleCount, getBalances, getOrders]);

  useEffect(() => {
    if (eligibleCount > 0) setClaimCount(1);
  }, [eligibleCount, setClaimCount]);

  const handleMinusButtonClick = useCallback(() => {
    if (claimCount < 2) return;
    setClaimCount(claimCount - 1);
  }, [claimCount, setClaimCount]);

  const handlePlusButtonClick = useCallback(() => {
    if (claimCount > eligibleCount - alreadyOrderedCount - 1) return;
    setClaimCount(claimCount + 1);
  }, [claimCount, eligibleCount, alreadyOrderedCount, setClaimCount]);

  const handleClaimButtonClick = useCallback(() => {
    setShowConfirmOrderModal(true);
  }, [setShowConfirmOrderModal]);

  const handleAddressChange = useCallback(
    ({ target }) => {
      const { value } = target;
      setAddress(value);
    },
    [setAddress]
  );

  const handleClaim = useCallback(() => {
    const { REACT_APP_API_URL: apiUrl } = process.env;
    fetch(`${apiUrl}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        account,
        deliveryAddress: address,
        count: claimCount,
        notes: "",
      }),
    })
      .then((res) => {
        return res.json();
      })
      .then((json) => {
        if (json.data?.length) {
          setShowConfirmOrderModal(false);
          setShowSuccessModal(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Sorry, we weren't able to process your order.");
      });
  }, [
    account,
    claimCount,
    address,
    setShowSuccessModal,
    setShowConfirmOrderModal,
  ]);

  const finalEligibleCount = eligibleCount - alreadyOrderedCount;

  return (
    <>
      {(showConnectWalletModal ||
        error ||
        showConfirmOrderModal ||
        showSuccessModal) && <Overlay />}
      {showConnectWalletModal && (
        <ConnectWalletModal
          closeModal={closeModal}
          connectMetaMask={connectMetaMask}
          connectWalletConnect={connectWalletConnect}
          connectCoinbaseWallet={connectCoinbaseWallet}
        />
      )}
      {error && <ErrorModal closeModal={closeErrorModal} error={error} />}
      {showConfirmOrderModal && (
        <ConfirmationModal
          count={claimCount}
          address={address}
          handleClaim={handleClaim}
          closeModal={closeConfirmationModal}
        />
      )}
      {showSuccessModal && <SuccessModal closeModal={closeSuccessModal} />}
      <TopBar>
        <div />
        <a href="https://bubblegumkids.xyz/home">
          <Logo src="/bgk-logo.png" alt="bubblegum kids logo" />
        </a>
      </TopBar>
      <Container>
        <PreviewContainer>
          <PreviewImage src="/roadmap.png" alt="roadmap" />
        </PreviewContainer>
        <ClaimContainer>
          <Heading>CLAIM YOUR BUBBLEGUM COMIC</Heading>
          <Text>
            Holders of Bubblegum Kids and Bubblegum Puppies are eligible to{" "}
            <b>claim free comic books.</b>
          </Text>
          <Text>
            For every pair you have (1 Kid + 1 Pup), we'll send you a physical
            comic. (The snapshot was taken at block 42069.)
          </Text>
          {!account && (
            <>
              <Emphasis>
                Connect to see how many comics you're eligible to claim!
              </Emphasis>
              <CenteredButtonContainer>
                <ConnectButton onClick={handleConnectButtonClick}>
                  <img
                    src={"/connect-wallet.png"}
                    alt="connect button"
                    id="connect-button"
                  />
                </ConnectButton>
              </CenteredButtonContainer>
            </>
          )}
          {account && (
            <Account>
              <a
                href={`https://etherscan.io/address/${account}`}
                target="_blank"
                rel="noreferrer noopener"
              >
                {account}
              </a>
            </Account>
          )}
          {finalEligibleCount === 0 && (
            <EligibleCount>
              Sorry, you're not eligible to claim any comics.
            </EligibleCount>
          )}
          {finalEligibleCount > 0 && (
            <>
              <EligibleCount>
                Congrats, you can claim up to {finalEligibleCount} comics!
              </EligibleCount>
              <CountContainer>
                <div />
                <PlusMinusButton
                  onClick={handleMinusButtonClick}
                  disabled={claimCount - 1 < 1}
                >
                  -
                </PlusMinusButton>
                <ClaimCount>{claimCount}</ClaimCount>
                <PlusMinusButton
                  onClick={handlePlusButtonClick}
                  disabled={claimCount + 1 > finalEligibleCount}
                >
                  +
                </PlusMinusButton>
              </CountContainer>
              <Text>
                Where should we send {claimCount === 1 ? "it" : "them"}?
              </Text>
              <AddressInputContainer>
                <AddressInput
                  rows="5"
                  placeholder="Full delivery address"
                  value={address}
                  onChange={handleAddressChange}
                />
              </AddressInputContainer>
              <Text>
                Please include the full address, including street address,
                flat/apartment number, city, postal code and country.
              </Text>
              <CenteredButtonContainer>
                <ClaimButton
                  onClick={handleClaimButtonClick}
                  disabled={
                    !address.length ||
                    claimCount < 1 ||
                    claimCount > finalEligibleCount
                  }
                >
                  <img
                    src={
                      !address.length ||
                      claimCount < 1 ||
                      claimCount > finalEligibleCount
                        ? "/claim-disabled.png"
                        : "/claim.png"
                    }
                    alt="claim button"
                    id="claim-button"
                  />
                </ClaimButton>
              </CenteredButtonContainer>
            </>
          )}
        </ClaimContainer>
      </Container>
    </>
  );
};

export default Claim;
