import React, { Component } from 'react';
import { Row, Media, Col, Button, Modal, Form } from 'react-bootstrap';

const tax = 9.5

export class Cart extends Component {
  constructor(props) {
    super(props)
    console.log("inside constructor")
    this.state = {
      cartItems: [],
      fromDiffComponent: true,
      showModal5: false,
      cardname: '',
      cardnumber: '',
      cvv: '',
      month: '',
      year: '',
      flag: false
    }

    this.reduceQuantity = this.reduceQuantity.bind(this)
    this.increaseQuantity = this.increaseQuantity.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.handleClose = this.handleClose.bind(this)
    this.openModal5 = this.openModal5.bind(this)
    this.nameHandler = this.nameHandler.bind(this)
    this.cardnumberHandler = this.cardnumberHandler.bind(this)
    this.cvvHandler = this.cvvHandler.bind(this)
    this.monthHandler = this.monthHandler.bind(this)
    this.yearHandler = this.yearHandler.bind(this)
    this.pay = this.pay.bind(this)
  }

  componentDidMount() {
    this.setState({
      cartItems: this.state.cartItems.concat(this.props.cartDetails)
    })
    console.log("inside did mount", this.state.cartItems, this.props.cartDetails)
  }


  reduceQuantity = (e) => {
    e.preventDefault()
    let selectedIndex = e.target.id
    let item = this.state.cartItems[selectedIndex]
    if (item.qty > 1) {
      item.qty = item.qty - 1
      this.setState({
        cartItems: this.state.cartItems,
        fromDiffComponent: false
      })
    }

  }

  increaseQuantity = (e) => {
    e.preventDefault()
    let selectedIndex = e.target.id
    this.state.cartItems[selectedIndex].qty = this.state.cartItems[selectedIndex].qty + 1
    this.setState({
      cartItems: this.state.cartItems,
      fromDiffComponent: false
    })
  }

  removeItem = (e) => {
    e.preventDefault()
    let selectedIndex = e.target.id
    this.state.cartItems.splice(selectedIndex, 1)
    this.setState({
      cartItems: this.state.cartItems,
      fromDiffComponent: false
    })
  }

  openModal5 = () => {
    this.setState({
      showModal5: true,
      fromDiffComponent: false
    })
  }

  handleClose = () => {
    this.setState({
      showModal5: false,
      fromDiffComponent: false
    })
  }

  nameHandler = (e) => {
    e.preventDefault()
    this.setState({
      cardname: e.target.value,
      fromDiffComponent: false
    })
  }

  cardnumberHandler = (e) => {
    e.preventDefault()
    this.setState({
      cardnumber: e.target.value,
      fromDiffComponent: false
    })
  }

  cvvHandler = (e) => {
    e.preventDefault()
    this.setState({
      cvv: e.target.value,
      fromDiffComponent: false
    })
  }

  monthHandler = (e) => {
    e.preventDefault()
    this.setState({
      month: e.target.value,
      fromDiffComponent: false
    })
  }

  yearHandler = (e) => {
    e.preventDefault()
    this.setState({
      year: e.target.value,
      fromDiffComponent: false
    })
  }

  pay = (e) => {
    e.preventDefault()
    const data = {
      name: this.state.cardname,
      number: this.state.cardnumber,
      cvv: this.state.cvv,
      month: this.state.month,
      year: this.state.year
    }
    console.log("payment details", data)
    this.setState({
      cardname: '',
      cardnumber: '',
      cvv: '',
      month: '',
      year: '',
      showModal5: false,
      fromDiffComponent: false
    })
  }

  render() {
    let selectedItem = this.props.cartItem
    console.log("inside render", selectedItem)
    for (let i = 0; i < this.state.cartItems.length; i++) {
      console.log("item", this.state.cartItems[i])
    }
    if (selectedItem !== "" && this.state.fromDiffComponent) {
      let found = this.state.cartItems.findIndex(item => {
        return item.item === selectedItem.item
      })

      if (found !== -1) {
        console.log("inside found", this.state.cartItems[found].qty, found)
        this.state.cartItems[found].qty = this.state.cartItems[found].qty + 1
      }
      else {
        console.log("inside else")
        let item =
        {
          item: selectedItem.item,
          qty: 1,
          price: selectedItem.price,
          image: selectedItem.image
        }
        this.state.cartItems.push(item)
      }
    }
    console.log("cart items", this.state.cartItems)
    this.state.fromDiffComponent = true
    let total = 0;
    let calPrice = 0;
    let details = this.state.cartItems.map((cartItem, index) => {
      calPrice = calPrice + (parseInt(cartItem.qty) * parseFloat(cartItem.price.substring(1)))
      total = calPrice.toFixed(2);
      console.log("inside map", parseInt(cartItem.qty), parseInt(cartItem.price.substring(1)), total)
      return (

        <Row>
          <Media>
            <img
              width={64}
              height={64}
              className="mr-3"
              src={`http://localhost:3000/menu/${cartItem.image}`}
              alt="Generic placeholder"
            />
            <Media.Body>
              <h5>{cartItem.item} </h5>
              <p><b>{cartItem.price} *</b>&nbsp;<a href="#" onClick={this.reduceQuantity} id={index}><i id={index} className="fa fa-minus-circle fa-1x"></i></a>&nbsp;<input className="qtyInput" value={cartItem.qty} readOnly />&nbsp;<a href="#" onClick={this.increaseQuantity} id={index}><i id={index} className="fa fa-plus-circle fa-1x"></i></a>
                <a href="#" id={index} onClick={this.removeItem}><span className="trash"><i id={index} className="fa fa-trash fa-2x"></i></span></a></p>
            </Media.Body>
          </Media>
        </Row>


      )
    })
    console.log("total", total)
    let finalPrice = (parseFloat(total) + (parseFloat(total) * 0.095)).toFixed(2)
    let paymentDetail = ''
    if (details.length) {
      paymentDetail = <div>
        <p className="cartStyle">--------------------------------------------------</p>
        <Row>
          <Col>Total</Col>
          <Col>: {total}</Col>
        </Row>
        <Row>
          <Col>Tax</Col>
          <Col>: {tax} %</Col>
        </Row>
        <Row>
          <Col>Due Amount</Col>
          <Col>: {finalPrice}</Col>
        </Row>
        <p className="cartStyle">--------------------------------------------------</p>
        <Button variant="primary" size="lg" block onClick={this.openModal5}>Checkout</Button>
      </div>
    }
    return (
      <div>
        <div>
          <Row>
            <h2 className="cartTitle">My Cart &nbsp;&nbsp;&nbsp;
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        <span className="cartStyle">
                <i className="fa fa-shopping-cart fa-1x"></i>
              </span>
            </h2>
            <p className="cartStyle">-------------------------------------------------</p>
          </Row>
          <Row>
            {details}
          </Row>
          <Row>
            {paymentDetail}
          </Row>
        </div>

        <Modal show={this.state.showModal5} onHide={this.handleClose} dialogClassName="modal5" aria-labelledby="contained-modal-title-vcenter"
          centered>
          <Modal.Header closeButton>
            <Modal.Title>Enter Card details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form onSubmit={this.pay}>
              <Row>
                <Col sm={4}>Card Holder Name: </Col>
                <Col sm={8}><input type="text" className="name" placeholder="Card Holder Name" onChange={this.nameHandler}></input></Col>
              </Row>
              <br />
              <Row>
                <Col sm={4}>Card Number: </Col>
                <Col sm={8}><input type="number" className="number" placeholder="Card Number" onChange={this.cardnumberHandler} maxlength="16"></input></Col>
              </Row>
              <br />
              <Row>
                <Col sm={4}>CVV: </Col>
                <Col sm={8}><input type="number" className="cvv" placeholder="CVV" onChange={this.cvvHandler} maxlength="4"></input></Col>
              </Row>
              <br />
              <Row>
                <Col sm={4}> Valid Till</Col>
                <Col sm={3}>
                  <div className="Month">
                    <select name="Month" onChange={this.monthHandler}>
                      <option value="january">January</option>
                      <option value="february">February</option>
                      <option value="march">March</option>
                      <option value="april">April</option>
                      <option value="may">May</option>
                      <option value="june">June</option>
                      <option value="july">July</option>
                      <option value="august">August</option>
                      <option value="september">September</option>
                      <option value="october">October</option>
                      <option value="november">November</option>
                      <option value="december">December</option>
                    </select>
                  </div>
                </Col>
                <Col sm={1}></Col>
                <Col sm={3}>
                  <div className="Year">
                    <select name="Year" onChange={this.yearHandler}>
                      <option value="2016">2016</option>
                      <option value="2017">2017</option>
                      <option value="2018">2018</option>
                      <option value="2019">2019</option>
                      <option value="2020">2020</option>
                      <option value="2021">2021</option>
                      <option value="2022">2022</option>
                      <option value="2023">2023</option>
                      <option value="2024">2024</option>
                    </select>
                  </div>
                </Col><br /><br />
                <Button variant="primary" size="lg" block type="submit">Pay</Button>

              </Row>
            </Form>
          </Modal.Body>
        </Modal>
      </div >
    )
  }
}

export default Cart
