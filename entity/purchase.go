package entity

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const createPurchaseQuery = "INSERT INTO sparschwein.purchases (ID, Title, User, Timestamp, Total, Comment) VALUES (?, ?, ?, ?, ?, ?);"
const retrievePurchaseQuery = "SELECT ID, Title, User, Timestamp, Total, Comment FROM sparschwein.purchases WHERE Timestamp BETWEEN ? AND ? ORDER BY Timestamp DESC;"

// Purchase : struct representation of a purchase
// Purchase Total in cents
type Purchase struct {
	ID        uuid.UUID
	Title     string
	User      string
	Timestamp time.Time
	Total     Money
	Comment   string
}

// Persist a purchase to the given database
func (p Purchase) Persist(db *sql.DB) error {
	id := p.ID.String()
	m := int(p.Total)
	_, err := db.Exec(createPurchaseQuery, id, p.Title, p.User, p.Timestamp, m, p.Comment)
	return err
}

// Retrieve a list of purchases from the given database
func RetrievePurchases(db *sql.DB, from time.Time, to time.Time) (p []Purchase, err error) {
	rows, rerr := db.Query(retrievePurchaseQuery, from, to)
	if rerr != nil {
		return nil, rerr
	}
	var results []Purchase
	for rows.Next() {
		var id string
		var t int
		p := Purchase{}
		err := rows.Scan(&id, &p.Title, &p.User, &p.Timestamp, &t, &p.Comment)
		if err != nil {
			return nil, err
		}
		p.ID = uuid.MustParse(id)
		p.Total = Money(t)
		results = append(results, p)
	}

	return results, nil
}
