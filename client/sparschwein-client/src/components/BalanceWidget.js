import React from 'react';
import {
    Alert,
    Col,
    Progress,
    Row,
    Spinner
} from 'reactstrap';
import Money from './Money';

const BalanceWidget = (props) => {
    return <>
        <Row>
            <Col>
                <Progress striped style={{marginBottom: "8px"}}
                    color="success" 
                    value={ props.budget } 
                    max={props.budget > props.spent ? props.budget : props.spent} 
                />
                <Progress striped 
                    color="danger" 
                    value={ props.spent || props.budget / 500 || 1 } 
                    max={props.budget > props.spent ? props.budget : props.spent}    
                />
            </Col>
        </Row>
    <br />
        <Row>
            <Col sm={6}>
                <Alert color="success">
                    Budget: <Money amount={ props.budget } currency="€" />
                </Alert>
            </Col>
            <Col sm={6}>
                <Alert color="danger">
                    Ausgegeben: <Money amount={ props.spent } currency="€" />
                </Alert>
            </Col>
        </Row>
        <hr className="my-3" />
    </>
}

export default BalanceWidget;