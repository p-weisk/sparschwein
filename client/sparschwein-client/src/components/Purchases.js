import React, { Component } from 'react';
import { Alert, Col, ListGroup, Row, Spinner, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
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
        this.setState({loadingStatus: 'loading', purchases: [],});
        fetch('http://localhost:8000/api/purchases')
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
                <Alert color="success" style={
                    {
                        display: "flex",
                        flexFlow: "row nowrap",
                        justifyContent: "space-between",
                        alignItems: "center"
                    }
                }>
                    <span>Purchases retrieved</span>
                    <Button outline size="sm" color="success" onClick={ this.fetchPurchasesFromAPI }>
                        <FontAwesomeIcon icon={faRedoAlt} />
                    </Button>
                </Alert>
                <ListGroup flush>
                    { props.purchases.map((purchase) => {
                        return <Purchase data={ purchase } key={ purchase.ID } />
                    }) }
                </ListGroup>
            </section>
        } else {
            return <div>{props.loadingStatus}</div>
        }
    }

    render() {
        return <Row>
            <Col>
                {this.data(this.state)}
            </Col>
        </Row>
    }
}

export default Purchases;