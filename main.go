package main

import (
	"database/sql"
	"fmt"
	"log"
	"net"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/rs/cors"
)

// DB handle
var DB *sql.DB

func main() {
	// create database handle
	var dsnerr error
	DB, dsnerr = sql.Open("mysql", "dev:dev@tcp(db:3306)/sparschwein?parseTime=true")
	if dsnerr != nil {
		log.Fatalf("DSN seems invalid: %+v", dsnerr)
	}
	defer DB.Close()

	r := mux.NewRouter()
	registerRoutes(&r)

	c := cors.New(cors.Options{
		AllowedOrigins:   []string{"*"},
		AllowedMethods:   []string{"GET", "POST"},
		AllowCredentials: true,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})

	http.ListenAndServe(":8000", c.Handler(r))
}