import styled from "styled-components";

const Container = styled.div`
  height: 30px;
  background-color: teal;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bolder;
`;
const Announcement = () => {
  return (
    <Container>Super Deal! Free Shipping on all orders over $50.</Container>
  );
};

export default Announcement;
