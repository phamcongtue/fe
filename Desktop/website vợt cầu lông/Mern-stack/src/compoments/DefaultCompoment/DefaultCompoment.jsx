import React from "react";
import HeaderCompomment from "../HeaderCompoment/HeaderCompoment";

const DefaultCompoment = ({ children }) => {
  return (
    <div>
      <HeaderCompomment />
      {children}
    </div>
  );
};

export default DefaultCompoment;
