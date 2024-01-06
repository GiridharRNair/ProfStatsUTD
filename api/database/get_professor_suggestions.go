// Remove once all users have updated to the new extension version
package database

import (
	"fmt"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/utils"
	_ "github.com/mattn/go-sqlite3"
)

func GetProfessorSuggestions(teacher string) ([]string, error) {
	professor := strings.ReplaceAll(teacher, " ", "%")

	rows, err := db.Query("SELECT DISTINCT instructor1 FROM grades_populated WHERE TRIM(instructor1) LIKE ? LIMIT 5", "%"+professor+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	professorSuggestions := []string{}

	for rows.Next() {
		var fullName string
		if err := rows.Scan(&fullName); err != nil {
			return nil, err
		}

		nameArray := strings.Fields(fullName)
		nameWithoutMiddle := fmt.Sprintf("%s %s", nameArray[0], nameArray[len(nameArray)-1])
		if !utils.StringInSlice(nameWithoutMiddle, professorSuggestions) {
			professorSuggestions = append(professorSuggestions, nameWithoutMiddle)
		}
	}

	return professorSuggestions, nil
}
