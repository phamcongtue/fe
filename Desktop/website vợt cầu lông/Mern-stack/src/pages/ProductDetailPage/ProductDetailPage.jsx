import React from "react";
import ProductDetailsCompoment from "../../compoments/ProductDetailsCompoment/ProductDetailsCompoment";
import { useNavigate, useParams } from "react-router-dom";

const ProductDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  return (
    <div
      style={{
        padding: "0 120px",
        backgroundColor: "#efefef",
        height: "1000px",
      }}
    >
      <h4>
        <span style={{ cursor: "pointer" }} onClick={() => navigate("/")}>
          Trang chủ
        </span>
        - chi tiết sản phẩm
      </h4>
      <ProductDetailsCompoment idProduct={id} />
    </div>
  );
};

export default ProductDetailPage;
