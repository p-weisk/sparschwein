import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Col, ListGroup, Row, Spinner, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

import ShoppingListItem from './ShoppingListItem';

class ShoppingList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: 'loading',
            items: [],
        }
    }

    fetchShoppingListFromAPI = () => {
        const username = localStorage.getItem('apiUser');
        const password = localStorage.getItem('apiPassword');           
        this.setState({loadingStatus: 'loading', items: [],});
        fetch('/api/shoppinglist', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ":" + password)
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({loadingStatus: 'success', items: data,});
        })
        .catch((error) => {
            this.setState({loadingStatus: 'error'});
        });
    }

    componentDidMount() {
        this.fetchShoppingListFromAPI();
    }

    data = (props) => {
        if(props.loadingStatus === "loading") {
            return <div style={{textAlign: "center"}}>
                <Spinner color="primary" />
            </div>
        }
        if(props.loadingStatus === "error") {
            return <Alert color="danger" style={
                {
                    display: "flex",
                    flexFlow: "row nowrap",
                    justifyContent: "space-between",
                    alignItems: "center"
                }
            }>
                <span>An Error occured</span>
                <Button outline size="sm" color="danger" onClick={ this.fetchShoppingListFromAPI }>
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Alert>
        }
        if(props.loadingStatus === "success") {
            return <section>
                <Alert color="secondary" style={
                    {
                        display: "flex",
                        flexFlow: "row nowrap",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }
                }>
                    <span className="text-success">Shopping List retrieved</span>
                    <Button outline size="sm" color="success" onClick={ this.fetchShoppingListFromAPI }>
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                </Alert>
                <ListGroup flush>
                    { props.items.map((item) => {
                        return <ShoppingListItem data={ item } key={ item.ID } deleteRefetch={ this.fetchShoppingListFromAPI } />
                    }) }
                </ListGroup>
            </section>
        } else {
            return <div>{props.loadingStatus}</div>
        }
    }

    render() {
        return <>
        <Row>
            <Col>
            <Link to="/shoppinglist/creation-dialog">
                <div className="lead text-center p-3 border border-primary rounded">
                <span className="font-weight-bold" style={{paddingLeft: "16px"}}>
                    Eintrag hinzufügen
                </span>
                </div>
            </Link>
            <hr className="my-3" />
            </Col>
        </Row>
        <Row>
            <Col>
                {this.data(this.state)}
            </Col>
        </Row>
        </>
    }
}

export default ShoppingList;