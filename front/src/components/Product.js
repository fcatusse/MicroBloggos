import React, { Component } from "react";
import { Modal, Button } from "react-bootstrap";

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      quantity: 0,
      unitType: "",
      productModal: false
    };
  }

  componentDidMount() {
    this.setState({ name: this.props.name });
    this.setState({ newName: this.props.name });
    this.setState({ quantity: this.props.quantity });
    this.setState({ newQuantity: this.props.quantity });
    this.setState({ unitType: this.props.unitType });
    this.setState({ newUnitType: this.props.unitType });
  }

  handleName = e => {
    this.setState({ newName: e.target.value });
  };

  handleQuantity = e => {
    this.setState({ newQuantity: e.target.value });
  };

  handleUnitType = e => {
    this.setState({ newUnitType: e.target.value });
  };

  handleEditProduct = e => {
    e.preventDefault();
    this.setState({ productModal: false });
    var editProduct = {
      name: this.state.newName,
      quantity: this.state.newQuantity,
      unitType: this.state.newUnitType,
      _id: this.props._id
    };

    this.props.onEditProduct(editProduct);
    this.setState({ name: this.state.newName });
    this.setState({ quantity: this.state.newQuantity });
    this.setState({ unitType: this.state.newUnitType });
  };

  handleDeleteProduct = e => {
    e.preventDefault();

    var deleteProduct = {
      _id: this.props._id
    };

    const result = window.confirm("Do you really want to delete this item ?");
    if (result === true) {
      this.props.onDeleteProduct(deleteProduct);
    }
  };

  render() {
    const {
      newName,
      newQuantity,
      newUnitType,
      name,
      quantity,
      unitType
    } = this.state;
    return (
      <tr>
        <td>{name}</td>
        <td>
          {" "}
          {quantity} {unitType}
        </td>
        <td>
          <Button
            className="btn btn-info"
            id={"edit" + name + quantity}
            onClick={() => this.setState({ productModal: true })}
          >
            Edit
          </Button>
        </td>
        <td>
          <Button
            id={"delete" + name + quantity}
            className="btn btn-danger"
            onClick={this.handleDeleteProduct}
          >
            Delete
          </Button>
        </td>

        <Modal show={this.state.productModal}>
          <br /> <br /> <br /> <br /> <br /> <br />
          <Modal.Header>
            <Modal.Title>Edit Product</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form className="form-horizontal" name="newProductForm">
              <div className="form-group">
                <label className="col-md-4 control-label">Name</label>
                <div className="col-md-4">
                  <input
                    id="name"
                    name="name"
                    placeholder="Name"
                    onChange={this.handleName}
                    className="form-control"
                    value={newName}
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label">Quantity</label>
                <div className="col-md-4">
                  <input
                    id="quantity"
                    name="quantity"
                    placeholder="Quantity"
                    onChange={this.handleQuantity}
                    value={newQuantity}
                    className="form-control"
                  />
                </div>
              </div>
              <div className="form-group">
                <label className="col-md-4 control-label">Unit type</label>
                <div className="col-md-4">
                  <input
                    id="unittype"
                    name="unittype"
                    placeholder="Unit type"
                    onChange={this.handleUnitType}
                    value={newUnitType}
                    className="form-control"
                  />
                </div>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => this.setState({ productModal: false })}>
              Close
            </Button>
            <Button id="submitform" onClick={this.handleEditProduct}>
              Update
            </Button>
          </Modal.Footer>
        </Modal>
      </tr>
    );
  }
}

export default Product;
