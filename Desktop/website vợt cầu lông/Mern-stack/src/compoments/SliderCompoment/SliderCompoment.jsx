import React from "react";
import { Image } from "antd";
import { WrapperSliderStyle } from "./style";

const SliderCompoment = ({ arrImages }) => {
  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  return (
    <WrapperSliderStyle {...settings}>
      {arrImages.map((item, index) => {
        return (
          <Image
            key={index}
            src={item}
            alt="slider"
            preview={false}
            width="100%"
            height="274px"
          />
        );
      })}
    </WrapperSliderStyle>
  );
};

export default SliderCompoment;
