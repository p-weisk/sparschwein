package rest

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/google/uuid"
	"github.com/gorilla/mux"
	"github.com/p-weisk/sparschwein/config"
	"github.com/p-weisk/sparschwein/entity"
)

func CreatePeriodHandler(w http.ResponseWriter, r *http.Request) {
//	allowCors(w)
	p, err := entity.CreatePeriodFromJson(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("%+v : Failed to parse period from json request body: %+v", time.Now(), err)
		return
	}
	p.ID = uuid.New()
	perr := p.Persist(config.DB)
	if perr != nil {
		http.Error(w, "An error occured while trying to create period", http.StatusInternalServerError)
		log.Println(perr.Error())
		return
	}
	w.WriteHeader(http.StatusCreated)
	log.Printf("%+v : HTTP 201/CREATED on POST /periods", time.Now())
}

func RetrievePeriodsHandler(w http.ResponseWriter, r *http.Request) {
//	allowCors(w)
	periods, perr := entity.RetrievePeriods(config.DB)
	if perr != nil {
		log.Println(perr.Error)
		http.Error(w, perr.Error(), http.StatusInternalServerError)
		return
	}
	serr := sendJsonResponse(w, periods)
	if serr != nil {
		log.Println(serr.Error)
		return
	}
	log.Printf("%+v : HTTP 200/OK on GET /periods", time.Now())
}

func RetrieveOnePeriodHandler(w http.ResponseWriter, r *http.Request) {
//	allowCors(w)
	idStr := mux.Vars(r, )["pid"]
	id, ierr := uuid.Parse(idStr)
	if ierr != nil {
		http.Error(w, ierr.Error(), http.StatusNotFound)
		log.Println(ierr.Error)
		return
	}
	period, perr := entity.RetrieveOnePeriod(config.DB, id)
	if perr != nil {
		log.Println(perr.Error)
		http.Error(w, perr.Error(), http.StatusInternalServerError)
		return
	}
	serr := sendJsonResponse(w, period)
	if serr != nil {
		log.Println(serr.Error())
		return
	}
	log.Printf("%+v : HTTP 200/OK on GET /periods/" + idStr, time.Now())
}
	

func setJsonContentType(w http.ResponseWriter) {
	w.Header().Set("Content-Type", "application/json; charset=utf-8")
}

func sendJsonResponse(w http.ResponseWriter, payload interface{}) error {
	j, jerr := json.Marshal(payload)
	if jerr != nil {
		http.Error(w, jerr.Error(), http.StatusInternalServerError)
		return jerr
	} else {
		setJsonContentType(w)
		w.WriteHeader(200)
		fmt.Fprint(w, string(j))
		return nil
	}
}
