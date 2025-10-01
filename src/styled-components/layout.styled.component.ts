import styled from "styled-components";

export const LayoutContainer = styled.div`
  width: 98%;
  max-width: 1600px;
  margin: 80px auto 20px;
  padding: 10px;
  min-height: calc(100vh - 120px);

  @media only screen and (max-width: 1176px) {
    width: 96%;
    padding: 12px;
    margin: 70px auto 20px;
  }

  @media only screen and (max-width: 768px) {
    width: 100%;
    padding: 8px;
    margin: 60px auto 20px;
  }
`;
