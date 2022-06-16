import styled from "styled-components";

const Container = styled.div`
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

const TopBar = () => (
  <Container>
    <div />
    <a href="https://www.bubblegumkids.com/">
      <Logo src="/bgk-logo.png" alt="bubblegum kids logo" />
    </a>
  </Container>
);

export default TopBar;
