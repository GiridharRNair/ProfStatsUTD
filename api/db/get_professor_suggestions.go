package db

import (
	"fmt"
	"slices"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

var defaultProfessorSuggestions = []string{"Joycelyn Bell", "James Willson", "Stephanie Taylor", "Bentley Garrett", "Karl Sengupta"}

func GetProfessorSuggestions(professorParam string) ([]string, error) {
	if professorParam == "" {
		return defaultProfessorSuggestions, nil
	}

	professor := "%" + strings.ReplaceAll(professorParam, " ", "%") + "%"

	professorQuery := `
		SELECT DISTINCT instructor1
		FROM grades_populated
		WHERE TRIM(instructor1) LIKE ?
		LIMIT 5`

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
		if !slices.Contains(professorSuggestions, nameWithoutMiddle) {
			professorSuggestions = append(professorSuggestions, nameWithoutMiddle)
		}
	}

	return professorSuggestions, nil
}
