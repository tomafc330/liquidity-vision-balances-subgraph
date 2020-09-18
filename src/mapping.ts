import { LOG_JOIN, LOG_EXIT } from '../generated/BPool/Abi'
import { LiquidityPosition, User } from '../generated/schema'

export function handleMint(event: LOG_JOIN): void {
  let id = event.params.caller.toHex()
  let user = User.load(id)
  if (user == null) {
    user = new User(id)
  }
  user.save()

  let poolAddrs = event.params.tokenIn.toHex()
  let lp = LiquidityPosition.load(poolAddrs)
  if (lp == null) {
    lp = new LiquidityPosition(poolAddrs)
  }

  lp.user = user.id

  // have to look up the tx
  // lp.balance += event.params.tokenAmountIn
  lp.poolProviderName = "Balancer"
  lp.save()
}

export function handleBurn(event: LOG_EXIT): void {
  let id = event.params.caller.toHex()
  let user = User.load(id)
  if (user == null) {
    user = new User(id)
  }
  user.save()

  let poolAddrs = event.params.tokenOut.toHex()
  let lp = LiquidityPosition.load(poolAddrs)
  if (lp == null) {
    lp = new LiquidityPosition(poolAddrs)
  }

  lp.user = user.id
  // lp.balance -= event.params.tokenAmountOut
  lp.poolProviderName = "Balancer"
  lp.save()
}
