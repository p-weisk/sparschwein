package entity

import (
	"database/sql"
	"encoding/json"
	"io"
	"time"

	"github.com/google/uuid"
)

const createPurchaseQuery = "INSERT INTO sparschwein.purchases (ID, Title, User, Timestamp, Total, Comment, Payment) VALUES (?, ?, ?, ?, ?, ?, ?);"
const retrievePurchaseQuery = "SELECT ID, Title, User, Timestamp, Total, Comment, Payment FROM sparschwein.purchases WHERE date(Timestamp) BETWEEN date(?) AND date(?) ORDER BY Timestamp DESC;"
const deletePurchaseQuery = "DELETE FROM sparschwein.purchases WHERE ID = ?;"

// Purchase : struct representation of a purchase
// Purchase Total in cents
type Purchase struct {
	ID        uuid.UUID
	Title     string
	User      string
	Timestamp time.Time
	Total     Money
	Comment   string
	Payment   string
}

// Persist a purchase to the given database
func (p Purchase) Persist(db *sql.DB) error {
	id := p.ID.String()
	m := int(p.Total)
	_, err := db.Exec(createPurchaseQuery, id, p.Title, p.User, p.Timestamp, m, p.Comment, p.Payment)
	return err
}

// Delete a purchase from the given database
func (p Purchase) Delete(db *sql.DB) error {
	id := p.ID.String()
	_, err := db.Exec(deletePurchaseQuery, id)
	return err
}

// Retrieve a list of purchases from the given database
func RetrievePurchases(db *sql.DB, from time.Time, to time.Time) (p []Purchase, err error) {
	rows, rerr := db.Query(retrievePurchaseQuery, from, to)
	if rerr != nil {
		return nil, rerr
	}
	results := []Purchase{}
	for rows.Next() {
		var id string
		var t int
		p := Purchase{}
		err := rows.Scan(&id, &p.Title, &p.User, &p.Timestamp, &t, &p.Comment, &p.Payment)
		if err != nil {
			return nil, err
		}
		p.ID = uuid.MustParse(id)
		p.Total = Money(t)
		results = append(results, p)
	}

	return results, nil
}

func CreatePurchaseFromJson(r io.ReadCloser) (Purchase, error) {
	decoder := json.NewDecoder(r)
	p := Purchase{}
	err := decoder.Decode(&p)
	return p, err
}
