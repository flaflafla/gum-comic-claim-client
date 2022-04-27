import React, { useCallback, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 140px;
  padding: 40px;
  background-color: #ff74b4;
  z-index: 1;
  width: 600px;
  left: calc(50% - 300px);
  border-radius: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-column-gap: 30px;
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
`;

const ConnectButton = styled.button`
  background-color: rgb(255, 216, 229);
  width: 100%;
  border-radius: 12px;
  border: none;
  padding: 20px;
  cursor: pointer;
  display: grid;
  grid-template-rows: 115px 32px;
  text-align: center;

  img {
    width: 100px;
    margin: 0 auto;
  }
`;

const Heading = styled.h1`
  font-family: "Showcard", sans-serif;
  font-size: 32px;
  text-align: center;
  grid-column: 1/-1;
  color: #fff;
  margin-top: 0;
`;

const ButtonLabel = styled.div`
  color: #ff74b4;
  text-align: center;
  font-family: "Blatant", sans-serif;
  font-size: 22px;
`;

const ConnectWalletModal = ({
  closeModal,
  connectMetaMask,
  connectWalletConnect,
  connectCoinbaseWallet,
}) => {
  const handleWalletSelect = useCallback(
    (callback) => {
      callback();
      closeModal();
    },
    [closeModal]
  );

  useEffect(() => {
    const body = document.querySelector("body");
    body.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldClose =
        !["connect-button", "connect-wallet-modal"].includes(event.target.id) &&
        !["connect-button", "connect-wallet-modal"].includes(
          event.target.parentElement?.id
        ) &&
        !["connect-button", "connect-wallet-modal"].includes(
          event.target.parentElement?.parentElement?.id
        );
      if (shouldClose) {
        closeModal();
      }
    });
  }, []);

  return (
    <Container id="connect-wallet-modal">
      <CloseButton onClick={closeModal}>×</CloseButton>
      <Heading>Select Wallet</Heading>
      <ConnectButton onClick={() => handleWalletSelect(connectMetaMask)}>
        <img src="metamask.svg" alt="metamask" style={{ marginTop: "4px" }} />
        <ButtonLabel>MetaMask</ButtonLabel>
      </ConnectButton>
      <ConnectButton onClick={() => handleWalletSelect(connectWalletConnect)}>
        <img
          src="walletconnect.svg"
          alt="walletconnect"
          style={{ marginTop: "15px" }}
        />
        <ButtonLabel>WalletConnect</ButtonLabel>
      </ConnectButton>
      <ConnectButton onClick={() => handleWalletSelect(connectCoinbaseWallet)}>
        <img src="coinbase-wallet.png" alt="coinbase wallet" />
        <ButtonLabel>Coinbase Wallet</ButtonLabel>
      </ConnectButton>
    </Container>
  );
};

export default ConnectWalletModal;
