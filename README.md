# Lquidity Vision Subgraph

This subgraph will index all the lp balances of a user whether they are still in the pool or not. This is useful information as we want to build a history of P+L for their liquidity pool holdings. 

This is the subgraph for Liquidity.Vision

To deploy, please use:
```
 graph deploy \
    --debug \
    --node https://api.thegraph.com/deploy/ \
    --ipfs https://api.thegraph.com/ipfs/ \
    tommytchan/liquidity-vision
```
