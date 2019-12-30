import React, { Component } from 'react';
import {ListGroupItem, Collapse, Badge } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import Money from './Money';
import DeleteButton from './DeleteButton';

class Purchase extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    render() {
        return <ListGroupItem className={this.state.isOpen ? "bg-light border rounded shadow-sm" : this.props.grey ? "bg-light" : "" } style={{marginBottom: "4px"}}>
            <div onClick={
                () => {
                    this.setState((state) => {
                        if (state.isOpen === true ){
                            return {isOpen: false}
                        } else {
                            return {isOpen: true}
                        }
                    });
                }
            } style={
                {
                    display: "flex",
                    flexFlow: "row nowrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingBottom: this.state.isOpen ? "16px" : "4px",
                }
            }>
                <span>
                    <span><FontAwesomeIcon icon={this.state.isOpen ? faChevronDown : faChevronRight} /></span>
                    <span className="h6">    {this.props.data.Title}</span>
                </span>
                <Badge color="danger">
                    <Money prefix="-" amount={this.props.data.Total} currency="€" />
                </Badge>
            </div>
            <Collapse isOpen={this.state.isOpen}>
                <div className="lead">{this.props.data.User}</div>
                <small className="text-muted font-weight-bold">{this.props.data.Payment}</small>
                <hr className="my-2" />
                <div>{this.props.data.Comment}</div>
                <hr/>
                <div style={{
                    display: "flex",
                    flexFlow: "row nowrap",
                    alignItems: "center",
                    justifyContent: "space-between"
                }}>
                    <small style={
                        {
                            color: "#22a6b3",
                            fontWeight: "bold"
                        }
                    }>
                        {new Date(this.props.data.Timestamp).toLocaleString("de-DE")}
                    </small>
                    <DeleteButton refetchFunc={ this.props.deleteRefetch } deleteUrl={ "http://localhost:8000/api/purchases/purchase-" + this.props.data.ID } />
                </div>
            </Collapse>
        </ListGroupItem>
    }
}

export default Purchase;