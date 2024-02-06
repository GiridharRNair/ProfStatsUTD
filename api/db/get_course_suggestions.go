package db

import (
	"slices"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

func GetCourseSuggestions(professorParam, subjectParam, courseNumberParam string) ([]string, error) {
	professor := "%" + strings.ReplaceAll(professorParam, " ", "%") + "%"
	subject := subjectParam + "%"
	courseNumber := courseNumberParam + "%"

	courseQuery := `
		SELECT DISTINCT subject, catalogNumber
		FROM grades_populated
		WHERE subject LIKE ?
		AND catalogNumber LIKE ?
		AND instructor1 LIKE ?`

	if professorParam == "" {
		courseQuery += " LIMIT 5"
	}

	courseRows, err := db.Query(courseQuery, subject, courseNumber, professor)
	if err != nil {
		return nil, err
	}
	defer courseRows.Close()

	courseSuggestions := []string{}
	for courseRows.Next() {
		var subject, catalogNumber string
		err := courseRows.Scan(&subject, &catalogNumber)
		if err != nil {
			return nil, err
		}

		if !slices.Contains(courseSuggestions, subject+" "+catalogNumber) {
			courseSuggestions = append(courseSuggestions, subject+" "+catalogNumber)
		}
	}

	return courseSuggestions, nil
}
