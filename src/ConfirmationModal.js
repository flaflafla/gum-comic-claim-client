import React, { useEffect } from "react";
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
`;

const CloseButton = styled.div`
  position: absolute;
  top: 20px;
  right: 40px;
  color: #fff;
  font-size: 26px;
  cursor: pointer;
`;

const Heading = styled.h1`
  font-family: "Showcard", sans-serif;
  font-size: 32px;
  text-align: center;
  grid-column: 1/-1;
  color: #fff;
  margin-top: 0;
  margin-bottom: 12px;
`;

const CancelButton = styled.button`
  border-radius: 24px;
  border: 3px solid #fff;
  width: 112px;
  height: 48px;
  font-size: 22px;
  color: #ffffff;
  background-color: transparent;
  font-family: "Blatant", sans-serif;
  cursor: pointer;

  &:hover {
    font-size: 23px;
  }
`;

const ClaimButton = styled.button`
  border-radius: 24px;
  border: 3px solid #fff;
  width: 112px;
  height: 48px;
  font-size: 22px;
  color: #ffffff;
  background-color: transparent;
  font-family: "Blatant", sans-serif;
  cursor: pointer;
  margin-left: 12px;

  &:hover {
    font-size: 23px;
  }
`;

const InnerContainer = styled.div`
  background-color: rgb(255, 216, 229);
  width: calc(100% - 40px);
  margin: 0 auto;
  border-radius: 12px;
  border: none;
  padding: 20px 10px 10px 10px;
  text-align: center;
  font-family: "Blatant", sans-serif;
  font-size: 22px;
  line-height: 25px;
  margin-bottom: 26px;
  color: #666;

  div {
    margin-bottom: 6px;
  }
`;

const SubHeading = styled.div`
  color: #fff;
  font-family: "Blatant", sans-serif;
  font-size: 22px;
  line-height: 25px;
  margin-bottom: 22px;
  text-align: center;
`;

const SectionName = styled.div`
  color: #ff74b4;
  font-weight: bold;
`;

const ButtonsContainer = styled.div`
  text-align: right;
`;

const ConfirmationModal = ({ count, address, handleClaim, closeModal }) => {
  useEffect(() => {
    const body = document.querySelector("body");
    body.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldClose =
        !["claim-button", "confirmation-modal"].includes(event.target.id) &&
        !["claim-button", "confirmation-modal"].includes(
          event.target.parentElement?.id
        ) &&
        !["claim-button", "confirmation-modal"].includes(
          event.target.parentElement?.parentElement?.id
        ) &&
        !["claim-button", "confirmation-modal"].includes(
          event.target.parentElement?.parentElement?.parentElement?.id
        );
      if (shouldClose) {
        closeModal();
      }
    });
  }, []);

  return (
    <Container id="confirmation-modal">
      <CloseButton onClick={closeModal}>×</CloseButton>
      <Heading>Confirm Order</Heading>
      <SubHeading>Everything look right?</SubHeading>
      <InnerContainer>
        <SectionName>Number of comics</SectionName>
        <div>{count}</div>
        <br />
        <SectionName>Delivery address</SectionName>
        {address.split("\n").map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </InnerContainer>
      <ButtonsContainer>
        <CancelButton onClick={closeModal}>Cancel</CancelButton>
        <ClaimButton onClick={handleClaim}>Submit</ClaimButton>
      </ButtonsContainer>
    </Container>
  );
};

export default ConfirmationModal;
