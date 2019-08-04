import React, { Component } from "react";
import Toggle from 'react-toggle'
import ToggleButton from 'react-toggle-button'
import Dapp from "./Dapp"
import About from './About'
import HowItWorks from './HowItworks';
import { TokenIdProvider } from "./TokenIdContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import { UsdPriceProvider } from './USDPriceContext';
import IPFS from 'ipfs'

type displayPurchaseState = {
  displayPurchase: boolean,
  toggle: boolean
};

declare global {
  interface Window { ipfsNode: any; }
}

window.ipfsNode = window.ipfsNode || {};

class Template extends Component<{}, displayPurchaseState> {
  componentWillMount() {
    toast.info("Our contracts are bullet proof and our frontend is being improved to match it too", {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    setTimeout(() => {
      toast.info("We are on the crisp chat below please message us with any questions");
    }, 6400)
    this.setState({
      displayPurchase: false
    });

    if (!!window.ipfsNode) {
      console.log('loadid ipfs')
      window.ipfsNode = new IPFS()
    }
    // console.log('donnnnee')
  }

  render() {
    return (
      <div>
        <UsdPriceProvider>

          <header>
            <ToastContainer />
            <h1>

              These ads are always for sale, purchase the ad space and set your own monthly payment...
            <br /> even make a profit when someone buys the ad space from you
            </h1>
             


            <ToggleButton
              value={this.state.displayPurchase || false}
              onToggle={() => {
                this.setState({
                  displayPurchase: !this.state.displayPurchase,
                })
              }} />
            <label>
              <span style={{color:'white'}}>Click toggle to buy ad</span>
            </label>
       

          </header>

          <div className="Grid">
            <div className="Grid-item">
              <TokenIdProvider tokenId={0}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={0} />
              </TokenIdProvider>
            </div>
            <div className="Grid-item">
              <TokenIdProvider tokenId={1}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={1} />
              </TokenIdProvider>

            </div>
            <div className='Grid-item'>
              <TokenIdProvider tokenId={2}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={2} />
              </TokenIdProvider>
            </div>
            {/* <div className='Grid-item'>
              <TokenIdProvider tokenId={3}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={3} />
              </TokenIdProvider>
            </div> */}
            {/* <div className='Grid-item'>
              <TokenIdProvider tokenId={4}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={4} />
              </TokenIdProvider>
            </div>
            <div className='Grid-item'>
              <TokenIdProvider tokenId={5}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={5} />
              </TokenIdProvider>
            </div>
            <div className='Grid-item'>
              <TokenIdProvider tokenId={6}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={6} />
              </TokenIdProvider>
            </div>
            <div className='Grid-item'>
              <TokenIdProvider tokenId={7}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={7} />
              </TokenIdProvider>
            </div>
            <div className='Grid-item'>
              <TokenIdProvider tokenId={8}>
                <Dapp displayPurchase={this.state.displayPurchase} tokenId={8} />
              </TokenIdProvider>
            </div> */}
          </div>
          <footer>
            <div className='socials'>
              <div
                className='fb-share-button'
                data-href='http://alwaysforsale.io'
                data-layout='button'
                data-size='small'
              >
                <a
                  target='_blank'
                  href='https://www.facebook.com/sharer/sharer.php?u=http%3A%2F%2Falwaysforsale.io%2F&amp;src=sdkpreparse'
                  className='fb-xfbml-parse-ignore'
                >
                  Share
              </a>
              </div>
              <div>
                <a
                  href='https://twitter.com/intent/tweet?button_hashtag=Alwaysforsale.io&ref_src=twsrc%5Etfw'
                  className='twitter-hashtag-button'
                  data-show-count='false'
                >
                  Tweet #Alwaysforsale
              </a>
              </div>
            </div>
          <div className='more-info'>
            <About />
            <br/>
            <HowItWorks />
          </div>
        </footer>
        <h4 style={{color: 'white', textAlign: 'center'}}>This homepage is currently in line to make 0.8001 ETH per month based on current ad space prices</h4>
          </UsdPriceProvider>
      </div>
    );
  }
}

export default Template;
