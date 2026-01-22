import Input from "antd/es/input/Input";
import React from "react";

const InputComponentProduct = ({ size, placeholder, bordered, style, ...rests }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      variant={bordered}
      style={style}
      {...rests}
    />
  );
};

export default InputComponentProduct;
