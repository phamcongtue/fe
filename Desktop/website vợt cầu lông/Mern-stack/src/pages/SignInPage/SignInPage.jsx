import React, { useEffect, useState } from "react";
import {
  WrapperContentLeft,
  WrapperContentRight,
  WrapperTextLink,
} from "./style";
import InputFormCompoment from "../../compoments/InputFormCompoment/InputFormCompoment";
import { EyeInvisibleOutlined, EyeOutlined } from "@ant-design/icons";
import { Button, Image, Input } from "antd";
import imageLogo from "../../assets/images/SignIn.jpg";
import FooterCompoment from "../../compoments/FooterCompoment/FooterCompoment";
import { useLocation, useNavigate } from "react-router-dom";
import * as userService from "../../services/userService";
import { useMutationHooks } from "../../hook/useMutationHook";
import Loading from "../../compoments/LoadingCompoment/Loading";
import * as message from "../../compoments/Message/Message";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slices/userSlice";

const SignInPage = () => {
  const [email, setEmail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const { messageApi, contextHolder } = message.useCustomMessage();
  const dispatch = useDispatch();

  //setEmail for input Email SignIn
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  //setPassWord for input Password SignIn
  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  //Save information user with const mutation
  const handleSignIn = () => {
    mutation.mutate({
      email,
      password,
    });
  };

  //custom hook (useMutationHooks) return data give logInUser in userService
  const mutation = useMutationHooks((data) => userService.logInUser(data));
  //Monitor the status of the APi
  const { data, isSuccess, isError } = mutation;

  // hook useEffect
  useEffect(() => {
    if (isSuccess && data?.status !== "ERR") {
      if (location?.state) {
        setTimeout(() => {
          Navigate(location?.state);
        }, 1500);
      } else {
        setTimeout(() => {
          Navigate("/"); // navigate homePage
        }, 1500);
      }
      message.success("Đăng nhập thành công", messageApi);

      localStorage.setItem("access_token", JSON.stringify(data?.access_token)); // save access_token in local storage
      if (data?.access_token) {
        const decoded = jwtDecode(data?.access_token);
        if (decoded?.id) {
          handleGetDetailsUser(decoded?.id, data?.access_token);
        }
      }
    } else if (isError) {
      // check status Error
      message.error("Có lỗi xảy ra", messageApi);
    }
  }, [isSuccess, isError, data]); // compare change in value

  // update status login
  const handleGetDetailsUser = async (id, token) => {
    const res = await userService.getDetailsUser(id, token);
    dispatch(updateUser({ ...res?.data, access_token: token }));
  };

  // navigate SignUpPage
  const Navigate = useNavigate();
  const handleNavigateSignUp = () => {
    Navigate("/sign-up");
  };

  return (
    <>
      {contextHolder}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgb(0,0,0,0.53)",
          height: "100vh",
        }}
      >
        <div
          style={{
            width: "800px",
            height: "445px",
            borderRadius: "8px",
            backgroundColor: "#fff",
            display: "flex",
          }}
        >
          <WrapperContentLeft>
            <h1>Xin chào</h1>
            <p>Đăng nhập và tạo tài khoản:</p>
            <div>
              <InputFormCompoment
                style={{ marginBottom: "10px" }}
                value={email}
                onChange={handleOnChangeEmail}
                placeholder="abc@gmail.com"
              />
              <Input.Password
                placeholder="Password"
                value={password}
                onChange={handleOnChangePassword}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
            </div>
            {data?.status === "ERR" && (
              <span style={{ color: "red" }}>{data?.message}</span>
            )}
            <Loading isPending={mutation.isPending}>
              <Button
                disabled={!email.length || !password.length}
                onClick={handleSignIn}
                type="primary"
                style={{ backgroundColor: "#ee4d2d", width: "100%" }}
                size="large"
              >
                Đăng nhập
              </Button>
            </Loading>
              <WrapperTextLink>Quên mật khẩu?</WrapperTextLink>
            <p>
              Chưa có tài khoản?
              <WrapperTextLink
                onClick={handleNavigateSignUp}
                style={{ cursor: "pointer" }}
              >
                Tạo tài khoản
              </WrapperTextLink>
            </p>
          </WrapperContentLeft>
          <WrapperContentRight>
            <Image
              src={imageLogo}
              alt="Hinh anh"
              preview={false}
              width="203px"
              height="auto"
            />
            <h4>Mua sắm tại HVIESHOP</h4>
          </WrapperContentRight>
        </div>
      </div>
    </>
  );
};

export default SignInPage;
