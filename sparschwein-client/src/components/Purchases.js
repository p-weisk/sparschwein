import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Col, ListGroup, Row, Spinner, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import Purchase from './Purchase';

class Purchases extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: 'loading',
            purchases: [],
        }
    }

    fetchPurchasesFromAPI = () => {
        const username = localStorage.getItem('apiUser');
        const password = localStorage.getItem('apiPassword');           
        this.setState({loadingStatus: 'loading', purchases: [],});
        fetch('/api/purchases', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ":" + password)
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({loadingStatus: 'success', purchases: data,});
        })
        .catch((error) => {
            this.setState({loadingStatus: 'error'});
        });
    }

    componentDidMount() {
        this.fetchPurchasesFromAPI();
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
                <Button outline size="sm" color="danger" onClick={ this.fetchPurchasesFromAPI }>
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
                    <span className="text-success">Purchases retrieved</span>
                    <Button outline size="sm" color="success" onClick={ this.fetchPurchasesFromAPI }>
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                </Alert>
                <ListGroup flush>
                    { props.purchases.map((purchase) => {
                        return <Purchase data={ purchase } key={ purchase.ID } deleteRefetch={ this.fetchPurchasesFromAPI } />
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
                    <Link to="/purchases/creation-dialog">
                        <div className="lead text-center p-3 border border-primary rounded">
                        <FontAwesomeIcon icon={ faPlusCircle } />
                        <span className="font-weight-bold" style={{paddingLeft: "16px"}}>
                            Einkauf hinzufügen
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

export default Purchases;