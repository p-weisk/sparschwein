package entity

import (
	"strconv"

	"github.com/p-weisk/sparschwein/config"
)

// Money representation in cents
type Money int

// Decimal string representation with currency of money
func (m Money) ToString() string {
	mstr := strconv.Itoa(int(m))
	curr := config.Currency
	big := mstr[:len(mstr)-2]
	small := mstr[len(mstr)-2:]
	return big + "," + small + " " + curr
}
