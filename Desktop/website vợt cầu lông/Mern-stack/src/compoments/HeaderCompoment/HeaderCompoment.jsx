import React, { useEffect, useState } from "react";
import { Alert, Badge, Col, Input, Popover } from "antd";
import {
  WrapperHeader,
  WrapperTextHeader,
  WrapperHeaderAccount,
  WrapperHeaderPopup,
} from "./style";
import {
  UserOutlined,
  CaretDownOutlined,
  ShoppingCartOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../services/userService";
import { resetUser } from "../../redux/slices/userSlice";
import Loading from "../../compoments/LoadingCompoment/Loading";
import { searchProduct } from "../../redux/slices/productSlice";
import { resetOrder } from "../../redux/slices/orderSlice";


const { Search } = Input;

const HeaderCompomment = ({ isHiddenSearch = false, isHiddenCart = false }) => {
  const Navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const order = useSelector((state) => state.order)
  const handleNavigateLogin = () => {
    Navigate("/sign-in");
  };
  const dispatch = useDispatch();
  const [pending, setPending] = useState(false);
  const [useName, setUserName] = useState("");
  const [useAvatar, setUserAvatar] = useState("");
  const [search, setSearch] = useState("");
  const [isOpenPopup, setIsOpenPopup] = useState(false);
  const handleClickNavigate = (type) => {
    if (type === "profile-user") {
      Navigate("/profile-user");
    } else if (type === "admin") {
      Navigate("/system/admin");
    } else if (type === "my-order") {
      Navigate("/my-order", {
        state: {
          id: user?.id,
          token: user?.access_token,
        },
      });
    } else {
      handleLogout();
    }
    setIsOpenPopup(false);
  };
  const handleLogout = async () => {
    setPending(true);
    await userService.logOutUser();
    dispatch(resetUser());
    dispatch(resetOrder())
    localStorage.removeItem("access_token");
    Navigate("/");
    setPending(false);
  };
  useEffect(() => {
    setPending(true);
    setUserName(user?.name);
    setUserAvatar(user?.avatar);
    setPending(false);
  }, [user?.name, user?.avatar]);
  const content = (
    <div>
      <WrapperHeaderPopup onClick={() => handleClickNavigate("profile-user")}>
        Thông tin người dùng
      </WrapperHeaderPopup>
      {user?.isAdmin && (
        <WrapperHeaderPopup onClick={() => handleClickNavigate("admin")}>
          Quản lý hệ thống
        </WrapperHeaderPopup>
      )}
      <WrapperHeaderPopup onClick={() => handleClickNavigate(`my-order`)}>Đơn hàng của tôi</WrapperHeaderPopup>
      <WrapperHeaderPopup onClick={() => handleClickNavigate()}>Đăng xuất</WrapperHeaderPopup>
    </div>
  );

  const handleLogo = () => {
    Navigate("/");
  };

  const onSearch = (e) => {
    setSearch(e.target.value);
    dispatch(searchProduct(e.target.value));
  };
  return (
    <div>
      <WrapperHeader
        style={{
          justifyContent:
            isHiddenSearch && isHiddenCart ? "space-between" : "unset",
        }}
      >
        <Col span={5}>
          <WrapperTextHeader onClick={handleLogo}>HVIE-SHOP</WrapperTextHeader>
        </Col>
        {!isHiddenSearch && (
          <Col span={13}>
            <Search
              placeholder="Tên mặt hàng mà bạn muốn tìm kiếm"
              enterButton="Tìm Kiếm"
              size="large"
              onChange={onSearch}
            />
          </Col>
        )}

        <Col span={6} style={{ columnGap: "20px" }}>
          <Loading isPending={pending}>
            <WrapperHeaderAccount>
              {useAvatar ? (
                <img
                  src={useAvatar}
                  style={{
                    height: "40px",
                    width: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              ) : isHiddenCart && isHiddenSearch ? (
                <SettingOutlined style={{ fontSize: "30px" }} />
              ) : (
                <UserOutlined style={{ fontSize: "30px" }} />
              )}
              {user?.access_token ? (
                <>
                  <Popover content={content} trigger="click" open={isOpenPopup}>
                    <div style={{ cursor: "pointer" }} onClick={() => setIsOpenPopup((prev) => !prev)}>
                      {useName?.length ? useName : user?.email}
                    </div>
                  </Popover>
                </>
              ) : (
                <div
                  onClick={handleNavigateLogin}
                  style={{ cursor: "pointer" }}
                >
                  <span>Đăng nhập / Đăng kí</span>
                  <div>
                    <span>
                      Tài khoản
                      <CaretDownOutlined />
                    </span>
                  </div>
                </div>
              )}
              {!isHiddenCart && (
                <div style={{ marginLeft: "46px", cursor: "pointer" }} onClick={() => Navigate("/order")}>
                  <Badge count={order?.orderItems?.length} small>
                    <ShoppingCartOutlined style={{ fontSize: "32px", color: "white" }} />
                  </Badge>
                  <span>Giỏ hàng</span>
                </div>
              )}
            </WrapperHeaderAccount>
          </Loading>
        </Col>
      </WrapperHeader>
    </div>
  );
};

export default HeaderCompomment;
