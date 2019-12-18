import React, { Component } from 'react';
import { Alert, Col, Row, Spinner, Button } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

class PurchaseCreationDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Title: "",
            User: "",
            Timestamp: "",
            Total: 0,
            Comment: "",
            Payment: "Barzahlung",
        }
    }

    render() {
        return <Row>
            <Col>
                Purchase Creation Dialog
                <Button onClick={this.props.updateBalance}>Send</Button>
            </Col>
        </Row>
    }

}

export default PurchaseCreationDialog;