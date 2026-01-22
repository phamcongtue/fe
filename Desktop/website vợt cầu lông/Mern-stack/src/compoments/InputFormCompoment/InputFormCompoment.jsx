import { Input } from 'antd'
import React, { useState } from 'react'

const InputFormCompoment = (props) => {
  const {placeholder = 'Nhap text', ...rest} = props
  
  return (
        <Input placeholder={placeholder} valueinput = {props.value} {...rest}  />
  )
}

export default InputFormCompoment