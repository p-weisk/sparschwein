import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import { Alert, Button, Col, Form, Input, Label, Row, Spinner, FormGroup } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

class PeriodCreationDialog extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Comment: "",
            Start: new Date(),
            End: new Date(),
            Budget: 0,
            loadingStatus: "ready"
        }
    }

    render() {
        const sendFunc = () => {
            const username = localStorage.getItem('apiUser');
            const password = localStorage.getItem('apiPassword');           
            const body = JSON.stringify({
                Comment: this.state.Comment,
                Start: this.state.Start.toISOString(),
                End: this.state.End.toISOString(),
                Budget: this.state.Budget
            });
            fetch("/api/periods", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Basic ' + btoa(username + ":" + password)
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
                <div>
                    <Link to="/periods">
                        <FontAwesomeIcon icon={ faChevronLeft } />
                        <small style={{paddingLeft: "12px"}} className="font-weight-bold">Zurück zu den Perioden</small>
                    </Link>
                </div>
                <hr className="my-2" />
                <Form className="form">
                <FormGroup>
                    <Label>Kommentar</Label>
                    <Input type="text" id="comment" onChange={
                        (e) => {
                            this.setState({Comment: e.target.value});
                        }
                    } key="Comment" name="Comment" />
                </FormGroup>
                <FormGroup>
                    <Label>Startdatum</Label>
                    <br />
                    <DatePicker 
                        className="form-control"
                        allowSameDay={ true }
                        dateFormat="dd.MM.yyyy"
                        selected={this.state.Start} 
                        onChange={
                            (date) => {
                                this.setState({Start: date});
                            }
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Enddatum</Label>
                    <br />
                    <DatePicker 
                        className="form-control"
                        allowSameDay={ true }
                        dateFormat="dd.MM.yyyy"
                        selected={this.state.End} 
                        onChange={
                            (date) => {
                                this.setState({End: date});
                            }
                        }
                    />
                </FormGroup>
                <FormGroup>
                    <Label>Budget</Label>
                    <Input type="number" id="budget" onChange={
                        (e) => {
                            this.setState({Budget: Number.parseInt(e.target.value, 10)});
                        }
                    } key="Budget" name="Budget" />
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

export default PeriodCreationDialog;