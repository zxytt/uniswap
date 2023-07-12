import './App.css';
import React, { useState } from 'react'
import { Button, Tabs } from 'antd'
import Swap from './components/Swap'
import { ethers } from 'ethers'

function App() {
  const [activeKey, setActiveKey] = useState('swap')
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined)
  const [signerAddress, setSignerAddress] = useState(undefined)
  const items = [
    {
      label: 'Swap',
      key: 'Swap',
      children: <Swap />
    },
    {
      label: 'Pool',
      key: 'Pool',
      children: 'Pool'
    },
  ]
  
  // 切换tab页
  const handleChange = (key) => {
    setActiveKey(key)
  }
  // 连接钱包
  const handleConnect = async() => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)
    provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    setSigner(signer)
    signer.getAddress().then(address => {
      setSignerAddress(address.slice(0, 10))
    })
  }
  return (
    <div className='App'>
      <Tabs 
        defaultActiveKey={activeKey}
        onChange={handleChange}
        items={items}
      />
      <div className='info'>
        <span className='address'>{ signerAddress }</span>
        <Button type="primary" shape="round" onClick={handleConnect}>Connect Wallet</Button>
      </div>
    </div>
  );
}

export default App;
