import React, { Component } from "react";
import Dapp from "./Dapp"
import { TokenIdProvider } from "./TokenIdContext";

class Template extends Component {
  render() {
    return (
      <div>
        <div className="Grid">
          <div className="Grid-item">
            <TokenIdProvider tokenId={0}>
              <Dapp />
            </TokenIdProvider>
          </div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
          <div className="Grid-item"></div>
        </div>
      </div >
    );
  }
}

export default Template
