import styled from "styled-components";

const Button = styled.button`
  background-color: #fff;
  border: solid 3px #ff74b4;
  border-radius: 12px;
  color: #666;
  cursor: pointer;
  font-family: "Blatant", sans-serif;
  font-size: 20px;
  height: 42px;

  ${({ marginBottom }) => marginBottom && `margin-bottom: ${marginBottom};`}
  ${({ width }) => `width: ${width ? width : "220px"};`}

  max-width: 100%;

  &:hover {
    background-color: #ff74b4;
    color: #fff;
  }
`;

export { Button };
