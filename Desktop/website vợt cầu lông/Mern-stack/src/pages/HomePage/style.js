// import styled from "styled-components";

// export const WrapperTypeProduct = styled.div`
//     display : flex;
//     align-items: center;
//     gap: 24px;
//     justify-content: flex-start;
//     border-bottom: 2px solid #ccc;
//     height: 40px;
// `
import styled from "styled-components";

export const WrapperTypeProduct = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
  justify-content: flex-start;
  border-bottom: 2px solid #ccc;
  height: 40px;
`;

// Lưới hiển thị sản phẩm
export const WrapperListProduct = styled.div`
  margin-top: 32px;
  display: grid;
  grid-template-columns: repeat(5, 1fr); /* 5 sản phẩm 1 hàng */
  gap: 16px;
  justify-items: center;
  align-items: stretch;

  @media (max-width: 1400px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 1100px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 500px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;
