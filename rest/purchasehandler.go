package rest

import (
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/p-weisk/sparschwein/config"
	"github.com/p-weisk/sparschwein/entity"
)

func CreatePurchaseHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	p, err := entity.CreatePurchaseFromJson(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("%+v : Failed to parse purchase from json request body: %+v", time.Now(), err)
		return
	}
	p.ID = uuid.New()
	perr := p.Persist(config.DB)
	if perr != nil {
		http.Error(w, "An error occured while trying to create purchase", http.StatusInternalServerError)
		log.Println(perr.Error())
		return
	}
	w.WriteHeader(http.StatusCreated)
	log.Printf("%+v : HTTP 201/CREATED on POST /purchases", time.Now())
}

func DeletePurchaseHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	idStr := mux.Vars(r)["pid"]
	id, ierr := uuid.Parse(idStr)
	if ierr != nil {
		http.Error(w, ierr.Error(), http.StatusNotFound)
		log.Println(ierr.Error)
		return
	}
	p := entity.Purchase{}
	p.ID = id
	perr := p.Delete(config.DB)
	if perr != nil {
		http.Error(w, "An error occured while trying to delete purchase", http.StatusInternalServerError)
		log.Println(perr.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
	log.Printf("%+v : HTTP 204/NO COTENT on DELETE /purchases/purchase-%s", time.Now(), p.ID.String())
}

func RetrievePurchasesHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)

	from := time.Time{}
	fromStr, foundFrom := r.URL.Query()["from"]
	if foundFrom {
		fr, err := time.Parse(time.RFC3339, fromStr[0])
		if err == nil {
			from = fr
		}
	}

	to := time.Now()
	toStr, foundTo := r.URL.Query()["to"]
	if foundTo {
		t, err := time.Parse(time.RFC3339, toStr[0])
		if err == nil {
			to = t
		}
	}

	purchases, perr := entity.RetrievePurchases(config.DB, from, to)
	if perr != nil {
		log.Println(perr.Error())
		http.Error(w, perr.Error(), http.StatusInternalServerError)
		return
	}
	serr := sendJsonResponse(w, purchases)
	if serr != nil {
		log.Println(serr.Error())
		return
	}
	log.Printf("%+v : HTTP 200/OK on GET /purchases", time.Now())
}
