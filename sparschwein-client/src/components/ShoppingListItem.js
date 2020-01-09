import React from "react";
import { ListGroupItem } from 'reactstrap';
import DeleteButton from './DeleteButton';

const ShoppingListItem = (props) => {

    return <ListGroupItem>
        <div class="my-2">{props.data.Description}</div>
        <div class="my3" style={{
            display: "flex",
            flexFlow: "row wrap",
            justifyContent: "space-around",
            alignItems: "center"
        }}>
            <DeleteButton color="success" deleteUrl={"/api/shoppinglist/item-"+props.data.ID+"/done"} refetchFunc={props.deleteRefetch}>Erledigt</DeleteButton>
            <DeleteButton deleteUrl={"/api/shoppinglist/item-"+props.data.ID+"/delete"} refetchFunc = {props.deleteRefetch}>Löschen</DeleteButton>
        </div>
    </ListGroupItem>
}

export default ShoppingListItem;