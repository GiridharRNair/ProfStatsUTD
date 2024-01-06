// Remove once all users have updated to the new extension version
package database

import (
	"fmt"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

func GetProfessorCourses(teacher string) ([]string, error) {
	professor := strings.ReplaceAll(teacher, " ", "%")

	rows, err := db.Query("SELECT DISTINCT subject, catalogNumber FROM grades_populated WHERE TRIM(instructor1) LIKE ?", "%"+professor+"%")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	courses := []string{}

	for rows.Next() {
		var subject, catalogNumber string
		err := rows.Scan(&subject, &catalogNumber)
		if err != nil {
			return nil, err
		}

		course := fmt.Sprintf("%s %s", subject, catalogNumber)
		courses = append(courses, course)
	}

	return courses, nil
}
