import React, { Fragment } from 'react';
import { Modal, Button, Card, Box, Flex } from 'rimble-ui';

class About extends React.Component {
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
                <Button onClick={this.openModal}>About</Button>

                <Modal isOpen={this.state.isOpen}>
                    <Card width={"60vw"} p={0}>
                        <Button.Text
                            icononly
                            icon={"Close"}
                            color={"moon-gray"}
                            position={"absolute"}
                            top={0}
                            right={0}
                            mt={3}
                            mr={3}
                            onClick={this.closeModal}
                        />

                        <Box p={4} mb={3} className='scrollable-content'>
                            <Fragment>
                                <h1>About our always for sale adspace</h1>
                                <p>
                                    This project was created at the #ETHIndia2019 hackathon. The purpose of the project is two fold:
      </p>
                                <p>
                                    1. To generate funds for wildlife conservation. How? We created a
                                    project called wildcards.world at the #ETHCapeTown2019 hackathon to
                                    raise funds for wildlife conservation. Subsequently, we have got into a
                                    6 month blockchain incubator in Paris to accelerate the developement of
                                    this platform. The funds generated from our #ETHIndia 'always for sale
                                    adspace' will provide funding for us to develop our <a href='https://wildcards.world'>wildcards</a> project and
                                    hence raise funds for conservation efforts.
      </p>
                                <p>
                                    2. This project is a continued social experiment to understand how
                                    always for sale adspace might behave in a viral marketplace. Many of you
                may be familiar with the <a href='http://www.milliondollarhomepage.com'>milliondollarhomepage</a> and how this simple
                                    project sold a million pixels at a dollar each. This rather aims at scarcity and introduces a very interesting concept
                                    where each piece of marketing real estate will be always for sale,
                                    forever.
      </p>
                                <p>
                                    The success of this project will allow us to provide always for sale
                                    plugin marketing solutions to other companies and continue to fund the
                                    developement of wildcards - the exploration of sustainable solutions
                                    using an always for sale mechanic.
      </p>
                                <p>
                                    Join our <a href='https://t.me/wildcardsworld'>telegram</a> <br/> 
                                    Email us to chat:&nbsp;
                                    <a href='jonjon@wildcards.world'>jonjon@wildcards.world</a>
      </p>
                                <p>Made by Denham Preen, JonJon Clark and Jason Smythe</p>
                                <p>Version: 1.0.1</p>
                            </Fragment>
                        </Box>

                        <Flex
                            px={4}
                            py={3}
                            borderTop={1}
                            borderColor={"#E8E8E8"}
                            justifyContent={"flex-end"}
                        >
                            <Button.Outline onClick={this.closeModal}>Close</Button.Outline>
                        </Flex>
                    </Card>
                </Modal>
            </React.Fragment>
        );
    }
}

export default About;