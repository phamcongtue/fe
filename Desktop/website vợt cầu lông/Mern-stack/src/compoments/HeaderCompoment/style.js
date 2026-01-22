import styled from 'styled-components'
import { Col, Row } from "antd";

export const WrapperHeader = styled(Row)`
    padding : 10px 120px;
    background-color: #ee4d2d;
`

export const WrapperTextHeader = styled.span`
    font-size: 24px;
    font-weight: bold;
    color: #fff;
    line-height: 40px;
    white-space: nowrap;
    cursor: pointer
`
export const WrapperHeaderAccount = styled.div`
    display : flex;
    align-items: center;
    color: #fff;
    gap: 10px;
    margin-left: 12px;
    white-space: nowrap;
`
export const WrapperHeaderPopup = styled.p`
    cursor : pointer;
    padding: 4px 8px;
    &:hover{
        color: #ee4d2d;
    }
`
