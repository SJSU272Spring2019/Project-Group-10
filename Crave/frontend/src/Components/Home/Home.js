import React, { Component } from 'react';
import axios from 'axios';
import Header from '../Header/Header';
import { rootUrl } from '../../config/settings';
import { burgermenu } from '../../config/burgermenu';
import { beveragesmenu } from '../../config/beveragesmenu';
import { sidesmenu } from '../../config/sidesmenu';
import { dessertsmenu } from '../../config/dessertsmenu';
import { recommendedmenu } from '../../config/recommendedmenu';
import { usualchoicemenu } from '../../config/usualchoicemenu';
import { beveragesdessertsmenu } from '../../config/beveragesdessertsmenu';
import { Card, Modal, Button, Row, Col, CardColumns } from 'react-bootstrap';
import Cart from '../Cart/Cart'


const sliderMenuTitle = [
    "Add burger of your choice",
    "Add beverage of your choice",
    "Add side of your choice",
    "Add dessert of your choice"
]

export class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false,
            burgerMenuItems: burgermenu,
            beveragesMenuItems: beveragesmenu,
            sideMenuItems: sidesmenu,
            dessertsMenuItems: dessertsmenu,
            recommendedmenuItems: recommendedmenu,
            usualchoicemenuItems: usualchoicemenu,
            beveragesdessertsmenuItems: beveragesdessertsmenu,
            selectedItem: '',
            selectedIndex: 0,
            modalId: 0,
            cartDetails: []
        }
        this.updateBurgerCart = this.updateBurgerCart.bind(this)
        this.updateBeveragesCart = this.updateBeveragesCart.bind(this)
        this.updateSidesCart = this.updateSidesCart.bind(this)
        this.updateDessertsCart = this.updateDessertsCart.bind(this)
        this.updateRecommendedCart = this.updateRecommendedCart.bind(this)
        this.slideLeft = this.slideLeft.bind(this)
        this.slideRight = this.slideRight.bind(this)
        this.prepareMenuDetails = this.prepareMenuDetails.bind(this)
        this.openModal1 = this.openModal1.bind(this)
        this.openModal2 = this.openModal2.bind(this)
        this.openModal3 = this.openModal3.bind(this)
        this.openModal4 = this.openModal4.bind(this)
        this.handleClose = this.handleClose.bind(this)
        this.maintainCartDetails = this.maintainCartDetails.bind(this)
    }

    componentDidMount() {
        axios.get(rootUrl)
            .then((response) => {
                console.log(response.data);
                this.setState({})
            })
    }

    openModal1 = () => {
        this.setState({
            showModal: true,
            modalId: 1,
            selectedItem: ''
        })
    }

    openModal2 = () => {
        this.setState({
            showModal: true,
            modalId: 2,
            selectedItem: ''
        })
    }

    openModal3 = () => {
        this.setState({
            showModal: true,
            modalId: 3,
            selectedItem: ''
        })
    }

    openModal4 = () => {
        this.setState({
            showModal: true,
            modalId: 4,
            selectedItem: ''
        })
    }

    handleClose = () => {
        this.setState({
            showModal: false,
            selectedIndex: 0,
            selectedItem: '',
            modalId: 0
        })
    }

    prepareMenuDetails = (menuItems, updateMethod) => {
        let details = menuItems.map((item, index) => {
            return (
                <Card className="text-center">
                    <Card.Img variant="top" src={`http://localhost:3000/menu/${item.image}`} />
                    <Card.Body>
                        <Card.Title>{item.item}  {item.price}</Card.Title>
                        <Card.Text >
                            <small className="text-muted">
                                {item.desc}
                            </small>
                        </Card.Text>
                    </Card.Body>
                    <Card.Footer className="text-muted"><Button id={index} size="sm" onClick={updateMethod}>Add</Button></Card.Footer>
                </Card>
            )
        })

        return details
    }

    updateBurgerCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let burger = this.state.burgerMenuItems[selectedItem]
        this.maintainCartDetails(burger)
        this.setState({
            selectedItem: burger
        })
    }

    updateBeveragesCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let beverage = this.state.beveragesMenuItems[selectedItem]
        this.maintainCartDetails(beverage)
        this.setState({
            selectedItem: beverage
        })
    }

    updateSidesCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let side = this.state.sideMenuItems[selectedItem]
        this.maintainCartDetails(side)
        this.setState({
            selectedItem: side
        })
    }

    updateDessertsCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let dessert = this.state.dessertsMenuItems[selectedItem]
        this.maintainCartDetails(dessert)
        this.setState({
            selectedItem: dessert
        })
    }

    maintainCartDetails = (selectedItem) => {
        let found = this.state.cartDetails.findIndex(item => {
            return item.item === selectedItem.item
        })

        if (found !== -1) {
            this.state.cartDetails[found].qty = this.state.cartDetails[found].qty + 1
        }
        else {
            let item =
            {
                item: selectedItem.item,
                qty: 1,
                price: selectedItem.price,
                image: selectedItem.image
            }
            this.state.cartDetails.push(item)
        }
        console.log("maintain details", this.state.cartDetails)
    }

    updateRecommendedCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let item = this.state.recommendedmenuItems[selectedItem]
        this.maintainCartDetails(item)
        this.setState({
            selectedItem: item
        })
    }

    updateUsualMenuCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let item = this.state.usualchoicemenuItems[selectedItem]
        this.maintainCartDetails(item)
        this.setState({
            selectedItem: item
        })
    }

    updateBevDessertsCart = (e) => {
        e.preventDefault();
        let selectedItem = e.target.id
        let item = this.state.beveragesdessertsmenuItems[selectedItem]
        this.maintainCartDetails(item)
        this.setState({
            selectedItem: item
        })
    }

    slideLeft = (e) => {
        let index = e.target.id
        this.setState({
            selectedItem: '',
            selectedIndex: parseInt(index) - 1
        })
    }

    slideRight = (e) => {
        let index = e.target.id
        console.log("inside slideRight", index)
        this.setState({
            selectedItem: '',
            selectedIndex: parseInt(index) + 1
        })
    }

    render() {

        let burgerDetails = this.prepareMenuDetails(this.state.burgerMenuItems, this.updateBurgerCart)
        let beveragesDetails = this.prepareMenuDetails(this.state.beveragesMenuItems, this.updateBeveragesCart)
        let sideMenuDetails = this.prepareMenuDetails(this.state.sideMenuItems, this.updateSidesCart)
        let dessertMenuDetails = this.prepareMenuDetails(this.state.dessertsMenuItems, this.updateDessertsCart)
        let recommendedMenuDetails = this.prepareMenuDetails(this.state.recommendedmenuItems, this.updateRecommendedCart)
        let usualMenuDetails = this.prepareMenuDetails(this.state.usualchoicemenuItems, this.updateUsualMenuCart)
        let bevDessertsDetails = this.prepareMenuDetails(this.state.beveragesdessertsmenuItems, this.updateBevDessertsCart)

        let sliderMenu = [
            burgerDetails,
            beveragesDetails,
            sideMenuDetails,
            dessertMenuDetails
        ]

        let cardColumns = <CardColumns />
        let modalTitle = ''
        switch (this.state.modalId) {
            case 1:
                cardColumns = <CardColumns>{usualMenuDetails}</CardColumns>
                modalTitle = "The Usual/People's Choice"
                break;
            case 2:
                cardColumns = <CardColumns>{recommendedMenuDetails}</CardColumns>
                modalTitle = "Recommended"
                break;
            case 3:
                cardColumns = <CardColumns>{bevDessertsDetails}</CardColumns>
                modalTitle = "Beverages/Desserts"
                break;
            case 4:
                cardColumns = <CardColumns>{sliderMenu[this.state.selectedIndex]}</CardColumns>
                modalTitle = sliderMenuTitle[this.state.selectedIndex]
                break;
            default:
                break;
        }

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

                <Modal show={this.state.showModal} onHide={this.handleClose} dialogClassName="modal4">
                    <Modal.Header closeButton>
                        <Modal.Title className="sliderTitle">{modalTitle}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body className="menu" >
                        <Row>
                            <Col sm={1}>
                                {this.state.modalId === 4 && this.state.selectedIndex > 0 ? <a href="#" id={this.state.selectedIndex} onClick={this.slideLeft} className="sliderarrow"><i id={this.state.selectedIndex} className="fa fa-chevron-circle-left fa-3x"></i></a> : null}
                            </Col>
                            <Col sm={8}>
                                {cardColumns}
                            </Col>
                            <Col sm={1}>
                                {this.state.modalId === 4 && this.state.selectedIndex < sliderMenu.length - 1 ? <a href="#" id={this.state.selectedIndex} onClick={this.slideRight} className="sliderarrow"><i id={this.state.selectedIndex} className="fa fa-chevron-circle-right fa-3x"></i></a> : null}
                            </Col>
                            <Col sm={2} className="sliderCart">

                                <Cart cartItem={this.state.selectedItem} cartDetails={this.state.cartDetails}></Cart>

                            </Col>

                        </Row>
                    </Modal.Body>

                </Modal>

            </div>
        )
    }
}

export default Home
