import React, { Component } from "react";
import Toggle from 'react-toggle'
import Dapp from "./Dapp"
import About from './About'
import HowItWorks from './HowItworks';
import UploadImage from './UploadImage';
import { TokenIdProvider } from "./TokenIdContext";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';

type displayPurchaseState = {
  displayPurchase: boolean;
};

class Template extends Component<{}, displayPurchaseState> {
  componentWillMount() {
    toast.info("Our contracts are bullet proof but our frontend might need a refresh", {
      position: "top-right",
      autoClose: 6000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true
    });
    setTimeout(()=>{
      toast.info("We are on the crisp chat below please message us with any questions");
    },6400)
    this.setState({
      displayPurchase: false
    });
  }

  render() {
    return (
      <div>
        <header>
          <ToastContainer />
          <h1>

            These ads are always for sale, purchase the ad space and set your own monthly payment...
            <br /> and even make a profit when someone buys the ad space from you
            </h1>


          <label>
            <Toggle
              defaultChecked={this.state.displayPurchase}
              icons={false}
              onChange={() => {
                this.setState({ displayPurchase: !this.state.displayPurchase })
              }} />
            <span>Purchase Ad Space</span>
          </label>
        </header>

        <div className="Grid">
          <div className="Grid-item">
            <TokenIdProvider tokenId={0}>
              <Dapp displayPurchase={this.state.displayPurchase} />
            </TokenIdProvider>
          </div>
          <div className="Grid-item">
            <TokenIdProvider tokenId={1}>
              <Dapp displayPurchase={this.state.displayPurchase} />
            </TokenIdProvider>

          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
          <div className='Grid-item'>
            <a href='#'>
              <img
                src='https://via.placeholder.com/300'
                style={{ width: '100%' }}
              />
            </a>
          </div>
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
            <HowItWorks />
          </div>
        </footer>

        <UploadImage />
      </div>
    );
  }
}

export default Template;
