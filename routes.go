package main

import (
	"github.com/gorilla/mux"
	"github.com/p-weisk/sparschwein/rest"
)

func registerRoutes(r *mux.Router) {

	// retrieve ID, Budet and amount spent for current period
	r.HandleFunc("/api/periods/current", rest.RetrieveCurrentBalanceHandler).Methods("GET")

	// retrieve details, purchases and derived properties of the period with the ID {pid}
	r.HandleFunc("/api/periods/period-{pid}", rest.RetrieveOnePeriodHandler).Methods("GET")

	// retrieve details of all periods and purchases and calculated props for the current one
	r.HandleFunc("/api/periods", rest.RetrievePeriodsHandler).Methods("GET")
	// create a new period
	r.HandleFunc("/api/periods", rest.CreatePeriodHandler).Methods("POST")

	// retrieve all purchases
	// you may filter by date
	// (use \'from\' and \'to\' query parameters)
	// time format is yyyy-mm-dd-hh-mm-ss
	r.HandleFunc("/api/purchases", rest.RetrievePurchasesHandler).Methods("GET")
	// create a new purchase
	r.HandleFunc("/api/purchases", rest.CreatePurchaseHandler).Methods("POST")
}
