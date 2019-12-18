package entity

import (
	"database/sql"
)

const retrieveCurrentBalanceQuery = "SELECT ID, Budget, Spent FROM sparschwein.currentPeriod;"

// Current period's Budget, Money spent and ID
type CurrentBalance struct {
	ID     string
	Budget Money
	Spent  Money
}

func RetrieveCurrentBalance(db *sql.DB) (b CurrentBalance, e error) {
	row := db.QueryRow(retrieveCurrentBalanceQuery)
	ba := CurrentBalance{}
	var bu int
	var sp int
	rerr := row.Scan(&ba.ID, &bu, &sp)
	if rerr != nil {
		return ba, rerr
	}
	ba.Budget = Money(bu)
	ba.Spent = Money(sp)

	return ba, nil
}
