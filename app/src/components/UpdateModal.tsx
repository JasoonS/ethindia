import { drizzleConnect } from "drizzle-react";
import PropTypes from "prop-types";
import InputAdornment from '@material-ui/core/InputAdornment';
import React, { Component, Fragment } from "react";
import { Button, Modal, Card, Box, Heading, Text, Flex, Loader, Input, Radio } from 'rimble-ui'
import web3ProvideSwitcher from "../web3ProvideSwitcher"
import TokenOverview from "./TokenOverview"
import moment from 'moment'
import { useTokenId, connectTokenId } from "./TokenIdContext";
import UploadImage from './UploadImage'

enum ModalState {
  Deposit,
  Price,
  Closed,
  UploadImage,
  updateWebsiteUrl
}

interface state {
  contractFunctions: any,
  modalState: ModalState,
  connectedToInjectedWeb3: boolean,
  currentTxIndex: number,
  depositState: boolean,
  depositAvailable: any,
  balance: number,
  updateUrl: string
}

class BuyModal extends Component<any, any> {
  contracts: any
  utils: any
  inputs: any
  state: state
  drizzle: any

  // Note, context is used to get the full drizzle object. This is slightly hacky, we should be able to do this with the drizzleConnect component only.
  static contextTypes = {
    drizzle: PropTypes.object
  }

  context: any;

  constructor(props: any, context: any) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);

    this.contracts = context.drizzle.contracts;
    this.utils = context.drizzle.web3.utils;
    this.drizzle = context.drizzle

    // Get the contract ABI, if it is undefined return an empty array
    const abi = (!!this.contracts.VitalikSteward) ? this.contracts.VitalikSteward.abi : [];

    this.inputs = [];
    let contractFunctions: any = {};

    this.state = {
      contractFunctions,
      modalState: ModalState.Closed,
      connectedToInjectedWeb3: false,
      currentTxIndex: -1,
      depositState: true,
      depositAvailable: '',
      updateUrl: '',
      balance: -1,
    };
  }


  updateImageHashOnSmartContract = (imageHash: string) => {
    let currentTxIndex: number
    if (this.state.modalState === ModalState.UploadImage) {
      currentTxIndex = this.contracts.VitalikSteward.methods[
        'changeImage'
      ].cacheSend(this.props.tokenId, imageHash)
    }

    this.setState((state: any, props: any) => ({
      ...state,
      currentTxIndex
    }))
  }

  handleSubmitOfWebsite = (event: any) => {
    event.preventDefault();
    let inputValue = this.state.updateUrl
    let currentTxIndex: any
    // if(this.state.modalState === ModalState.updateWebsiteUrl){
    currentTxIndex = this.contracts.VitalikSteward.methods[
      'changeUrl'
    ].cacheSend(this.props.tokenId, inputValue)
    // }
    this.setState((state: any, props: any) => ({
      ...state,
      currentTxIndex
    }))
  }

  handleSubmit(event: any) {
    event.preventDefault();
    let inputValueRawMaybe = this.state.contractFunctions['newSettingValue'] // all number fields are ETH  fields.
    let inputValueRaw = !!inputValueRawMaybe ? inputValueRawMaybe : 0
    let inputValue = this.utils.toWei(inputValueRaw, 'ether'); // all number fields are ETH  fields.
    let currentTxIndex: number
    if (this.state.modalState === ModalState.Deposit) {
      const contractFunction = this.state.depositState ? 'depositWei' : 'withdrawDeposit'
      currentTxIndex = this.contracts.VitalikSteward.methods[
        contractFunction
      ].cacheSend(this.props.tokenId, { value: inputValue })
    } else if (this.state.modalState === ModalState.Price) {
      currentTxIndex = this.contracts.VitalikSteward.methods[
        'changePrice'
      ].cacheSend(this.props.tokenId, inputValue)
    }
    else if (this.state.modalState === ModalState.updateWebsiteUrl) {
      currentTxIndex = this.contracts.VitalikSteward.methods[
        'changeUrl'
      ].cacheSend(this.props.tokenId, inputValue)
    }
    // else if(this.state.modalState === ModalState.UploadImage){
    //   currentTxIndex = this.contracts.VitalikSteward.methods[
    //     'changeImage'
    //   ].cacheSend(this.props.tokenId, inputValue)
    // }

    this.setState((state: any, props: any) => ({
      ...state,
      currentTxIndex
    }))
  }

  componentWillReceiveProps(nextProps: any) {
    const { transactions, transactionStack, tokenId } = this.props;

    // const didTransactionsChange = transactions !== nextProps.transactions;
    // const didTransactionStackChange = transactionStack !== nextProps.transactionStack;

    const depositKey = this.context.drizzle.contracts.VitalikSteward.methods.depositAbleToWithdraw.cacheCall(tokenId)
    const depositObj = nextProps.contracts.VitalikSteward.depositAbleToWithdraw[depositKey]

    if (!!depositObj && !!depositObj.value) {
      const depositAvailable = this.utils.fromWei(depositObj.value, 'ether')
      if (this.state.depositAvailable !== depositAvailable) {
        this.setState({
          ...this.state,
          depositAvailable
        })
      }
    }

    if (!!depositObj && !!depositObj.value) {
      const depositAvailable = this.utils.fromWei(depositObj.value, 'ether')
      if (this.state.depositAvailable !== depositAvailable) {
        this.setState({
          ...this.state,
          depositAvailable
        })
      }
    }
    if (!!this.props.accounts && !!this.props.accounts[0]) {
      this.drizzle.web3.eth.getBalance(this.props.accounts[0]).then((balance: number) => {
        this.setState({
          ...this.state,
          balance
        })
      })
    }
  }

  handleWebsiteInputChange = (event: any) => {
    this.setState({
      ...this.state,
      updateUrl: event.target.value
    })
  }

  handleInputChange(event: any) {
    this.setState({
      ...this.state,
      contractFunctions: {
        ...this.state.contractFunctions, [event.target.name]: event.target.value
      }
    })
  }



  translateType(type: any) {
    switch (true) {
      case /^uint/.test(type):
        return "number";
      case /^string/.test(type) || /^bytes/.test(type):
        return "text";
      case /^bool/.test(type):
        return "checkbox";
      default:
        return "text";
    }
  }

  closeModal = (e: any) => {
    e.preventDefault()
    this.setState((state: any, props: any) => ({
      ...state,
      modalState: ModalState.Closed,
      currentTxIndex: -1,
    }))
  }

  setDepositWithdrawToggle = (depositState: boolean) => {
    this.setState((state: any, props: any) => ({
      ...state,
      depositState,
    }))
  }

  openModal = async (modalState: ModalState) => {
    this.setState((state: any, props: any) => ({
      ...state,
      modalState,
      currentTxIndex: -1,
    }))

    const connectedToInjectedWeb3 = await web3ProvideSwitcher.switchToInjectedWeb3()

    this.setState((state: any, props: any) => ({
      ...state,
      connectedToInjectedWeb3,
    }))
  }

  render() {
    // const valueLabel = "Your Initial Deposit";
    const { transactions, transactionStack } = this.props
    const { currentTxIndex } = this.state
    let transactionStatus = 'Submitting transaction to the Ethereum Network.'
    let txHash = ''
    let txComplete = false
    if (!!transactionStack[this.state.currentTxIndex]) {
      const tempTxHash = transactionStack[this.state.currentTxIndex]
      if (!!transactions[tempTxHash]) {
        txHash = transactionStack[this.state.currentTxIndex]
        switch (transactions[txHash].status) {
          case 'pending':
            transactionStatus = 'Transaction being processed by the Ethereum Network.'
            break
          case 'success':
            txComplete = true
            transactionStatus = 'Transaction is complete.'
            break
        }
      }
    }

    const transactionProcessing = currentTxIndex !== -1

    return (
      <React.Fragment>
        <Button style={{width:'100%'}} mainColor='#7A7A7A' size="small" onClick={() => this.openModal(ModalState.Price)} > Update Price</Button>
        &ensp;
        <Button style={{width:'100%'}} mainColor='#7A7A7A' size="small" onClick={() => this.openModal(ModalState.Deposit)} > Add/Remove Deposit</Button>
        &ensp;
        <Button style={{width:'100%'}} mainColor='#7A7A7A' size="small" onClick={() => this.openModal(ModalState.UploadImage)} > Upload Image</Button>
        &ensp;
        <Button style={{width:'100%'}} mainColor='#7A7A7A' size="small" onClick={() => this.openModal(ModalState.updateWebsiteUrl)} > Update Website</Button>
        <div style={{ position: 'absolute', top: '1000' }}>
          <Modal isOpen={this.state.modalState === ModalState.Price}>
            <Card width={'420px'} p={0}>
              <Button.Text
                icononly
                icon={'Close'}
                color={'moon-gray'}
                position={'absolute'}
                top={0}
                right={0}
                mt={3}
                mr={3}
                onClick={this.closeModal}
              />
              {(!!this.props.accounts[0] || this.state.connectedToInjectedWeb3) ?

                <Box p={4} mb={3}>{
                  transactionProcessing ?
                    <Fragment>
                      <Heading.h3>Processing Transaction</Heading.h3>
                      <p>{transactionStatus}</p>
                      {!!txHash && <a href={'https://etherscan.io/tx/' + txHash} target="_blank">View transaction on Ethersan</a>}
                      {!txComplete && <Loader color="red" size="80px" />}
                    </Fragment>
                    :
                    <Fragment>
                      <Heading.h3>Price</Heading.h3>
                      <Text>
                        How much would you like to receive from selling Vitalik?
                    </Text>
                      <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
                        <Input
                          key='newSettingValue'
                          type='number'
                          name='newSettingValue'
                          value={this.state.contractFunctions['newSettingValue'] || 0}
                          placeholder={`Price`}
                          onChange={this.handleInputChange}
                          style={{ width: '100%' }}
                          startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                        />
                        <br />
                      </form>
                      <TokenOverview />
                    </Fragment>}
                </Box>
                :
                <Box p={4} mb={3}>
                  <Heading.h3>NOTICE</Heading.h3>
                  <Text>
                    Unable to connect to metamask, so unable to sign transactions.
                </Text>
                </Box>
              }
              {(!transactionProcessing) && <Flex px={4} py={3} borderTop={1} borderColor={'#E8E8E8'} justifyContent={'flex-end'}>
                {/* <Button.Outline>Cancel</Button.Outline> In the future this could be for resetting the values or something*/}
                <Button
                  mainColor='#7A7A7A' size="small"
                  ml={3}
                  onClick={this.handleSubmit}
                >Update</Button>
              </Flex>}
            </Card>
          </Modal>
        </div>
        <Modal isOpen={this.state.modalState === ModalState.Deposit}>
          <Card width={'420px'} p={0}>
            <Button.Text
              icononly
              icon={'Close'}
              color={'moon-gray'}
              position={'absolute'}
              top={0}
              right={0}
              mt={3}
              mr={3}
              onClick={this.closeModal}
            />
            {(!!this.props.accounts[0] || this.state.connectedToInjectedWeb3) ?

              <Box p={4} mb={3}>{
                transactionProcessing ?
                  <Fragment>
                    <Heading.h3>Processing Transaction</Heading.h3>
                    <p>{transactionStatus}</p>
                    {!!txHash && <a href={'https://etherscan.io/tx/' + txHash} target="_blank">View transaction on Ethersan</a>}
                    {!txComplete && <Loader color="red" size="80px" />}
                  </Fragment>
                  :
                  <Fragment>
                    <Heading.h3>Deposit</Heading.h3>
                    <Text>
                      How do you want to change your deposit?
                    </Text>
                    <Radio checked={this.state.depositState} onChange={() => this.setDepositWithdrawToggle(true)} label="Deposit" my={2} />
                    <Radio checked={!this.state.depositState} onChange={() => this.setDepositWithdrawToggle(false)} label="Withdrawl" my={2} />
                    <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmit}>
                      <Input
                        key='newSettingValue'
                        type='number'
                        name='newSettingValue'
                        value={this.state.contractFunctions['newSettingValue'] || 0}
                        placeholder={`Amount to ${this.state.depositState ? 'add' : 'remove'}`}
                        onChange={this.handleInputChange}
                        style={{ width: '100%' }}
                        startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                      />
                      <br />
                    </form>
                    <TokenOverview />
                  </Fragment>}
              </Box>
              :
              <Box p={4} mb={3}>
                <Heading.h3>NOTICE</Heading.h3>
                <Text>
                  Unable to connect to metamask, so unable to sign transactions.
                </Text>
              </Box>
            }
            {(!transactionProcessing) && <Flex px={4} py={3} borderTop={1} borderColor={'#E8E8E8'} justifyContent={'flex-end'}>
              {/* <Button.Outline>Cancel</Button.Outline> In the future this could be for resetting the values or something*/}
              <Button
               mainColor='#7A7A7A' size="small"
                ml={3}
                onClick={this.handleSubmit}
              >{this.state.depositState ? 'Add' : 'Withdraw'}</Button>
            </Flex>}
          </Card>
        </Modal>
        <Modal isOpen={this.state.modalState === ModalState.UploadImage}>
          <Card width={'420px'} p={0}>
            <Button.Text
              icononly
              icon={'Close'}
              color={'moon-gray'}
              position={'absolute'}
              top={0}
              right={0}
              mt={3}
              mr={3}
              onClick={this.closeModal}
            />
            {(!!this.props.accounts[0] || this.state.connectedToInjectedWeb3) ?

              <Box p={4} mb={3}>{
                transactionProcessing ?
                  <Fragment>
                    <Heading.h3>Processing Transaction</Heading.h3>
                    <p>{transactionStatus}</p>
                    {!!txHash && <a href={'https://etherscan.io/tx/' + txHash} target="_blank">View transaction on Ethersan</a>}
                    {!txComplete && <Loader color="red" size="80px" />}
                  </Fragment>
                  :
                  <Fragment>
                    <Heading.h3>Upload Image</Heading.h3>
                    <Text>
                      We recommend an optimal image dimesions of 300 x 300 pixels
                    </Text>
                    <form className="pure-form pure-form-stacked">
                      <UploadImage updateImageHashOnSmartContract={this.updateImageHashOnSmartContract} />
                      <br />
                    </form>
                    <Text>Please be patient, uploading the image can take some time.</Text>
                    <TokenOverview />
                  </Fragment>}
              </Box>
              :
              <Box p={4} mb={3}>
                <Heading.h3>NOTICE</Heading.h3>
                <Text>
                  Unable to connect to metamask, so unable to sign transactions.
                </Text>
              </Box>
            }
          </Card>
        </Modal>
        <Modal isOpen={this.state.modalState === ModalState.updateWebsiteUrl}>
          <Card width={'420px'} p={0}>
            <Button.Text
              icononly
              icon={'Close'}
              color={'moon-gray'}
              position={'absolute'}
              top={0}
              right={0}
              mt={3}
              mr={3}
              onClick={this.closeModal}
            />
            {(!!this.props.accounts[0] || this.state.connectedToInjectedWeb3) ?

              <Box p={4} mb={3}>{
                transactionProcessing ?
                  <Fragment>
                    <Heading.h3>Processing Transaction</Heading.h3>
                    <p>{transactionStatus}</p>
                    {!!txHash && <a href={'https://etherscan.io/tx/' + txHash} target="_blank">View transaction on Ethersan</a>}
                    {!txComplete && <Loader color="red" size="80px" />}
                  </Fragment>
                  :
                  <Fragment>
                    <Heading.h3>Update website url</Heading.h3>
                    <Text>
                      Don't forget to add http or https at the beginning
                    </Text>
                    <form className="pure-form pure-form-stacked" onSubmit={this.handleSubmitOfWebsite}>
                      <Input
                        key='updateUrl'
                        type='text'
                        name='updateUrl'
                        value={this.state.updateUrl || ''}
                        // value={this.state.contractFunctions['newSettingValue'] || ''}
                        // placeholder={`Amount to ${this.state.depositState ? 'add' : 'remove'}`}
                        onChange={this.handleWebsiteInputChange}
                        style={{ width: '100%' }}
                      // startAdornment={<InputAdornment position="start">ETH</InputAdornment>}
                      />
                      <br />
                    </form>
                    <TokenOverview />
                  </Fragment>}
              </Box>
              :
              <Box p={4} mb={3}>
                <Heading.h3>NOTICE</Heading.h3>
                <Text>
                  Unable to connect to metamask, so unable to sign transactions.
                </Text>
              </Box>
            }
            {(!transactionProcessing) && <Flex px={4} py={3} borderTop={1} borderColor={'#E8E8E8'} justifyContent={'flex-end'}>
              {/* <Button.Outline>Cancel</Button.Outline> In the future this could be for resetting the values or something*/}
              <Button
                mainColor='#7A7A7A' size="small"
                ml={3}
                onClick={this.handleSubmitOfWebsite}
              >Update Website Url</Button>
            </Flex>}
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    contracts: state.contracts,
    transactions: state.transactions,
    transactionStack: state.transactionStack,
    accounts: state.accounts,
  }
}

export default connectTokenId(drizzleConnect(BuyModal, mapStateToProps))
