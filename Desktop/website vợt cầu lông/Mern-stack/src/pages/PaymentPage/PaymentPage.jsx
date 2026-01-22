import React, { useEffect, useMemo, useState } from 'react';
import Loading from '../../compoments/LoadingCompoment/Loading';
import ModalComponent from '../../compoments/ModalComponent/ModalComponent';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Form, Radio } from 'antd';
import { useMutationHooks } from '../../hook/useMutationHook';
import * as userService from "../../services/userService";
import * as OrderService from "../../services/orderService";
import { WrapperInfo, WrapperLeft } from '../OrderPage/style';
import { Label, WrapperRadio, WrapperRight, WrapperTotal } from './style';
import { convertPrice } from '../../utils';
import * as message from "../../compoments/Message/Message";
import ButtonComponent from '../../compoments/ButtonComponent/ButtonComponent';
import InputComponentProduct from '../../compoments/InputCompoment/InputComponentProduct';
import { removeAllOrderProduct } from '../../redux/slices/orderSlice';
import axios from "axios"




const PaymentPage = () => {
  const moment = require('moment');
  const { messageApi, contextHolder } = message.useCustomMessage();
  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [delivery, setDelivery] = useState("fast");
  const [payment, setPayment] = useState("later_money");
  const [form] = Form.useForm();
  const dispatch = useDispatch();

  const [isOpenModalUpdateInfo, setIsOpenModalUpdateInfo] = useState(false);
  const [stateUserDetails, setStateUserDetails] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
  });


  useEffect(() => {
    form.setFieldsValue(stateUserDetails);
  }, [form, stateUserDetails]);

  useEffect(() => {
    if (isOpenModalUpdateInfo) {
      setStateUserDetails({
        city: user?.city,
        name: user?.name,
        address: user?.address,
        phone: user?.phone,
      });
    }
  }, [isOpenModalUpdateInfo]);

  const handleChangeAddress = () => {
    setIsOpenModalUpdateInfo(true);
  };

  const priceMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      return total + cur.price * cur.amount;
    }, 0);
    return result;
  }, [order]);

  const priceDiscountMemo = useMemo(() => {
    const result = order?.orderItemsSelected?.reduce((total, cur) => {
      const totalDiscount = cur.discount ? cur.discount : 0;
      return total + (priceMemo * (totalDiscount * cur.amount)) / 100;
    }, 0);
    if (Number(result)) {
      return Math.ceil(result);
    }
    return 0;
  }, [order]);

  const diliveryPriceMemo = useMemo(() => {
    if (priceMemo > 200000) {
      return 10000;
    } else if (priceMemo === 0) {
      return 0;
    } else {
      return 20000;
    }
  }, [priceMemo]);

  const totalPriceMemo = useMemo(() => {
    return Math.ceil(
      Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
    );
  }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);


  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = userService.updateUser(id, { ...rests }, token);
    return res;
  });
  const mutationAddOrder = useMutationHooks((data) => {
    const { token, ...rests } = data;
    const res = OrderService.createOrder({ ...rests }, token);
    return res;
  });
  const { data: dataAdd, isPending: isPendingAddOrder, isSuccess, isError } = mutationAddOrder;

  const { isLoading, data } = mutationUpdate;
  useEffect(() => {
    if (isSuccess && dataAdd?.status === "OK") {
      const arrayOrder = [];
      order?.orderItemsSelected?.forEach((element) => {
        arrayOrder.push(element.product);
      });
      dispatch(removeAllOrderProduct({ listChecked: arrayOrder }));
      message.success("Đặt hàng thành công", messageApi);
      navigate("/orderSuccess", {
        state: {
          delivery,
          payment,
          orders: order?.orderItemsSelected,
          totalPriceMemo: totalPriceMemo,
        },
      });
    } else if (isError) {
      message.error("Đặt hàng không thành công", messageApi);
    }
  }, [isSuccess, isError]);

  const handleDilivery = (e) => {
    setDelivery(e.target.value);
    localStorage.setItem('delivery', JSON.stringify(e.target.value));
  }
  const handlePayment = (e) => {
    setPayment(e.target.value);
  }
  const handleNavigateVnPayPage = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_KEY}/checkout/create_payment_url`, {
        amount: totalPriceMemo,
        bankCode: '',
        orderDescription: "Đơn hàng của bạn",
        orderType: payment,
        language: "vn",
      });
      if (response.data) {
        // Chuyển hướng đến URL thanh toán
        window.location.href = response.data.paymentUrl; // Giả sử bạn nhận được URL thanh toán từ backend
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const handleAddOrder = () => {
    let date = new Date();
    let orderId = "DH" + moment(date).format('YYYYMMDDHHmmss');
    if (
      user?.access_token &&
      order?.orderItemsSelected &&
      user?.name &&
      user?.address &&
      user?.phone &&
      user?.city &&
      priceMemo &&
      user?.id
    ) {
      mutationAddOrder.mutate({
        token: user?.access_token,
        orderCode: orderId,
        orderItems: order?.orderItemsSelected,
        fullName: user?.name,
        address: user?.address,
        phone: user?.phone,
        city: user?.city,
        paymentMethod: payment,
        shippingMethod: delivery,
        itemsPrice: priceMemo,
        ShippingPrice: diliveryPriceMemo,
        totalPrice: totalPriceMemo,
        user: user?.id,
        email: user?.email,
      });
    }
  }
  const handleCancelUpdate = () => {
    setStateUserDetails({
      name: "",
      email: "",
      phone: "",
      isAdmin: false,
    });
    form.resetFields();
    setIsOpenModalUpdateInfo(false);
  }

  const handleUpdateInforUser = () => { }
  const handleOnchangeDetails = () => { }


  return (
    <>
      {contextHolder}
      <div style={{ background: "#f5f5fa", with: "100%", height: "100vh" }}>
        <Loading isPending={isPendingAddOrder}>
          <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
            <h3>Thanh toán</h3>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <WrapperLeft>
                <WrapperInfo>
                  <div>
                    <Label>Chọn phương thức giao hàng</Label>
                    <WrapperRadio onChange={handleDilivery} value={delivery}>
                      <Radio value="fast">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          FAST
                        </span>
                        - Giao hàng tiết kiệm
                      </Radio>
                      <Radio value="gojek">
                        <span style={{ color: "#ea8500", fontWeight: "bold" }}>
                          GO_JEK
                        </span>
                        - Giao hàng tiết kiệm
                      </Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
                <WrapperInfo>
                  <div>
                    <Label>Chọn phương thức thanh toán</Label>
                    <WrapperRadio onChange={handlePayment} value={payment}>
                      <Radio value="later_money">
                        Thanh toán tiền mặt khi nhận hàng
                      </Radio>
                      <Radio value="VnPay"> Thanh toán tiền bằng VnPay</Radio>
                    </WrapperRadio>
                  </div>
                </WrapperInfo>
              </WrapperLeft>
              <WrapperRight>
                <div style={{ width: "80%" }}>
                  <WrapperInfo>
                    <div>
                      <span>Địa chỉ: </span>
                      <span style={{ fontWeight: "bold" }}>
                        {`${user?.address} - ${user?.city}`}{" "}
                      </span>
                      <br />
                      <span
                        onClick={handleChangeAddress}
                        style={{ color: "blue", cursor: "pointer" }}
                      >
                        Thay đổi địa chỉ
                      </span>
                    </div>
                  </WrapperInfo>
                  <WrapperInfo>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Tạm tính</span>
                      <span
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(priceMemo)}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Giảm giá</span>
                      <span
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(Math.ceil(priceDiscountMemo))}
                      </span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <span>Phí giao hàng</span>
                      <span
                        style={{
                          color: "#000",
                          fontSize: "14px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(diliveryPriceMemo)}
                      </span>
                    </div>
                  </WrapperInfo>
                  <WrapperTotal>
                    <span>Tổng tiền</span>
                    <span style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          color: "rgb(254, 56, 52)",
                          fontSize: "24px",
                          fontWeight: "bold",
                        }}
                      >
                        {convertPrice(Math.ceil(totalPriceMemo))}
                      </span>
                      <span style={{ color: "#000", fontSize: "11px" }}>
                        (Đã bao gồm VAT nếu có)
                      </span>
                    </span>
                  </WrapperTotal>
                </div>
                {payment === "VnPay" ? (
                  <ButtonComponent
                    onClick={() => handleNavigateVnPayPage()}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "220px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    textbutton={"Thanh Toán bằng VnPay"}
                    styletextbutton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                ) : (
                  <ButtonComponent
                    onClick={() => handleAddOrder()}
                    size={40}
                    styleButton={{
                      background: "rgb(255, 57, 69)",
                      height: "48px",
                      width: "220px",
                      border: "none",
                      borderRadius: "4px",
                    }}
                    textbutton={"Đặt hàng"}
                    styletextbutton={{
                      color: "#fff",
                      fontSize: "15px",
                      fontWeight: "700",
                    }}
                  ></ButtonComponent>
                )}
              </WrapperRight>
            </div>
          </div>
          <ModalComponent
            title="Cập nhật thông tin giao hàng"
            open={isOpenModalUpdateInfo}
            onCancel={handleCancelUpdate}
            onOk={handleUpdateInforUser}
          >
            {/* <Loading isLoading={isLoading}> */}
            <Form
              name="basic"
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 20 }}
              // onFinish={onUpdateUser}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[{ required: true, message: "Please input your name!" }]}
              >
                <InputComponentProduct
                  value={stateUserDetails["name"]}
                  onChange={handleOnchangeDetails}
                  name="name"
                />
              </Form.Item>
              <Form.Item
                label="City"
                name="city"
                rules={[{ required: true, message: "Please input your city!" }]}
              >
                <InputComponentProduct
                  value={stateUserDetails["city"]}
                  onChange={handleOnchangeDetails}
                  name="city"
                />
              </Form.Item>
              <Form.Item
                label="Phone"
                name="phone"
                rules={[
                  { required: true, message: "Please input your  phone!" },
                ]}
              >
                <InputComponentProduct
                  value={stateUserDetails.phone}
                  onChange={handleOnchangeDetails}
                  name="phone"
                />
              </Form.Item>

              <Form.Item
                label="Address"
                name="address"
                rules={[
                  { required: true, message: "Please input your  address!" },
                ]}
              >
                <InputComponentProduct
                  value={stateUserDetails.address}
                  onChange={handleOnchangeDetails}
                  name="address"
                />
              </Form.Item>
            </Form>
          </ModalComponent>
        </Loading>
      </div>
    </>
  );
};

export default PaymentPage;
