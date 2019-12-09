package config

import "database/sql"

// Currency of all transactions
const Currency string = "€"

// DefaultBudget for a period budget
const DefaultBudget int = 20000

// DB Handle will be stored here
var DB *sql.DB