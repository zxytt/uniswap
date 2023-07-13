import './index.css';
import React, { useState } from 'react'
import { SettingOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { Input, Popover, Button } from 'antd'
import Field from '../Field'
import { token0, token1 } from '../../AlphaRouterService'

function Swap(props) {
  const { signer } = props
  const [slippage, setSlippage] = useState(0.5)
  const [deadline, setDeadline] = useState(10)
  const [balance0, setBalance0] = useState(0)
  const [balance1, setBalance1] = useState(0)
  const [inputAmount, setInputAmount] = useState(undefined)
  const [outputAmount, setOutputAmount] = useState(undefined)

  const PopoverContent = (
    <div className='popover-wrapper'>
      <div className='popover-item'>
        <span className='popover-item-text'>Max slippage</span>
        <Input className='popover-item-input' defaultValue={slippage} addonAfter="%" onBlur={(e) => {
          setSlippage(Number(e.target.value))
        }}/>
      </div>
      <div className='popover-item'>
        <span className='popover-item-text'>Transaction deadline</span>
        <Input className='popover-item-input' defaultValue={deadline} addonAfter="min" onBlur={(e) => {
          setDeadline(Number(e.target.value))
        }} />
      </div>
    </div>
  )

  const handleSwap = () => {
  }
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
      <div className='content'>
        <Field type={'input'} amount={inputAmount} setAmount={setInputAmount} token={token0} balance={balance0} />
        <Field type={'output'}  amount={outputAmount} setAmount={setOutputAmount}  token={token1} balance={balance1} />
        <div className="change"><ArrowDownOutlined /></div>
      </div>
      <div className='swap'>
        <Button type="primary" shape="round" onClick={handleSwap}>swap</Button>
      </div>
    </div>
  )
}

export default Swap