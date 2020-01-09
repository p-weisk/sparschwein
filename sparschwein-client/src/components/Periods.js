import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Alert, Button, Col, ListGroup, Row, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';

import Period from './Period';

class Periods extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: 'ready',
            periods: []
        };
    }

    fetchPeriodsFromAPI = () => {
        const username = localStorage.getItem('apiUser');
        const password = localStorage.getItem('apiPassword');           
        this.setState({loadingStatus: 'loading', periods: [],});
        fetch('/api/periods', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ":" + password)
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            this.setState({loadingStatus: 'success', periods: data,});
        })
        .catch((error) => {
            this.setState({loadingStatus: 'error'});
        });
    }

    componentDidMount() {
        this.fetchPeriodsFromAPI();
    }

    feedback = (props) => {
        if(props.loadingStatus === "success") {
            return <Alert color="secondary" style={
                {
                    display: "flex",
                    flexFlow: "row nowrap",
                    justifyContent: "space-between",
                    alignItems: "center"
                }
            }>
                <span className="text-success">Periods retrieved</span>
                <Button outline size="sm" color="success" onClick={ this.fetchPeriodsFromAPI }>
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Alert>
        }
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
                <Button outline size="sm" color="danger" onClick={ this.fetchPeriodsFromAPI }>
                    <FontAwesomeIcon icon={faRedoAlt} />
                </Button>
            </Alert>
        }
        return ""
    }

    data = (props) => {
        if(props.loadingStatus === "success") {
            return <ListGroup>
                { props.periods.map((period, index) => {
                    return <Period data={ period } grey={ index%2 === 1 } key={ period.ID } fetchPeriods={ this.fetchPeriodsFromAPI } />
                }) }
            </ListGroup>

        }
        return ""
    }

    
    render() {
        return <>
            <Row>
              <Col>
                <Link to="/periods/creation-dialog">
                  <div className="lead text-center p-3 border border-primary rounded">
                    <FontAwesomeIcon icon={ faPlusCircle } />
                    <span className="font-weight-bold" style={{paddingLeft: "16px"}}>
                      Periode erstellen
                    </span>
                  </div>
                </Link>
                <hr className="my-3" />
              </Col>
            </Row>
            <Row>
                <Col>
                    { this.feedback(this.state)}
                </Col>
            </Row>
            <Row className="mb-5">
                <Col>
                    { this.data(this.state) }
                </Col>
            </Row>
        </>
    }
}

export default Periods;