import React, { useCallback, useMemo, useState } from 'react'
import { Input, Button } from 'antd'
import { ArrowDownOutlined } from '@ant-design/icons';
import './swap.css'
import { ethers } from 'ethers'
import { QUOTER_CONTRACT_ADDRESS, POOL_FACTORY_CONTRACT_ADDRESS, USDT_TOKEN, DAI_TOKEN } from './constants'
import { computePoolAddress } from '@uniswap/v3-sdk'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { FeeAmount } from '@uniswap/v3-sdk'
import { fromReadableAmount, toReadableAmount } from '../libs/conversion'

function Swap() {
  const [isConnect, setIsConnect] = useState(false)
  const [account, setAccount] = useState({
    name: [],
    signer: ''
  })
  const [amountIn, setAmountIn] = useState()
  const [amountOut, setAmountOut] = useState()
  const inputBefore = (val) => {
    return (
      <div className="select-option">
        <img className="img" src={val.img} alt="" />
        <span className="span">{val.name}</span>
      </div>
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
      setAccount({
        name: accounts,
        signer
      })
    }
  }
  const walletInfoRender = (
    isConnect
    ?
    account.name.join(' ')
    :
    (
      <Button type="primary" shape="round" onClick={connectWallet}>
        连接钱包
      </Button>
    )
  )
  const changeAmountIn = async (val) => {
    console.log('val', val);
    setAmountIn(Number(val))
    const quoterContract = new ethers.Contract(
      QUOTER_CONTRACT_ADDRESS,
      Quoter.abi,
      account.signer
    )
    console.log('quoterContract', quoterContract);
    const currentPoolAddress = computePoolAddress({
      factoryAddress: POOL_FACTORY_CONTRACT_ADDRESS,
      tokenA: USDT_TOKEN,
      tokenB: DAI_TOKEN,
      fee: FeeAmount.MEDIUM,
    })
    console.log('currentPoolAddress', currentPoolAddress);
  
    const poolContract = new ethers.Contract(
      currentPoolAddress,
      IUniswapV3PoolABI.abi,
      account.signer
    )
    console.log('poolContract', poolContract);
    const [token0, token1, fee] = await Promise.all([
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
    ])
    console.log(token0, token1, fee)
    const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
      token0,
      token1,
      fee,
      fromReadableAmount(
        Number(val),
        USDT_TOKEN.decimals
      ).toString(),
      0
    )
    const money = toReadableAmount(quotedAmountOut, DAI_TOKEN.decimals)
    console.log('money', money);
  }
  
  return (
    <div className="wrapper">
      <div className="info-wrapper">
        {walletInfoRender}
      </div>
      <div className="select-wrapper">
        <Input addonBefore={inputBefore({
          img: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_USDT.svg',
          name: 'USDT'
        })} value={amountIn} onChange={(e) => {
          changeAmountIn(e.target.value)
        }}/>
          <ArrowDownOutlined />
        <Input addonBefore={inputBefore({
          img: 'https://raw.githubusercontent.com/compound-finance/token-list/master/assets/asset_DAI.svg',
          name: 'DAI'
        })} value={amountOut} />
      </div>
    </div>
  )
}

export default Swap