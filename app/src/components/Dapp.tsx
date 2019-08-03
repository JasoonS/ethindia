import React, { Component, Fragment } from 'react';
import TokenOverview from './TokenOverview';
import OfflineContainer from './Offline';
import BuyModal from './BuyModal';
import UpdateModal from './UpdateModal';
import wildcardsImage from '../img/wildcards.png';
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
    const tokenId = 0;
    // console.log(context.drizzle.contracts.VitalikSteward.methods.hashes.);
    //console.log(context.drizzle.contracts['VitalikSteward']['hashes']['0x0']);
    this.contracts = context.drizzle.contracts;
    this.utils = context.drizzle.web3.utils;
    this.context = context;

    this.state = {
      tokenOwner: '',
      hashesKeys: [
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(0),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(1),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(2),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(3),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(4),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(5),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(6),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(7),
        context.drizzle.contracts.VitalikSteward.methods.hashes.cacheCall(8)
      ],
      hashes: [null, null, null, null, null, null, null, null, null],
      base64Image: ''
    };
  }

  getBase64Image = () => {
    const hash = 'QmfCHzWyFrwmVwDaqj28VgUkHJ4aZA5DNBfcJRxU1GLGeq';

    const node = new IPFS();

    node.once('ready', () => {
      node.cat(hash, (err: any, data: any) => {
        if (err) return console.error(err);

        // convert Buffer back to string
        // console.log(data.toString())
        this.setState({
          ...this.state,
          base64Image: data.toString()
        });
      });
    });
  };

  async componentDidMount() {
    this.getBase64Image();
  }

  // async componentWillReceiveProps(nextProps: any) {

  //   const { tokenId } = nextProps
  //   const tokenOwnerKey = this.context.drizzle.contracts.ERC721Full.methods.ownerOf.cacheCall(tokenId)
  //   const tokenOwnerObj = nextProps.contracts['ERC721Full']['ownerOf'][tokenOwnerKey]

  async componentWillReceiveProps(nextProps: any) {
    // console.log("hello jason", this.state.hashesKeys)
    const newHashes = this.state.hashes.map((oldHash: any, key: any) => {
      // this.state.patronageOwedKey in nextProps.contracts['VitalikSteward']['patronageOwed']
      if (
        this.state.hashesKeys[key] in
          this.props.contracts['VitalikSteward']['hashes'] &&
        this.state.hashesKeys[key] in
          nextProps.contracts['VitalikSteward']['hashes']
      ) {
        //console.log("hello jonjon")
        const hashNext =
          nextProps.contracts['VitalikSteward']['hashes'][
            this.state.hashesKeys[key]
          ].value;
        console.log(hashNext);
        return oldHash !== hashNext ? hashNext : oldHash;
      }
    });
    this.setState({ ...this.state, hashes: newHashes });
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
            <a href='https://wildcards.world?ref=alwaysforsale'>
              {this.state.base64Image != '' && (
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
          <DappConnected displayPurchase={this.props.displayPurchase} />
        </OfflineContainer>
      </UsdPriceProvider>
    );
  }
}

export default DappWrapper;
