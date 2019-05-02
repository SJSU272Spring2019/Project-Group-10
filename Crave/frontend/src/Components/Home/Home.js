import React, { Component } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { rootUrl } from '../../config/settings';
import Scroll from 'react-scroll';
import { Card, Modal, Button, Row, Col } from 'react-bootstrap';

var Element = Scroll.Element;

export class Home extends Component {

    constructor(props){
        super(props);
        this.state = {
            menu: [],
            showModal1: false,
            showModal2: false,
            showModal3: false,
            showModal4: false,
        }
    }

    componentDidMount(){
        axios.get(rootUrl)
        .then((response) => {
            console.log(response.data);
            this.setState({})
        })
    }

    openModal1 = () => {
        this.setState({ showModal1: true })
    }

    openModal2 = () => {
        this.setState({ showModal2: true })
    }

    openModal3 = () => {
        this.setState({ showModal3: true })
    }

    openModal4 = () => {
        this.setState({ showModal4: true })
    }

    handleClose1 = () => {
        this.setState({ showModal1: false })
    }

    handleClose2 = () => {
        this.setState({ showModal2: false })
    }

    handleClose3 = () => {
        this.setState({ showModal3: false })
    }

    handleClose4 = () => {
        this.setState({ showModal4: false })
    }

  render() {
    return (
        <div className="maincomponent">
        <Header />
          <div className="homeoptions">
            <Card className="hometile hometile1" onClick={this.openModal1}>
                <Card.Title><span className="cardtitle">The Usual/People's Choice</span></Card.Title>
            </Card> 
            <Card className="hometile hometile2" onClick={this.openModal2}>
                <Card.Title><span className="cardtitle">Recommended</span></Card.Title>
            </Card> 
            <Card className="hometile hometile3" onClick={this.openModal3}>
                <Card.Title><span className="cardtitle">Beverages/Desserts</span></Card.Title>
            </Card> 
            <Card className="hometile hometile4" onClick={this.openModal4}>
                <Card.Title><span className="cardtitle">Explore the menu</span></Card.Title>
            </Card> 
          </div>

        {/* Modals */}
            <Modal show={this.state.showModal1} onHide={this.handleClose1} className="modal1">
                <Modal.Header closeButton>
                    <Modal.Title>The Usual/People's Choice</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose1}>
                        Close
            </Button>
                    <Button variant="primary" onClick={this.handleClose1}>
                        Proceed to Checkout
            </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal2 */}
            <Modal show={this.state.showModal2} onHide={this.handleClose2} className="modal2">
                <Modal.Header closeButton>
                    <Modal.Title>Recommended</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose2}>
                        Close
            </Button>
                    <Button variant="primary" onClick={this.handleClose2}>
                        Proceed to Checkout
            </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal3 */}
            <Modal show={this.state.showModal3} onHide={this.handleClose3} className="modal3">
                <Modal.Header closeButton>
                    <Modal.Title>Beverages/Desserts</Modal.Title>
                </Modal.Header>
                <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose3}>
                        Close
            </Button>
                    <Button variant="primary" onClick={this.handleClose3}>
                        Proceed to Checkout
            </Button>
                </Modal.Footer>
            </Modal>

            {/* Modal 4 */}
            <Modal show={this.state.showModal4} onHide={this.handleClose4} className="modal4">
                <Modal.Header closeButton>
                    <Modal.Title>Menu</Modal.Title>
                </Modal.Header>
                <Modal.Body className="menu" >
                    <Row>
                        <Col>
                            <Element name="test7" className="element" id="containerElement" style={{
                                position: 'relative',
                                height: '500px',
                                overflow: 'scroll',
                            }}>
                                Burgers<br />
                                Sides<br />
                                Beverages<br />
                                Desserts<br />   
                            </Element>
                        </Col>
                        <Col>
                            <Element name="test7" className="element" id="containerElement" style={{
                                position: 'relative',
                                height: '500px',
                                overflow: 'scroll',
                            }}>
                               Cart
                            </Element>
                        </Col>
                    </Row>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose4}>
                        Close
            </Button>
                    <Button variant="primary" onClick={this.handleClose4}>
                        Proceed to Checkout
            </Button>
                </Modal.Footer>
            </Modal>

      </div>
    )
  }
}

export default Home
