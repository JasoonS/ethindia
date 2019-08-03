import React, { Fragment } from 'react';
import { Modal, Button, Card, Box, Flex } from 'rimble-ui';

class HowItWorks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
    this.closeModal = this.closeModal.bind(this);
    this.openModal = this.openModal.bind(this);
  }

  closeModal(e) {
    e.preventDefault();
    this.setState((state, props) => ({
      isOpen: false
    }));
  }

  openModal(e) {
    e.preventDefault();
    this.setState((state, props) => ({
      isOpen: true
    }));
  }

  render() {
    return (
      <React.Fragment>
        <Button onClick={this.openModal} mainColor='#7A7A7A' size="small">How it works?</Button>

        <Modal isOpen={this.state.isOpen}>
          <Card width={'60vw'} p={0}>
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

            <Box p={4} mb={3} className='scrollable-content'>
              <Fragment>
                <h1>How it works?</h1>
                <p>
                  1. Log onto our website and a grid showing all 9 advertising
                  blocks will be displayed.
                </p>
                <p>2. All 9 of these blocks will be always on sale… forever.</p>
                <p>
                  3. Simply click buy on the block you would like to purchase
                  (you will need metamask and small amount of ether):
                </p>
                <p>
                  4. Set the the selling price for your block (this allows our
                  blocks to be always for sale. If you set the selling price at
                  say 2 ETH, you will receive 2 ETH if someone buys this block
                  from you - making money while advertising, pretty neat right?)
                </p>
                <p>
                  5. Add a deposit in ETH to pay for owning the space. If you
                  set the selling price at 2 ETH, you will have to pay 2 ETH per
                  month in order to keep this ad space. (The funds generated
                  from this project are going towards funding our wildcards
                  project which in turn funds conservation. We got into a 6
                  month Paris blockchain incubator, but we need to self fund.)
                </p>
                <p>
                  6. Now you own the block congrats! If you refresh the page you
                  will be allowed to upload a logo of your company and add your
                  website link. Anyone who visits the webpage will now see you
                  company displayed in that block, until someone buys that block
                  from you, or your deposit runs out.
                </p>
              </Fragment>
            </Box>

            <Flex
              px={4}
              py={3}
              borderTop={1}
              borderColor={'#E8E8E8'}
              justifyContent={'flex-end'}
            >
              <Button.Outline mainColor='#7A7A7A' size="small" onClick={this.closeModal}>Close</Button.Outline>
            </Flex>
          </Card>
        </Modal>
      </React.Fragment>
    );
  }
}

export default HowItWorks;
