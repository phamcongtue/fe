import React from "react";
import {
  WrapperLabelText,
  WrapperTextContent,
  WrapperTextValue,
} from "./style";
import { Checkbox, Rate } from "antd";

const NavbarCompoment = () => {
  const HandleCheckbox = () => {};
  const renderContent = (type, options) => {
    switch (type) {
      case "text":
        return options.map((option) => {
          return <WrapperTextValue>{option}</WrapperTextValue>;
        });
      case "checkbox":
        return (
          <Checkbox.Group
            style={{ width: "100%", display: "flex", flexDirection: "column" }}
            onChange={HandleCheckbox}
          >
            {options.map((option) => {
              return <Checkbox value={option.value}>{option.label}</Checkbox>;
            })}
          </Checkbox.Group>
        );
      case "star":
        return options.map((option) => {
          return (
            <div>
              <Rate
                disabled
                defaultValue={option}
                style={{ fontSize: "12px" }}
              />
              <span style={{ fontSize: "12px", marginLeft: "12px" }}>
                Từ {option} sao
              </span>
            </div>
          );
        });
      case "price":
        return options.map((option) => {
          return (
            <div
              style={{
                padding: "10px",
                backgroundColor: "#ccc",
                width: "fit-content",
                borderRadius: "4px",
              }}
            >
              {option}
            </div>
          );
        });
      default:
        return {};
    }
  };
  return (
    <div>
      <WrapperLabelText>Lọc</WrapperLabelText>
      <WrapperTextContent>
        {renderContent("star", [5, 4, 3])}
        {renderContent("price", ["Dưới 5.000.000", "Trên 5.000.000"])}
      </WrapperTextContent>
    </div>
  );
};

export default NavbarCompoment;
