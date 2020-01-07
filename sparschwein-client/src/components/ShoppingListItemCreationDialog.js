import React, { Component } from 'react';

import { Alert, Button, Col, Form, Input, Label, Row, Spinner, FormGroup } from 'reactstrap';
import { Redirect } from 'react-router-dom';

class ShoppingListItemCreationDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Done: false,
            Description: "",
            loadingStatus: "ready"
        }
    }

    render() {
        const sendFunc = () => {
            const username = localStorage.getItem('apiUser');
            const password = localStorage.getItem('apiPassword');           
            const body = JSON.stringify({
                Done: this.state.Done,
                Description: this.state.Description
            });
            fetch("/api/shoppinglist", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(username + ":" + password)
                },
                body: body
            }).then(() => {
                this.setState({loadingStatus: "redirect"});
            }).catch(() => {
                this.setState({loadingStatus: "error"});
            });
        }
        const feedback = this.state.loadingStatus === "error" ? <Alert color="danger">Fehler</Alert> : "";
        const redirectingButton = this.state.loadingStatus === "redirect" ?
            <Redirect to="/shoppinglist" />
            : <Button onClick={
                () => {
                    this.setState({loadingStatus: "loading"});
                    setTimeout(sendFunc, 500);
                }
            }>{this.state.loadingStatus === 'loading' ? <Spinner color="primary"/> : "Send"}</Button>;

        return <Row>
            <Col>
                {
                    feedback
                }
                <Form className="form">
                <FormGroup>
                    <Label>Description</Label>
                    <Input type="textarea" id="description" onChange={
                        (e) => {
                            this.setState({Description: e.target.value});
                        }
                    } key="Description" name="Description" />
                </FormGroup>
                <br />
                <FormGroup>
                {
                    redirectingButton
                }
                </FormGroup>
                </Form>
            </Col>
        </Row>
    }

}

export default ShoppingListItemCreationDialog;