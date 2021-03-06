import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  top: 140px;
  padding: 20px;
  background-color: #ff74b4;
  z-index: 2;
  width: 600px;
  left: calc(50% - 300px);
  border-radius: 24px;
  grid-column-gap: 30px;

  @media only screen and (max-width: 1000px) {
    width: calc(100% - 120px);
    left: 40px;
  }
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
  margin-bottom: 20px;
`;

const ErrorContainer = styled.div`
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
    margin-bottom: 18px;

    a {
      color: #ff74b4;
    }
  }
`;

const ErrorModal = ({ closeModal, error }) => {
  useEffect(() => {
    const body = document.querySelector("body");
    body.addEventListener("click", (event) => {
      event.stopPropagation();
      const shouldClose =
        event.target.id !== "error" &&
        event.target.parentElement?.id !== "error" &&
        event.target.parentElement?.parentElement?.id !== "error" &&
        event.target.parentElement?.parentElement?.parentElement?.id !==
          "error";
      if (shouldClose) {
        closeModal();
      }
    });
  }, []);

  return (
    <Container id="error">
      <CloseButton onClick={closeModal}>×</CloseButton>
      <Heading>Oops</Heading>
      <ErrorContainer>
        <div>{error}</div>
        <div>
          If the error persists let us know in the{" "}
          <a
            href={"https://discord.gg/hRZtGA682Q"}
            target="_blank"
            rel="noreferrer noopener"
          >
            Discord
          </a>
          .
        </div>
      </ErrorContainer>
    </Container>
  );
};

export default ErrorModal;
