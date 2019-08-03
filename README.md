#  ETHIndia - Asia's largest hackathon
## This ad space is always for sale

TODO - Add description

### Team Members
[Denham](https://github.com/DenhamPreen) & 
[Jonjon](http://github.com/moose-code) & 


### Tech

TODO

### Steward.sol

TODO


### Testing

`npm run chain`  
then
`truffle test`

The Gas Reporter is disable (since it is slower). Enable gas reporter in truffle config to check.

The test may sometimes fail due to split-second changes in when the test is run due to patronage incrementing per second.
Just re-run.

NOTE: It costs ~$0.12 tx fee at 5 gwei gas price & 133 usd/eth to buy. 

### Front-End

TODO

### Running 

After installing packages, main directory:

`npm run chain`  
or  
`npm run moving_chain`  

This creates a local ganache-cli instance. The latter includes auto-mining of blocks to showcase the patronage owed increasing on the front-end.

`truffle migrate`

This deploys the ERC721-artwork/nft & the Rhino.

`cd app`  
`npm run start`  

### This is originally inspired by Simon

https://github.com/simondlr/thisartworkisalwaysonsale


### License

Code License:
MIT
