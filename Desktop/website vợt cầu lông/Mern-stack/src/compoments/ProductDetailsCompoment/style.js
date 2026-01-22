import { Image, InputNumber } from "antd";
import styled from "styled-components";

export const WrapperProductSmall = styled(Image)`
    width: 64px;
    height: 64px;
`

export const WrapperNameProduct = styled.h1`
    color: rgb(36,36,36);
    font-size: 24px;
    font-weight: 300;
    line-height: 32px;
    word-wrap: break-word; 
`

export const WrapperPriceProduct = styled.h1`
    padding: 10px;
    font-weight: 500;
    font-size: 32px;
    margin-right: 8px;
`

export const WrapperAddressProduct = styled.div`
    span{
        font-size: 18px;
    }
    span.address{
        text-decoration: underline;
        line-height: 24px;
        font-weight: 500;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    };
    span.change-address{
        color: rgb(11,116,229);
        line-height: 24px;
        font-weight: 500;
    }
`

export const ButtonValueNumber = styled.button`
    width: 22px;
    height: 22px;
`

export const InputValueNumber = styled(InputNumber)`
        & .ant-input-number-handler-wrap{
            display: none;
        }
`;

export const ButtonBuyProduct = styled.button`
    width: 98%;
    height: 40px;
    margin: 12px 2px;
    color: #ee4d2d;
    border:1px solid #ee4d2d;
    border-radius: 4px;
    font-size: 16px;
    background-color: transparent;
        &.btnBuyNow{
            background-color: #ee4d2d;
            color: #fff;
            &:hover{
                background-color: #f05d40;
            }
        }
`
export const WrapperInputNumber = styled(InputNumber)`
  &.ant-input-number.ant-input-number-sm {
    width: 40px;
    border-top: none;
    border-bottom: none;
    .ant-input-number-handler-wrap {
      display: none !important;
    }
  }
`
export const WrapperQualityProduct = styled.div`
  display: flex;
  gap: 4px;
  align-items: center;
  width: 96px;
  border: 1px solid #ccc;
  border-radius: 4px;
`