package main

import (
	"database/sql"
	"log"
	"net/http"
	"os"

	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
	"github.com/p-weisk/sparschwein/config"
	"github.com/rs/cors"
)

// DB handle
var DB *sql.DB

func main() {
	// read stuff from .env
	dotenvpath, customPath := os.LookupEnv("SPARSCHWEINENVPATH")
	var dotenverr error
	if customPath {
		dotenverr = godotenv.Load(dotenvpath)
	} else {
		dotenverr = godotenv.Load()
	}
	if dotenverr != nil {
		log.Fatalf("Error loading .env file: %s", dotenverr.Error())
	}

	dbuser := os.Getenv("dbuser")
	dbkey := os.Getenv("dbkey")
	dbloc := os.Getenv("dbloc")
	dbport := os.Getenv("dbport")
	allowedorigin := os.Getenv("allowedorigin")
	serverhost := os.Getenv("sparschweinhost")

	// create database handle
	var dsnerr error
	config.DB, dsnerr = sql.Open("mysql", dbuser+":"+dbkey+"@tcp("+dbloc+":"+dbport+")/sparschwein?parseTime=true")
	if dsnerr != nil {
		log.Fatalf("DSN seems invalid: %+v", dsnerr)
	}
	defer DB.Close()

	r := mux.NewRouter()
	registerRoutes(r)
	log.Println(allowedorigin)
	c := cors.New(cors.Options{
		AllowedOrigins:   []string{allowedorigin},
		AllowedMethods:   []string{"GET", "POST", "DELETE"},
		AllowedHeaders:   []string{"*"},
		AllowCredentials: true,
		// Enable Debugging for testing, consider disabling in production
		Debug: true,
	})

	http.ListenAndServe(serverhost + ":8000", c.Handler(r))
}
