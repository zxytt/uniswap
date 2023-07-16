import { AlphaRouter } from '@uniswap/smart-order-router'
import { Token, CurrencyAmount, TradeType, Percent } from '@uniswap/sdk-core'
import { FeeAmount, computePoolAddress } from '@uniswap/v3-sdk'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import { ethers, BigNumber } from 'ethers'
import JSBI from 'jsbi'

const UNISWAP_V3_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984'
const UNISWAP_V3_ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const INFURA_URL_TESTNET = process.env.REACT_APP_INFURA_URL_TESTNET
console.log('INFURA_URL_TESTNET', INFURA_URL_TESTNET);
const chainId = 3
const web3Provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET)
console.log('web3Provider', web3Provider);
const router = new AlphaRouter({
  chainId: chainId,
  provider: web3Provider
})

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

const TOKEN0 = new Token(chainId, token0.address, token0.decimals, token0.symbol, token0.name)
const TOKEN1 = new Token(chainId, token1.address, token1.decimals, token1.symbol, token1.name)
const ERC20_ABI = [
  // Read-Only Functions
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',

  // Authenticated Functions
  'function transfer(address to, uint amount) returns (bool)',

  // Events
  'event Transfer(address indexed from, address indexed to, uint amount)',
]
export const getTokenContract = (token) => new ethers.Contract(token.address, ERC20_ABI, web3Provider)

export const getPrice = async (inputAmount, slippageAmount, deadline, walletAddress) => {
  console.log(inputAmount, slippageAmount, deadline, walletAddress)
  const percentSlippage = new Percent(slippageAmount, 100) // 转换为百分比
  console.log('percentSlippage', percentSlippage)
  const wei = ethers.utils.parseUnits(inputAmount.toString(), token0.decimals) // 金额转换为字符串
  console.log('wei', wei)
  const currencyAmount = CurrencyAmount.fromRawAmount(TOKEN0, JSBI.BigInt(wei))
  console.log('currencyAmount', currencyAmount)
  const route = await router.route(
    currencyAmount,
    TOKEN1,
    TradeType.EXACT_INPUT,
    {
      recipient: walletAddress,
      slippageTolerance: percentSlippage,
      deadline: deadline,
    }
  )
  console.log('route', route);
  const transaction = {
    data: route.methodParameters.calldata,
    to: UNISWAP_V3_ROUTER_ADDRESS,
    value: BigNumber.from(route.methodParameters.value),
    from: walletAddress,
    gasPrice: BigNumber.from(route.gasPriceWei),
    gasLimit: ethers.utils.hexlify(1000000)
  }
  const quoteAmountOut = route.quote.toFixed(6)
  const ratio = (quoteAmountOut / inputAmount).toFixed(3)
  return [ transaction, quoteAmountOut, ratio ]
}

export const runSwap = async (transaction, signer) => {
  const approvalAmount = ethers.utils.parseUnits('10', 18).toString()
  const contract0 = getTokenContract(token0)
  await contract0.connect(signer).approve(
    UNISWAP_V3_ROUTER_ADDRESS,
    approvalAmount
  )
  signer.sendTransaction(transaction)
}
