package entity

import (
	"database/sql"
	"encoding/json"
	"io"

	"github.com/google/uuid"
)

const addShoppingListItemQuery = "INSERT INTO sparschwein.shoppingList (ID, Done, Description) VALUES (?, ?, ?);"
const retrieveShoppingListQuery = "SELECT ID, Description FROM sparschwein.shoppingList WHERE Done = false;"
const deleteShoppingListItemQuery = "DELETE FROM sparschwein.shoppingList WHERE ID = ?;"
const markShoppingListItemAsDoneQuery = "UPDATE sparschwein.shoppingList SET Done = true WHERE ID = ?;"

type ShoppingListItem struct {
	ID          uuid.UUID
	Done        bool
	Description string
}

// Persist a shoppingListItem to the given database
func (s ShoppingListItem) Persist(db *sql.DB) error {
	id := s.ID.String()
	_, err := db.Exec(addShoppingListItemQuery, id, s.Done, s.Description)
	return err
}

// Delete a shoppingListItem from the given database
func (s ShoppingListItem) Delete(db *sql.DB) error {
	id := s.ID.String()
	_, err := db.Exec(deleteShoppingListItemQuery, id)
	return err
}

// Delete a shoppingListItem from the given database
func (s ShoppingListItem) MarkAsDone(db *sql.DB) error {
	id := s.ID.String()
	_, err := db.Exec(markShoppingListItemAsDoneQuery, id)
	return err
}

func RetrieveShoppingList(db *sql.DB) (s []ShoppingListItem, err error) {
	rows, rerr := db.Query(retrieveShoppingListQuery)
	results := []ShoppingListItem{}
	if rerr != nil {
		return results, rerr
	}
	for rows.Next() {
		var id string
		s := ShoppingListItem{}
		err := rows.Scan(&id, &s.Description)
		if err != nil {
			return results, err
		}
		s.ID = uuid.MustParse(id)
		results = append(results, s)
	}

	return results, nil
}

func CreateShoppingListItemFromJson(r io.ReadCloser) (ShoppingListItem, error) {
	decoder := json.NewDecoder(r)
	s := ShoppingListItem{}
	err := decoder.Decode(&s)
	return s, err
}
