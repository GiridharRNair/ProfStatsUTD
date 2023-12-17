package main

import (
	"database/sql"
	"fmt"
	"os"
	"strings"

	_ "github.com/mattn/go-sqlite3"
)

type GradeStruct struct {
	APlus  int `json:"aPlus,omitempty"`
	A      int `json:"a,omitempty"`
	AMinus int `json:"aMinus,omitempty"`
	BPlus  int `json:"bPlus,omitempty"`
	B      int `json:"b,omitempty"`
	BMinus int `json:"bMinus,omitempty"`
	CPlus  int `json:"cPlus,omitempty"`
	C      int `json:"c,omitempty"`
	CMinus int `json:"cMinus,omitempty"`
	DPlus  int `json:"dPlus,omitempty"`
	D      int `json:"d,omitempty"`
	DMinus int `json:"dMinus,omitempty"`
	F      int `json:"f,omitempty"`
	CR     int `json:"cr,omitempty"`
	NC     int `json:"nc,omitempty"`
	P      int `json:"p,omitempty"`
	W      int `json:"w,omitempty"`
	I      int `json:"i,omitempty"`
	NF     int `json:"nf,omitempty"`
}

var db *sql.DB

func init() {
	currentDir, err := os.Getwd()
	if err != nil {
		fmt.Print(err)
	}

	db, err = sql.Open("sqlite3", fmt.Sprintf("%s/utdgrades.db", currentDir))
	if err != nil {
		fmt.Print(err)
	}
}

func aggregateGrades(professor, subject, courseNumber string) (GradeStruct, error) {
	sqlQueryBase := `
        SELECT aPlus, a, aMinus, bPlus, b, bMinus,
               cPlus, c, cMinus, dPlus, d, dMinus,
               f, cr, nc, p, w, i, nf
        FROM grades_populated 
        WHERE (TRIM(instructor1) LIKE ? OR TRIM(instructor1) LIKE ?)
    `

	// The database sometimes stores the professor's name as "Last, First" or sometimes as "First Last"
	sqlParams := []interface{}{
		"%" + strings.ReplaceAll(professor, " ", "%") + "%",
		"%" + strings.Join(strings.Split(professor, " ")[1:], "") + "%" + strings.Join(strings.Split(professor, " ")[:1], "") + "%",
	}

	sqlQuery := ""

	if subject != "" && courseNumber != "" {
		sqlQuery = fmt.Sprintf("%s AND subject = ? AND catalogNumber = ?", sqlQueryBase)
		sqlParams = append(sqlParams, strings.ToUpper(subject), courseNumber)
	} else {
		sqlQuery = sqlQueryBase
	}

	rows, err := db.Query(sqlQuery, sqlParams...)
	if err != nil {
		return GradeStruct{}, err
	}
	defer rows.Close()

	columns, err := rows.Columns()
	if err != nil {
		return GradeStruct{}, err
	}

	values := make([]interface{}, len(columns))
	for i := range values {
		values[i] = new(int)
	}

	aggregatedData := GradeStruct{}

	for rows.Next() {
		err := rows.Scan(values...)
		if err != nil {
			return aggregatedData, err
		}

		gradeMappings := map[string]*int{
			"aPlus":  &aggregatedData.APlus,
			"a":      &aggregatedData.A,
			"aMinus": &aggregatedData.AMinus,
			"bPlus":  &aggregatedData.BPlus,
			"b":      &aggregatedData.B,
			"bMinus": &aggregatedData.BMinus,
			"cPlus":  &aggregatedData.CPlus,
			"c":      &aggregatedData.C,
			"cMinus": &aggregatedData.CMinus,
			"dPlus":  &aggregatedData.DPlus,
			"d":      &aggregatedData.D,
			"dMinus": &aggregatedData.DMinus,
			"f":      &aggregatedData.F,
			"cr":     &aggregatedData.CR,
			"nc":     &aggregatedData.NC,
			"p":      &aggregatedData.P,
			"w":      &aggregatedData.W,
			"i":      &aggregatedData.I,
			"nf":     &aggregatedData.NF,
		}

		for i, column := range columns {
			if field, ok := gradeMappings[column]; ok {
				*field += *(values[i].(*int))
			}
		}
	}

	return aggregatedData, nil
}

func stringInSlice(a string, list []string) bool {
	for _, b := range list {
		if b == a {
			return true
		}
	}
	return false
}

func getProfessorSuggestions(teacher string) ([]string, error) {
	professor := strings.ReplaceAll(teacher, " ", "%")

	query := "SELECT DISTINCT instructor1 FROM grades_populated WHERE TRIM(instructor1) LIKE ? LIMIT 5"
	rows, err := db.Query(query, "%"+professor+"%")
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
		if !stringInSlice(nameWithoutMiddle, professorSuggestions) {
			professorSuggestions = append(professorSuggestions, nameWithoutMiddle)
		}
	}

	return professorSuggestions, nil
}

func getProfessorCourses(teacher string) ([]string, error) {
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
