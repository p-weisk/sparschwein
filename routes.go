package main

import (
	"github.com/p-weisk/sparschwein/rest"
)

func registerRoutes(*Router) {
	r.HandleFunc("/api/periods/period-{pid}", rest.RetrieveOnePeriodHandler).Methods("GET")
	r.HandleFunc("/api/purchases", GetPantry).Methods("GET")
	r.HandleFunc("/api/purchases", DeletePantry).Methods("POST")
	r.HandleFunc("/api/periods", rest.PeriodsRetrieveHandler).Methods("GET")
	r.HandleFunc("/api/periods", rest.PeriodCreateHandler).Methods("POST")
}
