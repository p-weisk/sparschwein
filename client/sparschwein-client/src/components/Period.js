import React, { useState } from 'react';
import {ListGroupItem, Badge, ListGroup, Spinner, Button, Alert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faRedoAlt } from '@fortawesome/free-solid-svg-icons';

import Money from './Money';
import BalanceWidget from './BalanceWidget';
import Purchase from './Purchase';
import DeleteButton from './DeleteButton';

const Period = (props) => {

    const [state, setState] = useState({
        detailed: Array.isArray(props.data.Purchases) && props.data.Purchases.length > 0,
        loadingStatus: 'ready',
        purchases: Array.isArray(props.data.Purchases) ? props.data.Purchases : [],
        spent: props.data.Spent
    });

    const fetchPurchases = () => {
        setState({
            detailed: false,
            loadingStatus: 'loading',
            purchases: [],
            spent: props.data.Spent
        });
        const username = localStorage.getItem('apiUser');
        const password = localStorage.getItem('apiPassword');           
        fetch('http://localhost:8000/api/periods/period-' + props.data.ID, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + btoa(username + ":" + password)
            }
        })
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            setState({
                detailed: true,
                loadingStatus: 'success',
                purchases: data.Purchases,
                spent: data.Spent
            });
        })
        .catch((error) => {
            setState({
                detailed: false,
                loadingStatus: 'error',
                purchases: [],
                spent: props.data.Spent
            });
        });
    }

    const kpi = () => {
        if(state.detailed) {
            const spentByUsers = [...new Set(state.purchases.map(purchase => purchase.User))]
            .map((user) => {
                return {
                    user: user,
                    spent: state.purchases
                            .filter(purchase => purchase.User === user)
                            .reduce((total, current ) => total + current.Total, 0)
                }
            })
            .sort((a, b) => {return b.spent - a.spent});

            return <>
                <BalanceWidget budget={ props.data.Budget } spent={ state.spent }/>
                <h4>Davon zahlten:</h4>
                <ListGroup flush>
                    {
                        spentByUsers.map((element) => {
                            return <ListGroupItem className={ props.grey ? "bg-light" : ""} key={ element.user }>
                                <div className="lead" style={
                                    {
                                        display: "flex",
                                        flexFlow: "row nowrap",
                                        alignItems: "center",
                                        justifyContent: "space-between"
                                    }
                                }>
                                    <span className="h6">{ element.user }</span>
                                    <Badge color="primary">
                                        <Money prefix="" amount={ element.spent } currency="€" />
                                    </Badge>
                                </div>
                            </ListGroupItem>
                        })
                    }
                </ListGroup>
            </>
        }
        return <div>
            <span>Diese Periode hat ein Budget von </span>
            <Money prefix="" amount={ props.data.Budget } currency="€" />
        </div>
    }

    const purchases = () => {
        if(state.detailed || state.loadingStatus === 'success') {
            return <>
                <h4>Einkäufe:</h4>
                <ListGroup flush>
                    { state.purchases.map((purchase) => {
                        return <Purchase data={ purchase } key={ purchase.ID } deleteRefetch={ fetchPurchases } grey={ props.grey } />
                    }) }
                </ListGroup>
            </>
        }
        if(state.loadingStatus === 'ready') {
            return <Button color="primary" outline onClick={ fetchPurchases }>
                <FontAwesomeIcon icon={ faDownload } />
                <span> Details und Einkäufe laden</span>
            </Button>
        }
        if(state.loadingStatus === 'loading') {
            return <Spinner color="primary" />
        }
        if(state.loadingStatus === 'error') {
            return <Alert color="danger">
                <span>Ein Fehler ist aufgetreten </span>
                <Button color="danger" outline onClick={ fetchPurchases }>
                    <FontAwesomeIcon icon={ faRedoAlt } />
                </Button>
            </Alert>
        }
        return ""
    }
    
    return <ListGroupItem className={ props.grey ? "bg-light" : ""}>
        <div style={{
            display: "flex",
            flexFlow: "row nowrap",
            alignItems: "center",
            justifyContent: "space-between"
        }}>
            <small style={
                {
                    color: "#22a6b3",
                    fontWeight: "bold"
                }
            }>
                {new Date(props.data.Start).toLocaleDateString("de-DE")}
                <span> bis </span>
                {new Date(props.data.End).toLocaleDateString("de-DE")}
            </small>
            <DeleteButton deleteUrl={ "http://localhost:8000/api/periods/period-" + props.data.ID } refetchFunc= { props.fetchPeriods } />
        </div>
        <hr className="my-2" />
        <div className="lead">{props.data.Comment}</div>
        { kpi() }
        <div className="pt-5"></div>
        { purchases() }
    </ListGroupItem>
}

export default Period;