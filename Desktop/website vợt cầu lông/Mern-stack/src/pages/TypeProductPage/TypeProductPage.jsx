import React, { useEffect, useState } from "react";
import NavbarCompoment from "../../compoments/NavbarCompoment/NavbarCompoment";
import CardCompoment from "../../compoments/CardCompoment/CardCompoment";
import { Col, Pagination, Row } from "antd";
import { WrapperNavbar, WrapperProducts } from "./style";
import { useLocation } from "react-router-dom";
import * as productService from "../../services/productService";
import Loading from "../../compoments/LoadingCompoment/Loading";
import { useSelector } from "react-redux";
import { useDebounce } from "../../hook/useDebounce";

const TypeProductPage = () => {
  const searchProduct = useSelector((state) => state?.product?.search);
  const searchDebounce = useDebounce(searchProduct, 500);
  const { state } = useLocation();
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]); // Lưu danh sách gốc
  const [pending, setPending] = useState(false);
  const [panigate, setPanigate] = useState({
    page: 0,
    limit: 10,
    total: 1,
  });

  const fetchProductType = async (type, page, limit) => {
    setPending(true);
    const res = await productService.getProductType(type, page , limit);
    if (res?.status === "OK") {
      setPending(false);
      setProducts(res?.data);
      setOriginalProducts(res?.data); // Lưu danh sách gốc
      setPanigate({ ...panigate, total: res?.totalPage });
    } else {
      setPending(false);
    }
  };

  useEffect(() => {
    if (state) {
      fetchProductType(state, panigate.page, panigate.limit);
    }
  }, [state, panigate.page, panigate.limit]);

  useEffect(() => {
    if (searchDebounce) {
      const newProduct = originalProducts.filter((pro) =>
        pro?.name.toLowerCase().includes(searchDebounce.toLowerCase())
      );
      setProducts(newProduct);
    } else {
      setProducts(originalProducts); // Quay lại danh sách gốc nếu không có tìm kiếm
    }
  }, [searchDebounce, originalProducts]);

  const onChange = (current, pageSize) => {
    setPanigate({ ...panigate, page: current - 1, limit: pageSize }); // Cập nhật page
  };

  return (
    <Loading isPending={pending}>
      <div
        style={{
          width: "100%",
          background: "#efefef",
          height: "calc(100vh - 64px)",
        }}
      >
        <div style={{ width: "1270px", margin: "0 auto", height: "100%" }}>
          <Row
            style={{
              flexWrap: "nowrap",
              paddingTop: "10px",
              height: "calc(100% - 20px)",
            }}
          >
            <WrapperNavbar span={4}>
              <NavbarCompoment />
            </WrapperNavbar>
            <Col
              span={20}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <WrapperProducts>
                {products.length > 0 ? (
                  products.map((product) => (
                    <CardCompoment
                      key={product._id}
                      countInStock={product.countInStock}
                      description={product.description}
                      image={product.image}
                      name={product.name}
                      price={product.price}
                      rating={product.rating}
                      type={product.type}
                      selled={product.selled}
                      discount={product.discount}
                      id={product._id}
                    />
                  ))
                ) : (
                  <div style={{ textAlign: "center", margin: "20px" }}>
                    Không có sản phẩm nào được tìm thấy.
                  </div>
                )}
              </WrapperProducts>
              <Pagination
                defaultCurrent={panigate.page + 1}
                total={panigate.total}
                onChange={onChange}
                style={{ textAlign: "center", marginTop: "10px" }}
              />
            </Col>
          </Row>
        </div>
      </div>
    </Loading>
  );
};

export default TypeProductPage;
