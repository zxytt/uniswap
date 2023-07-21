import './App.css';
import React, { useState, useEffect } from 'react'
import { Button, Tabs } from 'antd'
import Swap from './components/Swap'
import { ethers } from 'ethers'
import { getTokenContract } from './AlphaRouterService'
import { token0, token1 } from './AlphaRouterService'

function App() {
  const [activeKey, setActiveKey] = useState('swap')
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined) 
  const [signerAddress, setSignerAddress] = useState(undefined)
  const [balance0, setBalance0] = useState(0)
  const [balance1, setBalance1] = useState(0) 
  const [token0Contract, setToken0Contract] = useState(undefined)
  const [token1Contract, setToken1Contract] = useState(undefined)
  const [token0Amount, setToken0Amount] = useState(undefined)
  const [token1Amount, setToken1Amount] = useState(undefined)
  
  const items = [
    {
      label: 'Swap',
      key: 'Swap',
      children: <Swap 
        provider={provider}
        signerAddress={signerAddress}
        balance0={balance0}
        balance1={balance1}
      />
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
  const onLoad = async () => {
    const provider = await new ethers.providers.Web3Provider(window.ethereum)
    console.log('provider', provider);
    setProvider(provider)
    const res0 = getTokenContract(token0, provider)
    setToken0Contract(res0)
    const res1 = getTokenContract(token1, provider)
    setToken1Contract(res1)
  }
  // 是否连接钱包
  const isConnect = () => !!signer
  // 连接钱包
  const handleConnect = async () => {
    await provider.send('eth_requestAccounts', [])
    const val = provider.getSigner()
    setSigner(val)
    val.getAddress().then(async address => {
      setSignerAddress(address)
      const balance = ethers.utils.formatEther(await provider.getBalance(address))
      setBalance0(balance)
    })
  }
  useEffect(() => {
    onLoad()
  }, [])
  return (
    <div className='App'>
      <Tabs 
        defaultActiveKey={activeKey}
        onChange={handleChange}
        items={items}
      />
      <div className='info'>
        <span className='address'>{ signerAddress }</span>
        {
          !isConnect() && <Button type="primary" shape="round" onClick={handleConnect}>Connect Wallet</Button>
        }
      </div>
    </div>
  );
}

export default App;
