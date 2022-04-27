import React, { useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ConnectWalletModal from "./ConnectWalletModal";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

const Container = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  width: calc(100% - 80px);
  padding: 0 40px;
`;

const TopBar = styled.div`
  display: grid;
  grid-column: 1/-1;
  height: 100px;
  grid-template-columns: 1fr auto 1fr;
  background-color: #ff74b4;
  padding: 0 40px;
  width: calc(100% - 40px);
`;

const Logo = styled.img`
  width: 100px;
  margin: 23px 0;
`;

const PreviewContainer = styled.div`
  padding: 40px 40px 40px 0;
`;

const ClaimContainer = styled.div`
  padding: 40px 40px 40px 0;
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

const App = () => {
  const [account, setAccount] = useState("");
  const [showConnectWalletModal, setShowConnectWalletModal] = useState(false);
  const [eligibleCount, setEligibleCount] = useState(-1);
  const [error, setError] = useState("");
  const [claimCount, setClaimCount] = useState(0);
  const [address, setAddress] = useState("");

  const handleConnectButtonClick = useCallback(() => {
    setShowConnectWalletModal(true);
  }, [setShowConnectWalletModal]);

  const closeModal = useCallback(() => {
    setShowConnectWalletModal(false);
  }, [setShowConnectWalletModal]);

  const connectMetaMask = useCallback(async () => {
    const { ethereum } = window;
    const metamaskIsInstalled = ethereum?.isMetaMask;
    if (metamaskIsInstalled) {
      try {
        const accounts = await ethereum.request({
          method: "eth_requestAccounts",
        });
        ethereum.on("accountsChanged", (accounts) => {
          setAccount(accounts[0]);
        });
        setAccount(accounts[0]);
      } catch (err) {
        console.error(err);
        setError("Sorry, something went wrong. Please check your wallet.");
      }
    } else {
      setError("Please install MetaMask");
    }
  }, [setAccount, setError]);

  const connectWalletConnect = useCallback(async () => {
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
    const _web3 = new Web3(provider);
    try {
      const accounts = await _web3.eth.getAccounts();
      setAccount(accounts[0]);
    } catch (err) {
      console.error(err);
      setError("Sorry, something went wrong. Please check your wallet.");
    }
  }, [setAccount]);

  const connectCoinbaseWallet = useCallback(() => {}, [setAccount]);

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
      });
  }, [account, setEligibleCount]);

  useEffect(() => {
    if (!account) {
      setEligibleCount(-1);
    } else {
      getBalances();
    }
  }, [account, setEligibleCount, getBalances]);

  useEffect(() => {
    if (eligibleCount > 0) setClaimCount(1);
  }, [eligibleCount, setClaimCount]);

  const handleMinusButtonClick = useCallback(() => {
    if (claimCount < 2) return;
    setClaimCount(claimCount - 1);
  }, [claimCount, setClaimCount]);

  const handlePlusButtonClick = useCallback(() => {
    if (claimCount > eligibleCount - 1) return;
    setClaimCount(claimCount + 1);
  }, [claimCount, eligibleCount, setClaimCount]);

  const handleClaimButtonClick = useCallback(() => {}, []);

  const handleAddressChange = useCallback(
    ({ target }) => {
      const { value } = target;
      setAddress(value);
    },
    [setAddress]
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
      <TopBar>
        <div />
        <a href="https://bubblegumkids.xyz/home">
          <Logo src="bgk-logo.png" alt="bubblegum kids logo" />
        </a>
      </TopBar>
      <Container>
        <PreviewContainer>
          <PreviewImage src="manatee.jpeg" alt="manatee" />
          <PreviewImage src="manatee-2.jpeg" alt="manatee" />
        </PreviewContainer>
        <ClaimContainer>
          <Heading>CLAIM YOUR BUBBLEGUM COMIC</Heading>
          <Text>
            Holders of Bugglegum Kids and Bubblegum Puppies are eligible to{" "}
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
                    src={"connect-wallet.png"}
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
          {eligibleCount === 0 && (
            <EligibleCount>
              Sorry, you're not eligible to claim any comics.
            </EligibleCount>
          )}
          {eligibleCount > 0 && (
            <>
              <EligibleCount>
                Congrats, you can claim up to {eligibleCount} comics!
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
                  disabled={claimCount + 1 > eligibleCount}
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
                  placeholder="Where should we send it? (Full addresss please)"
                  value={address}
                  onChange={handleAddressChange}
                />
              </AddressInputContainer>
              <Text>
                Please include the full address, inlcuding street address,
                flat/apartment number, city, postal code and country.
              </Text>
              <CenteredButtonContainer>
                <ClaimButton
                  onClick={handleClaimButtonClick}
                  disabled={
                    !address.length ||
                    claimCount < 1 ||
                    claimCount > eligibleCount
                  }
                >
                  <img
                    src={
                      !address.length ||
                      claimCount < 1 ||
                      claimCount > eligibleCount
                        ? "claim-disabled.png"
                        : "claim.png"
                    }
                    alt="claim button"
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

export default App;
