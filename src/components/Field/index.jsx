import './index.css';
import React from 'react'
import { Input } from 'antd'

function Field(props) {
  const { type, amount, setAmount, token, balance } = props

  return (
    <div className='field-wrapper'>
      <div className="input-wrapper">
        <Input value={amount} placeholder='0' size='large' className='input' onBlur={(e) => {
          let val = e.target.value
          if(type === 'input') {
            setAmount(val)
            // 获取价格
          }
        }}/>
        <div className='token-wrapper'>
          <img className='image' src={ token.image } alt="" />
          <span className="name">{ token.symbol }</span>
        </div>
      </div>
      <div className='balance'>
        Balance: { balance }
      </div>
    </div>
  )
}

export default Field