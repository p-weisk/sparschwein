package rest

import (
	"log"
	"net/http"
	"time"

	"github.com/p-weisk/sparschwein/config"
	"github.com/p-weisk/sparschwein/entity"
)

func RetrieveCurrentBalanceHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	balance, berr := entity.RetrieveCurrentBalance(config.DB)
	if berr != nil {
		log.Println(berr.Error())
		http.Error(w, berr.Error(), http.StatusInternalServerError)
		return
	}
	serr := sendJsonResponse(w, balance)
	if serr != nil {
		log.Println(serr.Error())
		return
	}
	log.Printf("%+v : HTTP 200/OK on GET /periods", time.Now())
}
