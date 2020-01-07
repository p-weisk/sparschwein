package main

import (
	"github.com/gorilla/mux"
	"github.com/p-weisk/sparschwein/rest"
)

func registerRoutes(r *mux.Router) {

	// delete shopping list item permanently
	r.HandleFunc("/api/shoppinglist/item-{pid}/delete", rest.DeleteShoppingListItemHandler).Methods("DELETE")
	// mark shopping list item as done (it will not show up on api anymore)
	r.HandleFunc("/api/shoppinglist/item-{pid}/done", rest.MarkShoppingListItemDoneHandler).Methods("DELETE")

	// add shopping list item
	r.HandleFunc("/api/shoppinglist", rest.AddShoppingListItemHandler).Methods("POST")
	// retrieve Shopping List
	r.HandleFunc("/api/shoppinglist", rest.RetrieveShoppingListHandler).Methods("GET")

	// retrieve ID, Budet and amount spent for current period
	r.HandleFunc("/api/periods/current", rest.RetrieveCurrentBalanceHandler).Methods("GET")

	// delete the period with the ID {pid}
	r.HandleFunc("/api/periods/period-{pid}", rest.DeletePeriodHandler).Methods("DELETE")
	// retrieve details, purchases and derived properties of the period with the ID {pid}
	r.HandleFunc("/api/periods/period-{pid}", rest.RetrieveOnePeriodHandler).Methods("GET")

	// retrieve details of all periods and purchases and calculated props for the current one
	r.HandleFunc("/api/periods", rest.RetrievePeriodsHandler).Methods("GET")
	// create a new period
	r.HandleFunc("/api/periods", rest.CreatePeriodHandler).Methods("POST")

	// delete the purchase with the ID {pid}
	r.HandleFunc("/api/purchases/purchase-{pid}", rest.DeletePurchaseHandler).Methods("DELETE")

	// retrieve all purchases
	// you may filter by date
	// (use \'from\' and \'to\' query parameters)
	// time format is yyyy-mm-dd-hh-mm-ss
	r.HandleFunc("/api/purchases", rest.RetrievePurchasesHandler).Methods("GET")
	// create a new purchase
	r.HandleFunc("/api/purchases", rest.CreatePurchaseHandler).Methods("POST")
}
