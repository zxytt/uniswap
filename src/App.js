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
  const [token0Contract, setToken0Contract] = useState(undefined)
  const [token1Contract, setToken1Contract] = useState(undefined)
  const [token0Amount, setToken0Amount] = useState(undefined)
  const [token1Amount, setToken1Amount] = useState(undefined)
  
  const items = [
    {
      label: 'Swap',
      key: 'Swap',
      children: <Swap signerAddress={signerAddress}/>
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
  useEffect(() => {
    const onLoad = async () => {
      const provider = await new ethers.providers.Web3Provider(window.ethereum)
      setProvider(provider)
      const res0 = getTokenContract(token0)
      setToken0Contract(res0)
      const res1 = getTokenContract(token1)
      setToken1Contract(res1)
    }
    onLoad()
  }, [])
  // 是否连接钱包
  const isConnect = () => !!signer
  // 连接钱包
  const handleConnect = async () => {
    provider.send('eth_requestAccounts', [])
    const val = provider.getSigner()
    setSigner(val)
    val.getAddress().then(async address => {
      setSignerAddress(address.slice(0, 10))
      // 获取钱包中币的余额
      console.log(token0Contract);
      const res = token0Contract.balanceOf(address)
      // .then(res => {
        console.log('res', res);
      //   setToken0Amount(Number(ethers.utils.formatEther(res)))
      // })
      // token1Contract.balanceOf(address).then(res => {
      //   setToken1Amount(Number(ethers.utils.formatEther(res)))
      // })
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
        {
          !isConnect() && <Button type="primary" shape="round" onClick={handleConnect}>Connect Wallet</Button>
        }
      </div>
    </div>
  );
}

export default App;
