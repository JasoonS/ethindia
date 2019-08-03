import React, { Component } from "react";
import Dapp from "./Dapp"

class Template extends Component {
  render() {
    return (
      <div>
        <div className="Grid">
          <div className="Grid-item">
            <Dapp />
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
      </div>
    );
  }
}

export default Template
