import React, { useEffect, useState } from "react";
import {
  WrapperContentProfile,
  WrapperHeader,
  WrapperHeaderProfile,
} from "./style";
import {
  UserOutlined,
  PhoneOutlined,
  HomeOutlined,
  UploadOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Button, Input, Upload } from "antd";
import { ButtonBuyProduct } from "../../compoments/ProductDetailsCompoment/style";
import { useDispatch, useSelector } from "react-redux";
import * as userService from "../../services/userService";
import { useMutationHooks } from "../../hook/useMutationHook";
import Loading from "../../compoments/LoadingCompoment/Loading";
import * as message from "../../compoments/Message/Message";
import { updateUser } from "../../redux/slices/userSlice";
import { getBase64 } from "../../utils";

const ProfilePage = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  useEffect(() => {
    setName(user?.name);
    setEmail(user?.email);
    setPhone(user?.phone);
    setAddress(user?.address);
    setAvatar(user?.avatar);
  }, [user]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [avatar, setAvatar] = useState("");
  const [error, setError] = useState(""); // Trạng thái để theo dõi lỗi

  const mutation = useMutationHooks((data) => {
    const { id, access_token, ...rests } = data;
    userService.updateUser(id, rests, access_token);
  });
  const { data, isPending, isSuccess, isError } = mutation;

  const handleName = (e) => {
    setName(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handlePhone = (e) => {
    setPhone(e.target.value);
  };
  const handleAddress = (e) => {
    setAddress(e.target.value);
  };
  const handleAvatar = async ({ fileList }) => {
    const file = fileList[0];
    if (!file.url?.length && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setAvatar(file.preview);
  };

  const handleUpdate = () => {
    // Kiểm tra các ô input có trống hay không
    if (!name || !email || !phone || !address) {
      setError("Tất cả các trường đều phải được điền.");
      return;
    }
    setError(""); // Reset lỗi nếu không có lỗi
    mutation.mutate({
      id: user?.id,
      email,
      name,
      phone,
      address,
      avatar,
      access_token: user?.access_token,
    });
  };

  const { messageApi, contextHolder } = message.useCustomMessage();

  useEffect(() => {
    if (isSuccess) {
      message.success("Cập nhật thành công", messageApi);
      const timer = setTimeout(() => {
        handleGetDetailsUser(user?.id, user?.access_token);
        window.location.reload(); // Tự động reload trang
      }, 500); // 1 giây
      return () => clearTimeout(timer);
    } else if (isError) {
      message.error("Có lỗi xảy ra", messageApi);
    }
  }, [isSuccess, isError]);

  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  return (
    <>
      {contextHolder}
      <div style={{ width: "1270px", margin: "0 auto" }}>
        <WrapperHeaderProfile>Thông tin người dùng </WrapperHeaderProfile>
        <Loading isPending={isPending}>
          <WrapperContentProfile>
            {error && <div style={{ color: 'red' }}>{error}</div>} {/* Hiển thị thông báo lỗi */}
            <div>
              <span>Name</span>
              <Input
                onChange={handleName}
                value={name}
                size="large"
                placeholder="Name user"
                prefix={<SmileOutlined />}
              />
            </div>
            <div>
              <span>Email</span>
              <Input
                onChange={handleEmail}
                value={email}
                size="large"
                placeholder="Email user"
                prefix={<UserOutlined />}
              />
            </div>
            <div>
              <span>Phone</span>
              <Input
                onChange={handlePhone}
                value={phone}
                size="large"
                placeholder="Phone user"
                prefix={<PhoneOutlined />}
              />
            </div>
            <div>
              <span>Address</span>
              <Input
                onChange={handleAddress}
                value={address}
                size="large"
                placeholder="Address user"
                prefix={<HomeOutlined />}
              />
            </div>
            <div>
              <span>Avatar</span>
              <br />
              <Upload onChange={handleAvatar} maxCount={1}>
                <Button icon={<UploadOutlined />}>Select File</Button>
              </Upload>
              {avatar && (
                <img
                  src={avatar}
                  style={{
                    height: "120px",
                    width: "120px",
                    objectFit: "cover",
                  }}
                  alt="avatar"
                />
              )}
            </div>
            <ButtonBuyProduct
              className="btnBuyNow"
              onClick={handleUpdate}
              disabled={mutation.isPending}
            >
              Cập nhật thông tin người dùng
            </ButtonBuyProduct>
          </WrapperContentProfile>
        </Loading>
      </div>
    </>
  );
};

export default ProfilePage;
