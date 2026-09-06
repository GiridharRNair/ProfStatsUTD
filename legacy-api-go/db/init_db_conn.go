package db

import (
	"database/sql"
	"fmt"
	"path/filepath"
	"runtime"
)

var db *sql.DB

func init() {
	_, filename, _, ok := runtime.Caller(0)
	if !ok {
		fmt.Println("Error getting the current file path.")
		return
	}

	dir := filepath.Dir(filename)
	dbPath := filepath.Join(dir, "utdgrades.db")

	var err error
	db, err = sql.Open("sqlite3", dbPath)
	if err != nil {
		fmt.Println(err)
	}
}
