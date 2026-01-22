import React, { useState, useEffect, useRef } from "react";
import { WrapperHeader } from "./style.js";
import { Button, Form, Space } from "antd";
import { convertPrice, getBase64 } from "../../../utils.js";
import { useQuery } from "@tanstack/react-query";
import {
  EditOutlined,
  DeleteOutlined,
  SearchOutlined
} from "@ant-design/icons";
import * as userService from "../../../services/userService.js";
import TableCompoment from "../../TableCompoment/TableCompoment.jsx";
import ModalCompoment from "../../ModalCompoment/ModalCompoment.jsx";
import Loading from "../../LoadingCompoment/Loading.jsx";
import { WrapperUploadFile } from "./style.js";
import InputComponentProduct from "../../InputCompoment/InputComponentProduct.jsx";
import DrawerComponent from "../../DrawerComponent/DrawerComponent.js";
import * as message from "../../Message/Message.jsx";
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../../hook/useMutationHook.js";
import * as OrderService from "../../../services/orderService.js";


const AdminOrder = () => {
  const [rowSelected, setRowSelected] = useState("");
  const { messageApi, contextHolder } = message.useCustomMessage();
  const searchInput = useRef(null);

  const user = useSelector((state) => state?.user);


  const getAllOrderUser = async () => {
    const res = await OrderService.getAllOrderUser(user?.access_token);
    return res;
  };
  const queryOrder = useQuery({ queryKey: ["orders"], queryFn: getAllOrderUser });
  const { isPending: isPendingOrders, data: orders } = queryOrder;

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponentProduct
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
  });
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };
  const columns = [
    {
      title: "userName",
      dataIndex: "userName",
      sorter: (a, b) => a.userName.length - b.userName.length,
      ...getColumnSearchProps("userName"),
    },
    {
      title: "phone",
      dataIndex: "phone",
      sorter: (a, b) => a.phone.length - b.phone.length,
      ...getColumnSearchProps("phone"),
    },
    {
      title: "Address",
      dataIndex: "address",
      sorter: (a, b) => a.address.length - b.address.length,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      sorter: (a, b) => a.totalPrice - b.totalPrice,
    },
    {
      title: "Thanh toán",
      dataIndex: "isPaid",
      sorter: (a, b) => a.isPaid - b.isPaid,
      filters: [
        {
          text: "VnPay",
          value: "VnPay",
        },
        {
          text: "Tiền mặt",
          value: "Tiền mặt",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === "VnPay") {
          return record.isPaid === "VnPay";
        }
        return record.isPaid === "Tiền mặt";
      },
      
    },
    {
      title: "Trạng thái",
      dataIndex: "isDelivered",
      sorter: (a, b) => a.isDelivered - b.isDelivered,
      filters: [
        {
          text: "Đã giao",
          value: "Đã giao",
        },
        {
          text: "Chưa giao",
          value: "Chưa giao",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === "Chưa giao") {
          return record.isDelivered === "Chưa giao";
        }
        return record.isDelivered === "Đã giao";
      },
    },
    {
      title: "Vận chuyển",
      dataIndex: "shippingMethod",
      sorter: (a, b) => a.isDelivered - b.isDelivered,
    },
  ];
  const dataTable =
    orders?.data?.length &&
    orders?.data?.map((order) => {
      console.log("order", order);
      return {
        ...order,
        key: order._id,
        userName: order?.shippingAddress?.fullName,
        phone: order?.shippingAddress?.phone,
        address: order?.shippingAddress?.address,
        totalPrice: convertPrice(order?.totalPrice),
        isPaid: order?.isPaid ? "VnPay" : "Tiền mặt",
        isDelivered: order?.isDelivered ? "Đã giao" : "Chưa giao",
        shippingMethod: order?.shippingMethod,
      };
    });




  return (
    <>{contextHolder}
      <div>
        <WrapperHeader>Quản lý đơn hàng</WrapperHeader>
        <div style={{ marginTop: "20px" }}>
          <TableCompoment
            columns={columns}
            isPending={isPendingOrders}
            data={dataTable}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setRowSelected(record._id);
                },
              };
            }}
          />
        </div>
      </div>
    </>
  );

};
export default AdminOrder;
