import React, { Component } from 'react';

import { Alert, Button, Col, Form, Input, Label, Row, Spinner, FormGroup } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';

class PurchaseCreationDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Title: "",
            User: "",
            Timestamp: new Date(),
            Total: 0,
            Comment: "",
            Payment: "Barzahlung",
            loadingStatus: "ready"
        }
    }

    render() {
        const sendFunc = () => {
            const body = JSON.stringify({
                Title: this.state.Title,
                User: this.state.User,
                Timestamp: this.state.Timestamp.toISOString(),
                Total: this.state.Total,
                Comment: this.state.Comment,
                Payment: this.state.Payment,
            });
            fetch("http://localhost:8000/api/purchases", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }).then(() => {
                this.props.updateBalance();
                this.setState({loadingStatus: "redirect"});
            }).catch(() => {
                this.setState({loadingStatus: "error"});
            });
        }
        const feedback = this.state.loadingStatus === "error" ? <Alert color="danger">Fehler</Alert> : "";
        const redirectingButton = this.state.loadingStatus === "redirect" ?
            <Redirect to="/" />
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
                    <Label>Titel</Label>
                    <Input type="text" id="title" onChange={
                        (e) => {
                            this.setState({Title: e.target.value});
                        }
                    } key="Title" name="Title" />
                </FormGroup>
                <FormGroup>
                    <Label>Einkäufer</Label>
                   <Input type="text" id="user" onChange={
                        (e) => {
                            this.setState({User: e.target.value});
                        }
                    } key="User" name="User" />
                </FormGroup>
                <FormGroup>
                    <Label>Kaufdatum</Label>
                    <br />
                    <DatePicker 
                        className="form-control"
                        allowSameDay={ true }
                        dateFormat="dd.MM.yyyy"
                        selected={this.state.Timestamp} 
                        onChange={
                            (date) => {
                                this.setState({Timestamp: date});
                            }
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Gesamtpreis</Label>
                    <Input type="number" id="total" onChange={
                        (e) => {
                            this.setState({Total: Number.parseInt(e.target.value, 10)});
                        }
                    } key="Total" name="Total" />
                </FormGroup>
                <FormGroup>
                    <Label>Kommentar</Label>
                    <Input type="text" id="comment" onChange={
                        (e) => {
                            this.setState({Comment: e.target.value});
                        }
                    } key="Comment" name="Comment" />
                </FormGroup>
                <FormGroup>
                    <Label>Zahlweise</Label>
                    <Input type="select" onChange={
                        (e) => {
                            this.setState({Payment: e.target.value});
                        }
                    } key="Payment" name="Payment"
                    >
                        <option>Barzahlung</option>
                        <option>Kartenzahlung</option>
                    </Input>
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

export default PurchaseCreationDialog;