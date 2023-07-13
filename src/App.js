import './App.css';
import React, { useState, useEffect } from 'react'
import { Button, Tabs } from 'antd'
import Swap from './components/Swap'
import { ethers } from 'ethers'
import { getPoolContract, getToken0Contract, getToken1Contract } from './AlphaRouterService'

function App() {
  const [activeKey, setActiveKey] = useState('swap')
  const [provider, setProvider] = useState(undefined)
  const [signer, setSigner] = useState(undefined) 
  const [signerAddress, setSignerAddress] = useState(undefined) 
  const [transaction, setTransaction] = useState(undefined)
  const [ratio, setRatio] = useState(undefined)
  const [token0Contract, setToken0Contract] = useState(undefined)
  const [token1Contract, setToken1Contract] = useState(undefined)
  const [token0Amount, setToken0Amount] = useState(undefined)
  const [token1Amount, setToken1Amount] = useState(undefined)
  
  const items = [
    {
      label: 'Swap',
      key: 'Swap',
      children: <Swap signer={signer}/>
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

      const token0Contract = getToken0Contract()
      setToken0Contract(token0Contract)

      const token1Contract = getToken1Contract()
      setToken1Contract(token1Contract)
    }
    onLoad()
  }, [])
  // 获取signer
  const getSigner = async provider => {
    provider.send('eth_requestAccounts', [])
    const signer = provider.getSigner()
    setSigner(signer)
  }
  // 获取钱包地址
  const getWalletAddress = () => {
    signer.getAddress().then(address => {
      setSignerAddress(address.slice(0, 10))
      // 获取钱包中币的余额
      token0Contract.balanceOf(address).then(res => {
        setToken0Amount(Number(ethers.utils.formatEther(res)))
      })
      token1Contract.balanceOf(address).then(res => {
        setToken1Amount(Number(ethers.utils.formatEther(res)))
      })
    })
  }
  // 是否连接钱包
  const isConnect = () => !!signer
  // 连接钱包
  const handleConnect = () => {
    getSigner(provider)
  }

  if(signer) {
    getWalletAddress()
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
