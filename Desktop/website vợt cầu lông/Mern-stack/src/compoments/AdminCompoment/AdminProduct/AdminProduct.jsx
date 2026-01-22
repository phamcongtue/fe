import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import TableCompoment from "../../TableCompoment/TableCompoment";
import InputComponentProduct from "../../InputCompoment/InputComponentProduct";
import { getBase64, renderOptions } from "../../../utils";
import * as productService from "../../../services/productService";
import { useMutationHooks } from "../../../hook/useMutationHook";
import Loading from "../../LoadingCompoment/Loading";
import * as message from "../../Message/Message";
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../../DrawerComponent/DrawerComponent";
import { useSelector } from "react-redux";
import ModalCompoment from "../../ModalCompoment/ModalCompoment";

const AdminProduct = () => {
  const { messageApi, contextHolder } = message.useCustomMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rowSelected, setRowSelected] = useState("");
  const [isOpenDrawer, setIsOpenDrawer] = useState(false);
  const [isPendingUpdate, setIsPendingUpdate] = useState(false);
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const searchInput = useRef(null);
  const user = useSelector((state) => state?.user);

  const initial = () => ({
    name: "",
    type: "",
    price: "",
    countInStock: "",
    description: "",
    rating: "",
    image: "",
    discount: "",
    newType: "",
  });
  const [stateProduct, setStateProduct] = useState(initial());
  const [stateProductDetails, setStateProductDetails] = useState(initial());

  const [form] = Form.useForm();
  const mutation = useMutationHooks((data) => {
    const { name, type, price, countInStock, description, rating, image, discount } =
      data;
    const res = productService.createProduct({
      name,
      type,
      price,
      countInStock,
      description,
      rating,
      image,
      discount,
    });
    return res;
  });

  const mutationUpdate = useMutationHooks((data) => {
    const { id, token, ...rests } = data;
    const res = productService.updateProduct(id, token, { ...rests });
    return res;
  });

  const mutationDeleted = useMutationHooks((data) => {
    const { id, token } = data;
    const res = productService.deleteProduct(id, token);
    return res;
  });

  const getAllProduct = async () => {
    const res = await productService.getAllProduct();
    return res;
  };

  const fetchDetailProduct = async (rowSelected) => {
    const res = await productService.getDetailsProduct(rowSelected);

    if (res?.data) {
      setStateProductDetails({
        name: res?.data?.name,
        type: res?.data?.type,
        price: res?.data?.price,
        countInStock: res?.data?.countInStock,
        description: res?.data?.description,
        rating: res?.data?.rating,
        image: res?.data?.image,
        discount: res?.data?.discount,
      });
    }
    setIsPendingUpdate(false);
  };

  useEffect(() => {
    if (rowSelected && isOpenDrawer) {
      setIsPendingUpdate(true);
      fetchDetailProduct(rowSelected);
    }
  }, [rowSelected, isOpenDrawer]);

  useEffect(() => {
    if (!isModalOpen) {
      form.setFieldsValue(stateProductDetails);
    } else {
      form.setFieldsValue(initial());
    }
  }, [form, stateProductDetails, isModalOpen]);

  const handleDetailProduct = () => {
    if (rowSelected) {
      setIsPendingUpdate(true);
      fetchDetailProduct(rowSelected);
    }
    setIsOpenDrawer(true);
  };
  const renderAction = () => {
    return (
      <div style={{ display: "flex", gap: "16px" }}>
        <EditOutlined
          onClick={handleDetailProduct}
          style={{ fontSize: "20px", color: "orange", cursor: "pointer" }}
        />
        <DeleteOutlined
          onClick={() => setIsModalOpenDelete(true)}
          style={{ fontSize: "20px", color: "red", cursor: "pointer" }}
        />
      </div>
    );
  };

  const { data, isPending, isSuccess, isError } = mutation;
  const {
    data: dataUpdated,
    isPending: isPendingUpdated,
    isSuccess: isSuccessUpdated,
    isError: isErrorUpdated,
  } = mutationUpdate;

  const {
    data: dataDeleted,
    isPending: isPendingDeleted,
    isSuccess: isSuccessDeleted,
    isError: isErrorDeleted,
  } = mutationDeleted;

  const queryProduct = useQuery({
    queryKey: ["product"],
    queryFn: getAllProduct,
  });
  const { isPending: isPendingProduct, data: product } = queryProduct;

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    // setSearchText('');
  };

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
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //     // <Highlighter
    //     //   highlightStyle={{
    //     //     backgroundColor: '#ffc069',
    //     //     padding: 0,
    //     //   }}
    //     //   searchWords={[searchText]}
    //     //   autoEscape
    //     //   textToHighlight={text ? text.toString() : ''}
    //     // />
    //   ) : (
    //     text
    //   ),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      sorter: (a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps("name"),
    },
    {
      title: "Price",
      dataIndex: "price",
      sorter: (a, b) => a.price - b.price,
      filters: [
        {
          text: ">= 50",
          value: ">=",
        },
        {
          text: "<= 50",
          value: "<=",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === ">=") {
          return record.price >= 50;
        }
        return record.price <= 50;
      },
    },
    {
      title: "Rating",
      dataIndex: "rating",
      sorter: (a, b) => a.rating - b.rating,
      filters: [
        {
          text: ">= 3",
          value: ">=",
        },
        {
          text: "<= 3",
          value: "<=",
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => {
        if (value === ">=") {
          return Number(record.rating) >= 3;
        }
        return Number(record.rating) <= 3;
      },
    },
    {
      title: "Type",
      dataIndex: "type",
    },
    {
      title: "Action",
      dataIndex: "Action",
      render: renderAction,
    },
  ];
  const dataTable =
    product?.data?.length &&
    product?.data?.map((productItem) => {
      return { ...productItem, key: productItem._id };
    });
  useEffect(() => {
    if (isSuccess && data?.status === "OK") {
      message.success("Thêm sản phẩm thành công", messageApi);
      handleCancel();
    } else if (isError) {
      message.error("Có lỗi xảy ra", messageApi);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isSuccessDeleted && dataDeleted?.status === "OK") {
      message.success("Xóa sản phẩm thành công", messageApi);
      handleCancelDelete();
    } else if (isErrorDeleted) {
      message.error("Có lỗi xảy ra", messageApi);
    }
  }, [isSuccessDeleted]);

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false);
  };

  const handleDeleteProduct = () => {
    mutationDeleted.mutate(
      { id: rowSelected, token: user?.access_token },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setStateProduct({
      name: "",
      type: "",
      price: "",
      countInStock: "",
      description: "",
      rating: "",
      image: "",
      discount: ""
    });
    form.resetFields();
  };
  const handleChangeSelect = (value) => {
    setStateProduct({
      ...stateProduct,
      type: value,
    });
  };
  const fetchAllTypeProduct = async () => {
    const res = await productService.getAllTypeProduct();
    return res;
  };
  const typeProduct = useQuery({
    queryKey: ["type-product"],
    queryFn: fetchAllTypeProduct,
  });
  const handleCloseDrawer = () => {
    setIsOpenDrawer(false);
    setStateProductDetails({
      name: "",
      price: "",
      description: "",
      rating: "",
      image: "",
      type: "",
      countInStock: "",
      discount: ""
    });
    form.resetFields();
  };
  //check
  const onFinish = (values) => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type:
        stateProduct.type === "add_type"
          ? stateProduct.newType
          : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount,
    };
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch();
      },
    });
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleOnChange = (e) => {
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnChangeDetails = (e) => {
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value,
    });
  };

  // check
  const handleAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image: file.preview,
    });
  };
  const handleChangeSelectDetails = (value) => {
    setStateProductDetails({
      ...stateProductDetails,
      type: value,
    });
  };
  const handleAvatarDetails = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image: file.preview,
    });
  };
  const onUpdateProduct = () => {
    const paramsUpdate = {
      name: stateProductDetails.name,
      price: stateProductDetails.price,
      description: stateProductDetails.description,
      rating: stateProductDetails.rating,
      image: stateProductDetails.image,
      type:
        stateProductDetails.type === "add_type"
          ? stateProductDetails.newType
          : stateProductDetails.type,
      countInStock: stateProductDetails.countInStock,
      discount: stateProductDetails.discount,
    };
    mutationUpdate.mutate(
      {
        id: rowSelected,
        token: user?.access_token,
        ...paramsUpdate,
      },
      {
        onSettled: () => {
          queryProduct.refetch();
        },
      }
    );
  };

  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === "OK") {
      message.success("Cập nhật sản phẩm thành công", messageApi);
      handleCloseDrawer();
    } else if (isErrorUpdated) {
      message.error("Có lỗi xảy ra", messageApi);
    }
  }, [isSuccessUpdated]);

  //Return Render AdminProduct
  return (
    <>
      {contextHolder}
      <div>
        <WrapperHeader>Quản lý sản phẩm</WrapperHeader>
        <div style={{ padding: "16px " }}>
          <Button
            style={{
              height: "150px",
              width: "150px",
              borderRadius: "6px",
              borderStyle: "dashed",
              borderWidth: "2px",
            }}
            onClick={() => setIsModalOpen(true)}
          >
            <PlusOutlined style={{ fontSize: "64px" }} />
          </Button>
        </div>
        <TableCompoment
          columns={columns}
          isPending={isPendingProduct}
          data={dataTable}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id);
              },
            };
          }}
        />
        <ModalCompoment
          forceRender
          title="Thêm mới sản phẩm"
          open={isModalOpen}
          onCancel={handleCancel}
          footer={null}
        >
          <Loading isPending={isPending}>
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.name}
                  onChange={handleOnChange}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <Select
                  name="type"
                  // defaultValue="lucy"
                  // style={{ width: 120 }}
                  value={stateProduct.type}
                  onChange={handleChangeSelect}
                  options={renderOptions(typeProduct?.data?.data)}
                />
              </Form.Item>
              {stateProduct.type === "add_type" && (
                <Form.Item
                  label="New type"
                  name="newType"
                  rules={[{ required: true, message: "Please input your type!" }]}
                >
                  <InputComponentProduct
                    value={stateProduct.newType}
                    onChange={handleOnChange}
                    name="newType"
                  />
                </Form.Item>
              )}

              <Form.Item
                label="CountInStock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your count in stock!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.countInStock}
                  onChange={handleOnChange}
                  name="countInStock"
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.price}
                  onChange={handleOnChange}
                  name="price"
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.description}
                  onChange={handleOnChange}
                  name="description"
                />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.rating}
                  onChange={handleOnChange}
                  name="rating"
                />
              </Form.Item>

              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount of product!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProduct.discount}
                  onChange={handleOnChange}
                  name="discount"
                />
              </Form.Item>

              {/* check */}
              <Form.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please select your image!",
                  },
                ]}
              >
                <div>
                  <WrapperUploadFile onChange={handleAvatar} maxCount={1}>
                    <Button>Select File</Button>
                  </WrapperUploadFile>
                  {stateProduct?.image && (
                    <img
                      src={stateProduct.image}
                      style={{
                        height: "120px",
                        width: "120px",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Add product
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </ModalCompoment>
        <DrawerComponent
          title="Chi tiết sản phẩm"
          isOpen={isOpenDrawer}
          width="60%"
          onClose={() => {
            setIsOpenDrawer(false);
          }}
        >
          <Loading isPending={isPendingUpdate || isPendingUpdated}>
            <Form
              name="basic"
              labelCol={{
                span: 6,
              }}
              wrapperCol={{
                span: 18,
              }}
              style={{
                maxWidth: 600,
              }}
              onFinish={onUpdateProduct}
              onFinishFailed={onFinishFailed}
              autoComplete="on"
              form={form}
            >
              <Form.Item
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: "Please input your name!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails["name"]}
                  onChange={handleOnChangeDetails}
                  name="name"
                />
              </Form.Item>

              <Form.Item
                label="Type"
                name="type"
                rules={[{ required: true, message: "Please input your type!" }]}
              >
                <Select
                  name="type"
                  // defaultValue="lucy"
                  // style={{ width: 120 }}
                  value={stateProductDetails.type}
                  onChange={handleChangeSelectDetails}
                  options={renderOptions(typeProduct?.data?.data)}
                />
              </Form.Item>
              {stateProductDetails.type === "add_type" && (
                <Form.Item
                  label="New type"
                  name="newType"
                  rules={[{ required: true, message: "Please input your type!" }]}
                >
                  <InputComponentProduct
                    value={stateProduct.newType}
                    onChange={handleOnChangeDetails}
                    name="newType"
                  />
                </Form.Item>
              )}

              <Form.Item
                label="CountInStock"
                name="countInStock"
                rules={[
                  {
                    required: true,
                    message: "Please input your count in stock!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails.countInStock}
                  onChange={handleOnChangeDetails}
                  name="countInStock"
                />
              </Form.Item>

              <Form.Item
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: "Please input your price!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails.price}
                  onChange={handleOnChangeDetails}
                  name="price"
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
                rules={[
                  {
                    required: true,
                    message: "Please input your description!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails.description}
                  onChange={handleOnChangeDetails}
                  name="description"
                />
              </Form.Item>

              <Form.Item
                label="Rating"
                name="rating"
                rules={[
                  {
                    required: true,
                    message: "Please input your rating!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails.rating}
                  onChange={handleOnChangeDetails}
                  name="rating"
                />
              </Form.Item>

              <Form.Item
                label="Discount"
                name="discount"
                rules={[
                  {
                    required: true,
                    message: "Please input your discount of product!",
                  },
                ]}
              >
                <InputComponentProduct
                  value={stateProductDetails.discount}
                  onChange={handleOnChangeDetails}
                  name="discount"
                />
              </Form.Item>

              {/* check */}
              <Form.Item
                label="Image"
                name="image"
                rules={[
                  {
                    required: true,
                    message: "Please select your image!",
                  },
                ]}
              >
                <div>
                  <WrapperUploadFile
                    onChange={handleAvatarDetails}
                    maxCount={1}
                  >
                    <Button>Select File</Button>
                  </WrapperUploadFile>
                  {stateProductDetails?.image && (
                    <img
                      src={stateProductDetails.image}
                      style={{
                        height: "120px",
                        width: "120px",
                        objectFit: "cover",
                      }}
                      alt="avatar"
                    />
                  )}
                </div>
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 18, span: 16 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  style={{ margin: "16px 0 0 36px" }}
                >
                  Apply
                </Button>
              </Form.Item>
            </Form>
          </Loading>
        </DrawerComponent>
        <ModalCompoment
          forceRender
          title="Xóa sản phẩm"
          open={isModalOpenDelete}
          onCancel={handleCancelDelete}
          onOk={handleDeleteProduct}
        >
          <Loading isPending={isPendingDeleted}>
            <div>Bạn có chắc xóa sản phẩm này không?</div>
          </Loading>
        </ModalCompoment>
      </div>
    </>
  );
};

export default AdminProduct;
