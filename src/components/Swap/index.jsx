import './index.css';
import React, { useState } from 'react'
import { SettingOutlined } from '@ant-design/icons';
import { Popover } from 'antd'

function Swap() {
  const PopoverContent = (
    <div>132</div>
  )
  return (
    <div className='wrapper'>
      <div className='nav'> 
        <div className='left'>
          <span>Swap</span>
        </div>
        <Popover
          content={PopoverContent}
          trigger="click"
          placement="bottomRight"
        >
          <SettingOutlined className='icon'/>
        </Popover>
      </div>
    </div>
  )
}

export default Swap