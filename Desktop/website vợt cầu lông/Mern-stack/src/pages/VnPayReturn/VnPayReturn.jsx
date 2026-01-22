import React, { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useMutationHooks } from '../../hook/useMutationHook';
import { removeAllOrderProduct } from '../../redux/slices/orderSlice';
import * as OrderService from "../../services/orderService";
import { setPaymentStatus } from '../../redux/slices/orderSlice';
import Loading from '../../compoments/LoadingCompoment/Loading';

const VnPayReturn = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const order = useSelector((state) => state.order);
    const user = useSelector((state) => state.user);


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
            return result;
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
        return (
            Number(priceMemo) - Number(priceDiscountMemo) + Number(diliveryPriceMemo)
        );
    }, [priceMemo, priceDiscountMemo, diliveryPriceMemo]);

    const retrievedValue = localStorage.getItem('delivery');
    // Nếu giá trị là một chuỗi, bạn có thể sử dụng trực tiếp
    const deliveryValue = JSON.parse(retrievedValue);
    const mutationAddOrder = useMutationHooks((data) => {
        const { token, ...rests } = data;
        const res = OrderService.createOrder({ ...rests }, token);
        return res;
    });
    const { data: dataAdd, isPending: isPendingAddOrder, isSuccess, isError } = mutationAddOrder;

    useEffect(() => {
        const fetchPaymentResult = async () => {
            try {
                // Lấy query parameters từ URL
                const params = location.search;

                // Gửi yêu cầu đến backend để xác thực chữ ký
                const response = await axios.get(`${process.env.REACT_APP_API_KEY}/checkout/vnpay_return${params}`);
                console.log(response.data)
                // Kiểm tra kết quả trả về từ backend
                if (response.data.success) {
                    mutationAddOrder.mutate({
                        token: user?.access_token,
                        orderCode: response.data.orderCode,
                        orderItems: order?.orderItemsSelected,
                        fullName: user?.name,
                        address: user?.address,
                        phone: user?.phone,
                        city: user?.city,
                        paymentMethod: "VnPay",
                        shippingMethod: deliveryValue || "fast",
                        itemsPrice: priceMemo,
                        ShippingPrice: diliveryPriceMemo,
                        totalPrice: totalPriceMemo,
                        user: user?.id,
                        email: user?.email,
                        isPaid: true
                    });

                } else {
                    // Chuyển hướng đến trang thất bại
                    navigate('/orderFailure', { state: { responseCode: response.data.responseCode } });
                }
            } catch (error) {
                console.error("Error fetching payment result:", error);
                // Xử lý lỗi nếu cần
                navigate('/orderFailure', { state: { responseCode: 'Error' } });
            }
        };

        fetchPaymentResult();
    }, [location.search, navigate, user, order]);
    useEffect(() => {
        if (isSuccess && dataAdd?.status === "OK") {
            // dispatch(setPaymentStatus({ isPaid: true}))
            const arrayOrder = [];
            order?.orderItemsSelected?.forEach((element) => {
                arrayOrder.push(element.product);
            });
            dispatch(removeAllOrderProduct({ listChecked: arrayOrder }));
            // Chuyển hướng đến trang thành công
            navigate('/orderSuccess', {
                state: {
                    delivery: deliveryValue,
                    payment: "VnPay",
                    orders: order?.orderItemsSelected,
                    totalPriceMemo: totalPriceMemo
                }
            });
        }
    }, [isSuccess, isError]);
    return (
        <Loading isPending={isPendingAddOrder}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',  
                alignItems: 'center',      
                height: '100vh',
            }}>
                <h2>Đang xử lý thanh toán...</h2>
            </div>
        </Loading>
    );
};

export default VnPayReturn;