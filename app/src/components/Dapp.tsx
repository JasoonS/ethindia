import React, { Component, Fragment } from "react"
import TokenOverview from "./TokenOverview"
import OfflineContainer from "./Offline"
import BuyModal from './BuyModal'
import UpdateModal from './UpdateModal'
import wildcardsImage from "../img/wildcards.png"
import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import web3ProvideSwitcher from "../web3ProvideSwitcher"
import { UsdPriceProvider } from "./USDPriceContext"
import { connectTokenId } from "./TokenIdContext";


class Dapp extends Component<any, any> {

  contracts: any
  utils: any
  inputs: any
  state: any

  static contextTypes = {
    drizzle: PropTypes.object,
  }

  context: any;

  constructor(props: any, context: any) {
    super(props);

    this.contracts = context.drizzle.contracts;
    this.utils = context.drizzle.web3.utils;
    this.context = context

    this.state = { tokenOwner: '' }
  }

  async componentWillReceiveProps(nextProps: any) {
    const { tokenId } = nextProps
    const tokenOwnerKey = this.context.drizzle.contracts.ERC721Full.methods.ownerOf.cacheCall(tokenId)
    const tokenOwnerObj = nextProps.contracts['ERC721Full']['ownerOf'][tokenOwnerKey]

    if (!!tokenOwnerObj && !!tokenOwnerObj.value && this.state.tokenOwner !== tokenOwnerObj.value) {
      this.setState({
        ...this.state,
        tokenOwner: tokenOwnerObj.value
      })
    }
  }

  render() {
    const { tokenOwner } = this.state
    const { accounts } = this.props
    const showDapp = web3ProvideSwitcher.providerInjected
    const showInteracting = true
    const isTokenOwner = tokenOwner === accounts[0]

    console.log({ tokenOwner })

    return (
      <Fragment>
        <OfflineContainer>
          <div className="image-container">
            <a href='https://wildcards.world?ref=alwaysforsale'>
              <img src={wildcardsImage} style={{ width: '100%' }} />
            </a>
            {this.props.displayPurchase &&
              <div className='interaction-button-container'>
                <div className='interaction-buttons'>
                  {(isTokenOwner ?
                    <div>
                      <Fragment>
                        <UpdateModal />
                        <TokenOverview />
                      </Fragment>
                    </div>
                    :
                    <div>
                      {showDapp ?
                        <BuyModal />
                        :
                        <h3 style={{ margin: 0, color: '#6bad3e', padding: '0.8rem 1.2rem', display: 'inline-block' }}>
                          Install <a href='https://metamask.io'>Metamask</a> to buy this ad space.
                            {/* TODO: test if this is moblie and recommend a web3 app for android/iphone (eg trust-wallet)*/}
                        </h3>
                      }
                      <TokenOverview />
                    </div>
                  )
                  }
                </div>
              </div>
            }
          </div>
        </OfflineContainer>
      </Fragment >
    )
  }
}

const mapStateToProps = (state: any) => {
  return {
    contracts: state.contracts,
    accounts: state.accounts
  }
}

const DappConnected = connectTokenId(drizzleConnect(Dapp, mapStateToProps))

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
      </UsdPriceProvider >
    )
  }
}

export default DappWrapper
