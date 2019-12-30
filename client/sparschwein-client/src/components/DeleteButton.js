import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Button, Spinner } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faRedoAlt, faCheck } from '@fortawesome/free-solid-svg-icons';

class DeleteButton extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loadingStatus: 'ready'
        }
    }

    deleteStuff = () => {
        this.setState({
            loadingStatus: 'loading',
        });
        const username = localStorage.getItem('apiUser');
        const password = localStorage.getItem('apiPassword');           
        fetch(this.props.deleteUrl, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Basic ' + btoa(username + ":" + password)
            }
        })
        .then((response) => {
            this.setState({
                loadingStatus: 'success'
            });
            this.props.refetchFunc();
        })
        .catch((error) => {
            this.setState({
                loadingStatus: 'error'
            });
        });
    }

    render() {
        if(this.state.loadingStatus === 'ready') {
            return <Button onClick={ this.deleteStuff } color="danger" outline>
                <FontAwesomeIcon icon={ faTrash } />
            </Button>
        }
        if(this.state.loadingStatus === 'loading') {
            return <Button color="danger" disabled outline>
                <Spinner color="danger" />
            </Button>
        }
        if(this.state.loadingStatus === 'success') {
            if(this.props.redirectPath) {
                return <Redirect to={ this.props.redirectPath } />
            }
            return <Button color="success" disabled outline>
                <FontAwesomeIcon icon={ faCheck } />
            </Button>
        }
        if(this.state.loadingStatus === 'error') {
            return <Button onClick={ this.deleteStuff } color="danger">
            <FontAwesomeIcon icon={ faRedoAlt } />
        </Button>
        }
        return ""
    }
}

DeleteButton.propTypes = {
    deleteUrl: PropTypes.string.isRequired,
    refetchFunc: PropTypes.func,
    redirectPath: PropTypes.string
}

DeleteButton.defaultProps = {
    deleteUrl: "",
    refetchFunc: () => {},
    redirectPath: ""
}

export default DeleteButton;