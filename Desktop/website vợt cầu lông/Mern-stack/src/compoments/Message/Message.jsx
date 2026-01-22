import React from "react";
import { message } from "antd";

const useCustomMessage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  return { messageApi, contextHolder };
};

const success = (mes = "Success", messageApi) => {
  messageApi.open({
    type: "success",
    content: mes,
  });
};

const error = (mes = "Error", messageApi) => {
  messageApi.open({
    type: "error",
    content: mes,
  });
};

const warning = (mes = "Warning", messageApi) => {
  messageApi.open({
    type: "warning",
    content: mes,
  });
};

export { useCustomMessage, success, error, warning };
