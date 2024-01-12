package db

import (
	"database/sql"
	"fmt"
	"os"
	"path/filepath"

	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

func init() {
	dir, err := os.Getwd()
	if err != nil {
		fmt.Println("Error getting current directory.")
		return
	}

	dbPath := filepath.Join(dir, "db/utdgrades.db")

	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Print(err)
	}
}
