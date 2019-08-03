import React, { Component } from "react";
import Toggle from 'react-toggle'
import Dapp from "./Dapp"

type displayPurchaseState = {
  displayPurchase: boolean
}

class Template extends Component<{}, displayPurchaseState> {

  componentWillMount() {
    this.setState({
      displayPurchase: false
    });
  }

  render() {

    return (
      <div>
        <header>
          <h1>
            These ads are always for sale, purchase the ad space and set your own monthly payment
            </h1>
          {/* <label>
            <Toggle
              defaultChecked={this.state.displayPurchase}
              icons={false}
              onChange={() => {
                this.setState({ displayPurchase: !this.state.displayPurchase })
              }} />
            <span>Purchase Ad Space</span>
          </label> */}
        </header>
        <div className="Grid">
          <div className="Grid-item">
            <Dapp displayPurchase={this.state.displayPurchase} />
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
          <div className="Grid-item">
            <a href="#"><img src="https://via.placeholder.com/300" style={{ width: '100%' }} /></a>
          </div>
        </div>
      </div>
    );
  }
}

export default Template
