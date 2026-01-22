import { Col, Row, Image, Rate } from "antd";
import React, { useState } from "react";
import imageProduct from "../../assets/images/product1.jpg";
import imageProductSmall from "../../assets/images/productSmall.jpg";
import * as productService from "../../services/productService";
import { useQuery } from "@tanstack/react-query";
import * as message from "../Message/Message";

import {
  ButtonBuyProduct,
  WrapperAddressProduct,
  WrapperInputNumber,
  WrapperNameProduct,
  WrapperPriceProduct,
  WrapperProductSmall,
  WrapperQualityProduct,
} from "./style";

import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { addOrderProduct } from "../../redux/slices/orderSlice";
import { convertPrice } from "../../utils";
const ProductDetailsCompoment = ({ idProduct }) => {
  const [numProduct, setNumProduct] = useState(1);
  const user = useSelector((state) => state.user);
  const { messageApi, contextHolder } = message.useCustomMessage();
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const onChange = (value) => {
    setNumProduct(Number(value));
  };
  const handleChangeCount = (type) => {
    if (type === "increase") {
      setNumProduct(numProduct + 1);
    } else {
      setNumProduct(numProduct - 1);
    }
  };
  const fetchGetDetailsProduct = async (context) => {
    const id = context?.queryKey && context?.queryKey[1];
    if (id) {
      const res = await productService.getDetailsProduct(id);
      return res.data;
    }
  };

  const { isPending, data: productDetails } = useQuery({
    queryKey: ["product-details", idProduct],
    queryFn: fetchGetDetailsProduct,
    enabled: !!idProduct,
  });
  console.log(productDetails);

  const handleAddOrderProduct = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      message.success("Đã thêm vào giỏ hàng", messageApi);
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
          },
        })
      );
    }
  };

  const handleAddOrderProduct2 = () => {
    if (!user?.id) {
      navigate("/sign-in", { state: location?.pathname });
    } else {
      dispatch(
        addOrderProduct({
          orderItem: {
            name: productDetails?.name,
            amount: numProduct,
            image: productDetails?.image,
            price: productDetails?.price,
            product: productDetails?._id,
            discount: productDetails?.discount,
            countInStock: productDetails?.countInStock,
          },
        })
      );
      navigate("/order")
    }
  };
  return (
    <>
      {contextHolder}
      <Row style={{ padding: "16px", backgroundColor: "#fff" }}>
        <Col span={10}>
          <Image
            src={productDetails?.image}
            alt="Hinh anh san pham"
            preview={false}
          />
        </Col>
        <Col span={14} style={{ padding: "0 16px" }}>
          <WrapperNameProduct>{productDetails?.name}</WrapperNameProduct>
          <div>
            <Rate
              allowHalf
              defaultValue={productDetails?.rating}
              value={productDetails?.rating}
              disabled
            />
            <span
              style={{
                marginLeft: "16px",
                fontSize: "15px",
                lineHeight: "24px",
                color: "rgb(120,120,120)",
              }}
            >
              Đã bán 1000
            </span>
          </div>
          <WrapperPriceProduct>{convertPrice(productDetails?.price)}</WrapperPriceProduct>
          <WrapperAddressProduct>
            <span>Giao đến </span>
            <span className="address">{user?.address}</span> -
            <span className="change-address">Đổi địa chỉ</span>
          </WrapperAddressProduct>
          <div style={{ margin: "12px 0" }}>Số lượng:</div>
          <WrapperQualityProduct>
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: numProduct > 1 ? "pointer" : "not-allowed",
                opacity: numProduct > 1 ? 1 : 0.5,
              }}
              onClick={() => handleChangeCount("decrease")}
              disabled={numProduct <= 1}
            >
              <MinusOutlined style={{ color: "#000", fontSize: "14px", padding: "0 4px" }} />
            </button>
            <WrapperInputNumber
              onChange={onChange}
              value={numProduct}
              size="small"
              min={1}
              max={productDetails?.countInStock}
            />
            <button
              style={{
                border: "none",
                background: "transparent",
                cursor: numProduct < productDetails?.countInStock ? "pointer" : "not-allowed",
                opacity: numProduct < productDetails?.countInStock ? 1 : 0.5,
              }}
              onClick={() => handleChangeCount("increase")}
              disabled={numProduct >= productDetails?.countInStock}
            >
              <PlusOutlined style={{ color: "#000", fontSize: "14px", padding: "0 4px" }} />
            </button>
          </WrapperQualityProduct>
          <Row>
            <Col span={12}>
              <ButtonBuyProduct onClick={handleAddOrderProduct}>Thêm vào giỏ Hàng</ButtonBuyProduct>
            </Col>
            <Col span={12}>
              <ButtonBuyProduct
                className="btnBuyNow"
                onClick={handleAddOrderProduct2}
              >
                Mua ngay
              </ButtonBuyProduct>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default ProductDetailsCompoment;
