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
    return <Row>
        <Col>
            <Progress animated
                color="success" 
                value={ props.budget } 
                max={props.budget > props.spent ? props.budget : props.spent} 
            />
            <Alert color="success">
                Budget: <Money amount={ props.budget } currency="€" />
            </Alert>
            <Progress animated 
                color="danger" 
                value={ props.spent || props.budget / 500 || 1 } 
                max={props.budget > props.spent ? props.budget : props.spent}    
            />
            <Alert color="danger">
                Ausgegeben: <Money amount={ props.spent } currency="€" />
            </Alert>
        </Col>
    </Row>
}

export default BalanceWidget;