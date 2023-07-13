import { SupportedChainId, Token } from '@uniswap/sdk-core'
import { ethers } from 'ethers'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { computePoolAddress } from '@uniswap/v3-sdk'
import { FeeAmount } from '@uniswap/v3-sdk'

export const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const UNISWAP_V3_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'

export const token0 = {
  name: 'Wrapped Ether',
  symbol: 'WETH',
  decimals: 18,
  address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  image: require('./assets/dai.png')
}

export const token1 = {
  name1: 'Uniswap Token',
  symbol: 'UNI',
  decimals: 18,
  address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984',
  image: require('./assets/usdt.png')
}

const WETH_TOKEN = new Token(SupportedChainId.MAINNET, token0.address, token0.decimals, token0.symbol, token0.name)
const UNI_TOKEN = new Token(SupportedChainId.MAINNET, token1.address, token1.decimals, token1.symbol, token1.name)

// 计算矿池地址
export const currentPoolAddress = computePoolAddress({
  factoryAddress: UNISWAP_V3_FACTORY_ADDRESS,
  tokenA: WETH_TOKEN,
  tokenB: UNI_TOKEN ,
  fee: FeeAmount.MEDIUM,
})

// 设置对矿池合约的引用
export const getPoolContract = (provider) => {
  return new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    provider
  )
}

// export const getWethContract = (provider) => new ethers.Contract(
//   address0,
//   IUniswapV3PoolABI.abi,
//   provider
// )

// export const getUniContract = (provider) => new ethers.Contract(
//   address0,
//   IUniswapV3PoolABI.abi,
//   provider
// )
