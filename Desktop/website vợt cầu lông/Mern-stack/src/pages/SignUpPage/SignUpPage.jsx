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
import { useNavigate } from "react-router-dom";
import * as userService from "../../services/userService";
import { useMutationHooks } from "../../hook/useMutationHook";
import Loading from "../../compoments/LoadingCompoment/Loading";
import * as message from "../../compoments/Message/Message";

const SignUpPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { messageApi, contextHolder } = message.useCustomMessage();
  const navigate = useNavigate();
  const handleNavigateSignIn = () => {
    navigate("/sign-in");
  };

  const handleSignUp = () => {
    mutation.mutate({ email, password, confirmPassword });
  };
  const handleOnChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleOnChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleOnChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
  };

  const mutation = useMutationHooks((data) => userService.signUpUser(data));
  const { data, isSuccess, isError } = mutation;

  console.log(isSuccess)
  console.log(isError)
  useEffect(() => {
    if (isSuccess && data?.status !== 'ERR') {
      message.success("Đăng ký thành công", messageApi);
      setTimeout(() => {
        handleNavigateSignIn();
      }, 1500);
    } else if (isError) {
      message.error("Đăng ký không thành công", messageApi);
    }
  }, [isSuccess, isError]);

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
            <p>Đăng ký tạo tài khoản:</p>
            <div>
              <InputFormCompoment
                style={{ marginBottom: "10px" }}
                placeholder="abc@gmail.com"
                value={email}
                onChange={handleOnChangeEmail}
              />
              <Input.Password
                placeholder="Password"
                style={{ marginBottom: "10px" }}
                value={password}
                onChange={handleOnChangePassword}
                iconRender={(visible) =>
                  visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                }
              />
              <Input.Password
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={handleOnChangeConfirmPassword}
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
                disabled={!email.length || !password.length || !confirmPassword}
                onClick={handleSignUp}
                type="primary"
                style={{ backgroundColor: "#ee4d2d", width: "100%" }}
                size="large"
              >
                Đăng kí
              </Button>
            </Loading>
            <p>
              Bạn đã có tài khoản?
              <WrapperTextLink onClick={handleNavigateSignIn}>
                Đăng nhập
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
      <FooterCompoment />
    </>
  );
};

export default SignUpPage;
