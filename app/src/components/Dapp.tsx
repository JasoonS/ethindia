import React, { Component, Fragment } from 'react';
import TokenOverview from './TokenOverview';
import OfflineContainer from './Offline';
import BuyModal from './BuyModal';
import UpdateModal from './UpdateModal';
import { drizzleConnect } from 'drizzle-react';
import PropTypes from 'prop-types';
import web3ProvideSwitcher from '../web3ProvideSwitcher';
import { UsdPriceProvider } from './USDPriceContext';
import { connectTokenId } from './TokenIdContext';
import IPFS from 'ipfs';

class Dapp extends Component<any, any> {
  contracts: any;
  utils: any;
  inputs: any;
  state: any;

  static contextTypes = {
    drizzle: PropTypes.object
  };

  context: any;

  constructor(props: any, context: any) {
    super(props);
    // const tokenId = 0;
    // console.log(context.drizzle.contracts.VitalikSteward.methods.hashes.);
    //console.log(context.drizzle.contracts['VitalikSteward']['hashes']['0x0']);
    this.contracts = context.drizzle.contracts;
    this.utils = context.drizzle.web3.utils;
    this.context = context;


    this.state = {
      tokenOwner: '',
      hasheKey: context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(props.tokenId),
      urlKey: context.drizzle.contracts.VitalikSteward.methods.urls.cacheCall(props.tokenId),
      hashe: null,
      base64Image: '',
      websiteUrl: ''
    };
  }

  // componentWillMount() {
  //   setTimeout(()=>{this.getBase64Image()}, 3000);
  //   console.log(this.props.tokenId)
  // }

  getBase64Image = (hash: any) => {
    // const hash =   this.state.hash;
    // console.log(this.state.hashes[0])
    // console.log(hash)
    // const hash = 'QmfCHzWyFrwmVwDaqj28VgUkHJ4aZA5DNBfcJRxU1GLGeq';

    const node = new IPFS();

    node.once('ready', () => {
      node.cat(hash, (err: any, data: any) => {
        if (err) return console.error(err);

        // convert Buffer back to string
        this.setState({
          ...this.state,
          base64Image: data.toString()
        });
      });
    });
  };

  // async componentDidMount() {

  // }

  async componentWillReceiveProps(nextProps: any) {

    if (this.state.urlKey in this.props.contracts['VitalikSteward']['urls'] && 
    this.state.urlKey in nextProps.contracts['VitalikSteward']['urls']
    ){
      const urlNext =
        nextProps.contracts['VitalikSteward']['urls'][
          this.state.urlKey
        ].value;

      if (this.state.websiteUrl !== urlNext) {        
        this.setState({ ...this.state, websiteUrl: urlNext })
      }
    }

    if (
      this.state.hasheKey in
      this.props.contracts['VitalikSteward']['hashes'] &&
      this.state.hasheKey in
      nextProps.contracts['VitalikSteward']['hashes']
    ) {
      const hashNext =
        nextProps.contracts['VitalikSteward']['hashes'][
          this.state.hasheKey
        ].value;

      if (this.state.hash !== hashNext) {
        this.getBase64Image(hashNext)
        this.setState({ ...this.state, hash: hashNext })
      }
    }
    // });
    // this.setState({ ...this.state, hashes: newHashes });
    const { tokenId } = nextProps;
    const tokenOwnerKey = this.context.drizzle.contracts.ERC721Full.methods.ownerOf.cacheCall(
      tokenId
    );
    const tokenOwnerObj =
      nextProps.contracts['ERC721Full']['ownerOf'][tokenOwnerKey];

    if (
      !!tokenOwnerObj &&
      !!tokenOwnerObj.value &&
      this.state.tokenOwner !== tokenOwnerObj.value
    ) {
      this.setState({
        ...this.state,
        tokenOwner: tokenOwnerObj.value
      });
    }
  }

  render() {
    const { tokenOwner } = this.state;
    const { accounts } = this.props;
    const showDapp = web3ProvideSwitcher.providerInjected;
    const showInteracting = true;
    const isTokenOwner = tokenOwner === accounts[0];

    return (
      <Fragment>
        <OfflineContainer>
          <div className='image-container'>
            <a href={`${this.state.websiteUrl}?ref=alwaysforsale`}>
              {!!this.state.base64Image && ( //TODO undefined
                <img
                  src={`${this.state.base64Image}`}
                  style={{ width: '100%' }}
                />
              )}
            </a>
            {this.props.displayPurchase && (
              <div className='interaction-button-container'>
                <div className='interaction-buttons'>
                  {isTokenOwner ? (
                    <div>
                      <Fragment>
                        <UpdateModal />
                        <TokenOverview />
                      </Fragment>
                    </div>
                  ) : (
                      <div>
                        {showDapp ? (
                          <BuyModal />
                        ) : (
                            <h3
                              style={{
                                margin: 0,
                                color: '#6bad3e',
                                padding: '0.8rem 1.2rem',
                                display: 'inline-block'
                              }}
                            >
                              Install <a href='https://metamask.io'>Metamask</a> to
                              buy this ad space.
                          {/* TODO: test if this is moblie and recommend a web3 app for android/iphone (eg trust-wallet)*/}
                            </h3>
                          )}
                        <TokenOverview />
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>
        </OfflineContainer>
      </Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    contracts: state.contracts,
    accounts: state.accounts
  };
};

const DappConnected = connectTokenId(drizzleConnect(Dapp, mapStateToProps));

class DappWrapper extends Component<any, any> {
  constructor(props: any, context: any) {
    super(props);
  }

  render() {
    return (
      <UsdPriceProvider>
        <OfflineContainer>
          <DappConnected displayPurchase={this.props.displayPurchase} tokenId={this.props.tokenId} />
        </OfflineContainer>
      </UsdPriceProvider>
    );
  }
}

export default DappWrapper;
