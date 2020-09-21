import {Abi, LOG_EXIT, LOG_JOIN} from '../generated/BPool/Abi'
import {LiquidityPosition, User} from '../generated/schema'
import {Address, BigDecimal, BigInt, log} from "@graphprotocol/graph-ts";

let BI_18 = BigInt.fromI32(18)
let ZERO_BI = BigInt.fromI32(0)
let ONE_BI = BigInt.fromI32(1)

function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

function getLpId(poolAddress: Address, userAddress: Address): string {
  return poolAddress.toHexString().concat('-').concat(userAddress.toHexString());
}

export function handleMint(event: LOG_JOIN): void {
  let sym = Abi.bind(event.address).symbol();

  log.info("Sym is: {}", [sym])

  let userAddrs = event.params.caller;
  let userId = userAddrs.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.save()
  }

  let lpId = getLpId(event.address, userAddrs)
  let lp = LiquidityPosition.load(lpId)
  if (lp == null) {
    lp = new LiquidityPosition(lpId)
    lp.user = user.id
    lp.poolProviderName = "Balancer"
  }
  lp.poolAddress = event.address
  lp.balance = convertTokenToDecimal(Abi.bind(event.address).balanceOf(userAddrs), BI_18)
  lp.save()
}

export function handleBurn(event: LOG_EXIT): void {
  let sym = Abi.bind(event.address).symbol();

  log.info("Sym is: {}", [sym])

  let userAddrs = event.params.caller;
  let userId = userAddrs.toHex()
  let user = User.load(userId)
  if (user == null) {
    user = new User(userId)
    user.save()
  }

  let lpId = getLpId(event.address, userAddrs)
  let lp = LiquidityPosition.load(lpId)
  if (lp == null) {
    lp = new LiquidityPosition(lpId)
    lp.user = user.id
    lp.poolProviderName = "Balancer"
  }
  lp.poolAddress = event.address
  lp.balance = convertTokenToDecimal(Abi.bind(event.address).balanceOf(userAddrs), BI_18)
  lp.totalSupply = convertTokenToDecimal(Abi.bind(event.address).totalSupply(), BI_18)
  lp.save()
}

