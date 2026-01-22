import React from "react";
import { Card } from "antd";
import { StarFilled } from "@ant-design/icons";
import {
  StyleNameProduct,
  WrapperCardStyle,
  WrapperDiscountText,
  WrapperFavouriteText,
  WrapperPriceText,
  WrapperReportText,
} from "./style";
import { convertPrice } from "../../utils";
import { useNavigate } from "react-router-dom";

const CardCompoment = (props) => {
  const { countInStock, description, discount, image, name, price, rating, type, id } = props;
  const navigate = useNavigate()
  const handleDetailsProduct = (id) => {
    navigate(`/product-details/${id}`)
  };
  const { Meta } = Card;
  return (
    <div style={{ padding: "16px 0" }}>
      <WrapperCardStyle
        hoverable
        style={{ width: 160 }}
        styles={{ body: { padding: "10px" } }}
        cover={
          <img
            alt="example"
            src={image}
            style={{
              width: "100%",
              height: "200px",
              objectFit: "cover",
            }}
          />
        }
        onClick={() => countInStock !==0 && handleDetailsProduct(id)}
        disabled={countInStock === 0}
      >
        <StyleNameProduct>
          <WrapperFavouriteText>Yêu Thích</WrapperFavouriteText> <br />
          {name}
        </StyleNameProduct>
        <WrapperReportText>
          <span>{rating}</span>
          <StarFilled style={{ color: "#ee4d2d" }} />
          <span style={{ marginLeft: "16px" }}>Đã bán 1000</span>
        </WrapperReportText>
        <WrapperPriceText>
          {convertPrice(price)} <WrapperDiscountText>- {discount || 5} %</WrapperDiscountText>
        </WrapperPriceText>
      </WrapperCardStyle>
    </div>
  );
};

export default CardCompoment;
