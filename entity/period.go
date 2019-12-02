package entity

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

const retrievePeriodQuery = "SELECT ID, Comment, Start, End, Budget FROM sparschwein.periods ORDER BY Start DESC;"
const retrieveOnePeriodQuery = "SELECT ID, Comment, Start, End, Budget FROM sparschwein.periods WHERE ID = ?;"
const createPeriodQuery = "INSERT INTO sparschwein.purchases (ID, Comment, Start, End, Budget) VALUES (?, ?, ?, ?, ?);"

// Budgeting period
type Period struct {
	ID        uuid.UUID
	Comment   string
	Start     time.Time
	End       time.Time
	Budget    Money
	Spent     Money
	Purchases []Purchase
}

func (p Period) Persist(db *sql.DB) error {
	id := p.ID.String()
	b := int(p.Budget)
	_, err := db.Exec(createPeriodQuery, id, p.Comment, p.Start, p.End, b)
	return err
}

// Retrieve a Collection of budgeting periods from the given Database
func RetrievePeriods(db *sql.DB) (p []Period, err error) {
	rows, rerr := db.Query(retrievePeriodQuery)
	if rerr != nil {
		return nil, rerr
	}
	var results []Period
	for rows.Next() {
		var id string
		var b int
		p := Period{}
		err := rows.Scan(&id, &p.Comment, &p.Start, &p.End, &b)
		if err != nil {
			return nil, err
		}
		p.ID = uuid.MustParse(id)
		p.Budget = Money(b)
		if p.Start.After(time.Now()) {
			var err error
			p.Purchases, err = RetrievePurchases(db, p.Start, p.End)
			if err != nil {
				return nil, err
			}
			var s int = 0
			for _, i := range p.Purchases {
				s += int(i.Total)
			}
			p.Spent = Money(s)
		} else {
			p.Purchases = nil
			p.Spent = 0
		}
		results = append(results, p)
	}

	return results, nil
}

// Retrieve a Collection of budgeting periods from the given Database
func RetrieveOnePeriod(db *sql.DB, id uuid.UUID) (p Period, err error) {
	row := db.QueryRow(retrieveOnePeriodQuery, id.String())
	var sid string
	var b int
	p = Period{}
	rerr := row.Scan(&sid, &p.Comment, &p.Start, &p.End, &b)
	if rerr != nil {
		return Period{}, err
	}
	p.ID = uuid.MustParse(sid)
	p.Budget = Money(b)
	var perr error
	p.Purchases, err = RetrievePurchases(db, p.Start, p.End)
	if perr != nil {
		return Period{}, err
	}
	var s int = 0
	for _, i := range p.Purchases {
		s += int(i.Total)
	}
	p.Spent = Money(s)

	return p, nil
}
