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

func AddShoppingListItemHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	s, err := entity.CreateShoppingListItemFromJson(r.Body)
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		log.Printf("%+v : Failed to parse shopping list item from json request body: %+v", time.Now(), err)
		return
	}
	s.ID = uuid.New()
	perr := s.Persist(config.DB)
	if perr != nil {
		http.Error(w, "An error occured while trying to create shopping list item", http.StatusInternalServerError)
		log.Println(perr.Error())
		return
	}
	w.WriteHeader(http.StatusCreated)
	log.Printf("%+v : HTTP 201/CREATED on POST /shoppinglist", time.Now())
}

func DeleteShoppingListItemHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	idStr := mux.Vars(r)["pid"]
	id, ierr := uuid.Parse(idStr)
	if ierr != nil {
		http.Error(w, ierr.Error(), http.StatusNotFound)
		log.Println(ierr.Error)
		return
	}
	s := entity.ShoppingListItem{}
	s.ID = id
	derr := s.Delete(config.DB)
	if derr != nil {
		http.Error(w, "An error occured while trying to delete shopping list item", http.StatusInternalServerError)
		log.Println(derr.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
	log.Printf("%+v : HTTP 204/NO COTENT on DELETE /shoppinglist/item-%s/delete", time.Now(), s.ID.String())
}

func MarkShoppingListItemDoneHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	idStr := mux.Vars(r)["pid"]
	id, ierr := uuid.Parse(idStr)
	if ierr != nil {
		http.Error(w, ierr.Error(), http.StatusNotFound)
		log.Println(ierr.Error)
		return
	}
	s := entity.ShoppingListItem{}
	s.ID = id
	derr := s.MarkAsDone(config.DB)
	if derr != nil {
		http.Error(w, "An error occured while trying to mark shopping list item as done", http.StatusInternalServerError)
		log.Println(derr.Error())
		return
	}
	w.WriteHeader(http.StatusNoContent)
	log.Printf("%+v : HTTP 204/NO COTENT on DELETE /shoppinglist/item-%s/done", time.Now(), s.ID.String())
}

func RetrieveShoppingListHandler(w http.ResponseWriter, r *http.Request) {
	//	allowCors(w)
	shoppingList, lerr := entity.RetrieveShoppingList(config.DB)
	if lerr != nil {
		log.Println(lerr.Error())
		http.Error(w, lerr.Error(), http.StatusInternalServerError)
		return
	}
	serr := sendJsonResponse(w, shoppingList)
	if serr != nil {
		log.Println(serr.Error())
		return
	}
	log.Printf("%+v : HTTP 200/OK on GET /shoppinglist", time.Now())
}
