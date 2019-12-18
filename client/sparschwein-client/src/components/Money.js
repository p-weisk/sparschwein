import React from 'react';

const Money = (props) => {
    return <span>{props.prefix} {Math.trunc(props.amount / 100)},{((props.amount < 10 ? "0" : "") + props.amount).slice(-2)} {props.currency}</span>
}

export default Money;