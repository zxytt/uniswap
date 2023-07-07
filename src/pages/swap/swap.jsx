import React, { useCallback, useMemo, useState } from 'react'
import { Input, Select, Button } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons';
import './swap.css'
import { ethers } from 'ethers'

const { Option } = Select;
const coins = [
  {
    value: 'ETH',
    img: require('../../assets/eth.png')
  },
  {
    value: 'DAI',
    img: require('../../assets/dai.png')
  },
  {
    value: 'USDT',
    img: require('../../assets/usdt.png')
  }
]

function Swap() {
  const [isConnect, setIsConnect] = useState(false)
  const [accounts, setAccounts] = useState([])
  const selectBefore = (val) => {
    return (
      <Select defaultValue={val} className="select-after">
        {
          coins.map(coin => (
            <Option key={coin.value} value={coin.value} >
              <div className="select-option">
                <img className="img" src={coin.img} alt="" />
                <span className="span">{coin.value}</span>
              </div>
            </Option>
          ))
        }
      </Select>
    )
  }
  // 连接钱包
  const connectWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    const accounts = await provider.send('eth_requestAccounts', [])
    console.log('accounts', accounts);
    const signer = provider.getSigner()
    console.log('signer', signer);
    if(signer) {
      setIsConnect(true)
      setAccounts(accounts)
    }
  }
  const walletInfoRender = (
    isConnect
    ?
    accounts.join(' ')
    :
    (
      <Button type="primary" shape="round" onClick={connectWallet}>
        连接钱包
      </Button>
    )
  )
  
  return (
    <div className="wrapper">
      <div className="info-wrapper">
        {walletInfoRender}
      </div>
      <div className="select-wrapper">
        <Input addonBefore={selectBefore('ETH')}/>
          <ArrowDownOutlined />
        <Input addonBefore={selectBefore('DAI')}/>
      </div>
    </div>
  )
}

export default Swap