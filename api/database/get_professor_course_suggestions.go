package database

import (
	"fmt"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/utils"
	_ "github.com/mattn/go-sqlite3"
)

func GetProfessorCourseSuggestions(professorParam, subjectParam, courseNumberParam string) (map[string][]string, error) {
	professor := formatSQLParam(professorParam)
	subject := formatSQLParam(subjectParam)
	courseNumber := formatSQLParam(courseNumberParam)

	professorQuery := `
		SELECT DISTINCT instructor1
		FROM grades_populated
		WHERE TRIM(instructor1) LIKE ?
		LIMIT 5
	`

	professorRows, err := db.Query(professorQuery, professor)
	if err != nil {
		return nil, err
	}
	defer professorRows.Close()

	professorSuggestions := []string{}
	for professorRows.Next() {
		var fullName string
		if err := professorRows.Scan(&fullName); err != nil {
			return nil, err
		}

		nameArray := strings.Fields(fullName)
		nameWithoutMiddle := fmt.Sprintf("%s %s", nameArray[0], nameArray[len(nameArray)-1])
		if !utils.StringInSlice(nameWithoutMiddle, professorSuggestions) {
			professorSuggestions = append(professorSuggestions, nameWithoutMiddle)
		}
	}

	courseQuery := `
		SELECT DISTINCT subject, catalogNumber
		FROM grades_populated
		WHERE subject LIKE ?
		AND catalogNumber LIKE ?
		AND instructor1 LIKE ?
		LIMIT 5
	`

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

		if !utils.StringInSlice(subject+" "+catalogNumber, courseSuggestions) {
			courseSuggestions = append(courseSuggestions, subject+" "+catalogNumber)
		}
	}

	result := map[string][]string{
		"professors": professorSuggestions,
		"courses":    courseSuggestions,
	}

	return result, nil
}
