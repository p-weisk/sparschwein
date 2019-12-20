import React, { Component } from 'react';
import { Alert, Col, Row, Spinner, Button } from 'reactstrap';
import { Redirect } from 'react-router-dom';
import DatePicker from 'react-datepicker';
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
        const feedback = this.state.loadingStatus === "error" ? <Alert color="danger">Fehler</Alert> : "";
        const redirectingButton = this.state.loadingStatus === "redirect" ?
            <Redirect to="/" />
            : <Button onClick={
                () => {
                    const body = JSON.stringify({
                        Title: this.state.Title,
                        User: this.state.User,
                        Timestamp: this.state.Timestamp.toISOString(),
                        Total: this.state.Total,
                        Comment: this.state.Comment,
                        Payment: this.state.Payment,
                    });
                    this.setState({loadingStatus: "loading"});
                    fetch("localhost:8000/api/purchases", {
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
            }>Send</Button>;

        return <Row>
            <Col>
                {
                    feedback
                }
                <form>
                    <label>Titel</label>
                    <input type="text" onChange={
                        (e) => {
                            this.setState({Title: e.target.value});
                        }
                    } key="Title" name="Title" />
                    <br />
                    <label>Einkäufer</label>
                   <input type="text" onChange={
                        (e) => {
                            this.setState({User: e.target.value});
                        }
                    } key="User" name="User" />
                    <br />
                    <label>Kaufdatum</label>
                    <DatePicker 
                        selected={this.state.Timestamp} 
                        onChange={
                            (date) => {
                                this.setState({Timestamp: date});
                            }
                        }
                    />
                    <br />
                    <label>Gesamtpreis</label>
                    <input type="text" onChange={
                        (e) => {
                            this.setState({Total: Number.parseInt(e.target.value, 10)});
                        }
                    } key="Total" name="Total" />
                    <br />
                    <label>Kommentar</label>
                    <input type="text" onChange={
                        (e) => {
                            this.setState({Comment: e.target.value});
                        }
                    } key="Comment" name="Comment" />
                    <br />
                    <label>Zahlweise</label>
                    <input type="text" onChange={
                        (e) => {
                            this.setState({Payment: e.target.value});
                        }
                    } key="Payment" name="Payment" />

                </form>
                {
                    redirectingButton
                }
            </Col>
        </Row>
    }

}

export default PurchaseCreationDialog;