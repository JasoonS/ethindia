import { drizzleConnect } from "drizzle-react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import { useTokenId } from "./TokenIdContext";
import { connectTokenId } from "./TokenIdContext";

class ContractData extends Component<{
  contracts: any, methodArgs: any, method: any, contract: any, toUtf8: any
  , toAscii: any
  , toEth: any
  , toDate: any
  , hideIndicator: any
}, { dataKey: any }> {

  static contextTypes = {
    drizzle: PropTypes.object
  }

  context: any;
  utils: any
  contracts: any
  constructor(props: any, context: any) {
    super(props);

    // Fetch initial value from chain and return cache key for reactive updates.
    var methodArgs = this.props.methodArgs ? this.props.methodArgs : [];

    this.utils = context.drizzle.web3.utils;
    this.contracts = context.drizzle.contracts;

    const tokenId = props.tokenId
    this.state = {
      dataKey: this.contracts[this.props.contract].methods[
        this.props.method
      ].cacheCall(tokenId, ...methodArgs),
    };
  }

  // Will not fix legacy component
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: any) {
    const { methodArgs, contract, method, tokenId } = nextProps;

    const didContractChange = contract !== nextProps.contract;
    const didMethodChange = method !== nextProps.method;
    const didArgsChange =
      JSON.stringify(methodArgs) !== JSON.stringify(nextProps.methodArgs);

    if (didContractChange || didMethodChange || didArgsChange) {
      this.setState({
        dataKey: this.contracts[nextProps.contract].methods[
          nextProps.method
        ].cacheCall(tokenId, ...nextProps.methodArgs),
      });
    }
  }

  render() {
    // Contract is not yet intialized.
    if (!this.props.contracts[this.props.contract].initialized) {
      return <span>Initializing...</span>;
    }

    // If the cache key we received earlier isn't in the store yet; the initial value is still being fetched.
    if (
      !(
        this.state.dataKey in
        this.props.contracts[this.props.contract][this.props.method]
      )
    ) {
      return <span>Fetching...</span>;
    }

    // Show a loading spinner for future updates.
    var pendingSpinner = this.props.contracts[this.props.contract].synced
      ? ""
      : "";

    // Optionally hide loading spinner (EX: ERC20 token symbol).
    if (this.props.hideIndicator) {
      pendingSpinner = "";
    }

    var displayData = this.props.contracts[this.props.contract][
      this.props.method
    ][this.state.dataKey].value;

    // Optionally convert to UTF8
    if (this.props.toUtf8) {
      displayData = this.context.drizzle.web3.utils.hexToUtf8(displayData);
    }

    // Optionally convert to Ascii
    if (this.props.toAscii) {
      displayData = this.context.drizzle.web3.utils.hexToAscii(displayData);
    }

    // Optionally convert wei to ETH
    if (this.props.toEth) {
      displayData = this.utils.fromWei(displayData, 'ether');
    }

    if (this.props.toDate) {
      displayData = moment(parseInt(displayData) * 1000).toString();
    }

    // If return value is an array
    if (Array.isArray(displayData)) {
      const displayListItems = displayData.map((datum, index) => {
        return (
          <li key={index}>
            {`${datum}`}
            {pendingSpinner}
          </li>
        );
      });

      return <ul>{displayListItems}</ul>;
    }

    // If retun value is an object
    if (typeof displayData === "object") {
      var i = 0;
      const displayObjectProps: any[] = [];

      Object.keys(displayData).forEach(key => {
        if (i !== parseInt(key)) {
          displayObjectProps.push(
            <li key={i}>
              <strong>{key}</strong>
              {pendingSpinner}
              <br />
              {`${displayData[key]}`}
            </li>,
          );
        }

        i++;
      });

      return <ul>{displayObjectProps}</ul>;
    }

    return (
      <span>
        {`${displayData}`}
        {pendingSpinner}
      </span>
    );
  }
}

// ContractData.contextTypes = {
//   drizzle: PropTypes.object,
// };

/*
 * Export connected component.
 */

const mapStateToProps = (state: any) => {
  return {
    contracts: state.contracts,
  };
};

export default connectTokenId(drizzleConnect(ContractData, mapStateToProps))
