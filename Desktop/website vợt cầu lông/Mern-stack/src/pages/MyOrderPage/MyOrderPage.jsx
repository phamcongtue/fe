import React, { useEffect } from 'react';
import * as orderService from "../../services/orderService";
import { useQuery } from '@tanstack/react-query';
import Loading from '../../compoments/LoadingCompoment/Loading';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonComponent from "../../compoments/ButtonComponent/ButtonComponent";
import { WrapperContainer, WrapperFooterItem, WrapperHeaderItem, WrapperItemOrder, WrapperListOrder, WrapperStatus } from './style';
import { convertPrice } from "../../utils";
import { useMutationHooks } from '../../hook/useMutationHook';
import * as message from "../../compoments/Message/Message";


const MyOrderPage = () => {
    const location = useLocation();
    const { state } = location;
    const navigate = useNavigate();
    const { messageApi, contextHolder } = message.useCustomMessage();

    const fetchMyOrder = async () => {
        const res = await orderService.getOrderByUserId(state?.id, state?.token);
        return res.data;
    };

    const queryOrder = useQuery({
        queryKey: ["orders"],
        queryFn: fetchMyOrder,
        enabled: Boolean(state?.id && state?.token),
    });

    const { isPending, data } = queryOrder;
    console.log("data: ", data)

    const handleDetailsOrder = (id) => {
        navigate(`/details-order/${id}`, {
            state: {
                token: state?.token,
            },
        });
    };
    const mutation = useMutationHooks((data) => {
        const { id, token, orderItems } = data;
        const res = orderService.cancelOrder(id, token, orderItems);
        return res;
    });
    const handleCancelOrder = (order) => {
        mutation.mutate(
            { id: order._id, token: state?.token, orderItems: order?.orderItems },
            {
                onSuccess: () => {
                    queryOrder.refetch();
                },
            }
        );
    }
    const {
        isPending: isPendingCancel,
        isSuccess: isSuccessCancel,
        isError: isErrorCancel,
        data: dataCancel,
    } = mutation;

    useEffect(() => {
        if (isSuccessCancel && dataCancel?.status === "OK") {
            message.success("Hủy đơn hàng thành công!", messageApi);
        } else if (isErrorCancel) {
            message.error("Có lỗi sảy ra !", messageApi);
        }
    }, [isErrorCancel, isSuccessCancel]);

    const renderProduct = (orderItems) => {
        return orderItems?.map((item) => {
            return (
                <WrapperHeaderItem key={item?._id}>
                    <img
                        src={item?.image}
                        style={{
                            width: "70px",
                            height: "70px",
                            objectFit: "cover",
                            border: "1px solid rgb(238, 238, 238)",
                            padding: "2px",
                        }}
                    />
                    <div
                        style={{
                            width: 260,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            marginLeft: "10px",
                        }}
                    >
                        {item?.name}
                    </div>
                    <span
                        style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
                    >
                        Số lượng: {item?.amount}
                    </span>
                    
                    <span
                        style={{ fontSize: "13px", color: "#242424", marginLeft: "auto" }}
                    >
                        {convertPrice(item?.price)}
                    </span>
                </WrapperHeaderItem>
            );
        });
    };

    return (
        <>
            {contextHolder}
            <Loading isPending={isPending || isPendingCancel}>
                <WrapperContainer>
                    <div style={{ height: "100%", width: "1270px", margin: "0 auto" }}>
                        <WrapperListOrder>
                            <div style={{ marginLeft: "80px" }}><h4>Đơn hàng của tôi</h4></div>
                            {data?.map((order) => {
                                console.log("data", data)
                                return (
                                    <WrapperItemOrder key={order?._id}>
                                        <WrapperStatus>
                                            <span style={{ fontSize: "14px", fontWeight: "bold" }}>
                                                Trạng thái
                                            </span>
                                            <div>
                                                <span style={{ color: "rgb(255, 66, 78)" }}>
                                                    Giao hàng:
                                                </span>
                                                {`${order.isDelivered ? "Đã giao hàng" : "Chưa giao hàng"}`}
                                            </div>
                                            <div>
                                                <span style={{ color: "rgb(255, 66, 78)" }}>
                                                    Thanh toán:
                                                </span>
                                                {`${order?.isPaid ? "Đã thanh toán" : "Chưa thanh toán"}`}
                                            </div>
                                        </WrapperStatus>
                                        {renderProduct(order?.orderItems)}
                                        <WrapperFooterItem>
                                            <div>
                                                <span style={{ color: "rgb(255, 66, 78)" }}>
                                                    Tổng tiền:
                                                </span>
                                                <span
                                                    style={{
                                                        fontSize: "13px",
                                                        color: "rgb(56, 56, 61)",
                                                        fontWeight: 700,
                                                    }}
                                                >
                                                    {convertPrice(Math.ceil(order?.totalPrice))}
                                                </span>
                                            </div>
                                            <div style={{ display: "flex", gap: "10px" }}>
                                                <ButtonComponent
                                                    onClick={() => handleCancelOrder(order)}
                                                    size={40}
                                                    styleButton={{
                                                        height: "36px",
                                                        border: "1px solid rgb(11, 116, 229)",
                                                        borderRadius: "4px",
                                                    }}
                                                    textbutton={"Hủy đơn hàng"}
                                                    styletextbutton={{
                                                        color: "rgb(11, 116, 229)",
                                                        fontSize: "14px",
                                                    }}
                                                ></ButtonComponent>
                                                <ButtonComponent
                                                    onClick={() => handleDetailsOrder(order?._id)}
                                                    size={40}
                                                    styleButton={{
                                                        height: "36px",
                                                        border: "1px solid rgb(11, 116, 229)",
                                                        borderRadius: "4px",
                                                    }}
                                                    textbutton={"Xem chi tiết"}
                                                    styletextbutton={{
                                                        color: "rgb(11, 116, 229)",
                                                        fontSize: "14px",
                                                    }}
                                                ></ButtonComponent>
                                            </div>
                                        </WrapperFooterItem>
                                    </WrapperItemOrder>
                                );
                            })}
                        </WrapperListOrder>
                    </div>
                </WrapperContainer>
            </Loading>
        </>
    );
}

export default MyOrderPage;