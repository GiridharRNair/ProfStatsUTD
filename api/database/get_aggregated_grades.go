package database

import (
	"fmt"
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

func GetAggregatedGrades(professor, subject, courseNumber string) GradeStruct {
	sqlQueryBase := `
        SELECT 
            SUM(aPlus) as APlus, 
            SUM(a) as A, 
            SUM(aMinus) as AMinus, 
            SUM(bPlus) as BPlus, 
            SUM(b) as B, 
            SUM(bMinus) as BMinus,
            SUM(cPlus) as CPlus, 
            SUM(c) as C, 
            SUM(cMinus) as CMinus, 
            SUM(dPlus) as DPlus, 
            SUM(d) as D, 
            SUM(dMinus) as DMinus,
            SUM(f) as F, 
            SUM(cr) as CR, 
            SUM(nc) as NC, 
            SUM(p) as P, 
            SUM(w) as W, 
            SUM(i) as I, 
            SUM(nf) as NF
        FROM grades_populated 
        WHERE (TRIM(instructor1) LIKE ? OR TRIM(instructor1) LIKE ?)`

	// The database sometimes stores the professor's name as "Last, First" or sometimes as "First Last"
	sqlParams := []interface{}{
		formatSQLParam(professor),
		formatSQLParam(strings.Join(strings.Split(professor, " ")[1:], "") + " " + strings.Join(strings.Split(professor, " ")[:1], "")),
	}

	sqlQuery := sqlQueryBase

	if subject != "" && courseNumber != "" {
		sqlQuery = fmt.Sprintf("%s AND subject = ? AND catalogNumber = ?", sqlQueryBase)
		sqlParams = append(sqlParams, strings.ToUpper(subject), courseNumber)
	}

	var aggregatedData GradeStruct

	err := db.QueryRow(sqlQuery, sqlParams...).Scan(
		&aggregatedData.APlus,
		&aggregatedData.A,
		&aggregatedData.AMinus,
		&aggregatedData.BPlus,
		&aggregatedData.B,
		&aggregatedData.BMinus,
		&aggregatedData.CPlus,
		&aggregatedData.C,
		&aggregatedData.CMinus,
		&aggregatedData.DPlus,
		&aggregatedData.D,
		&aggregatedData.DMinus,
		&aggregatedData.F,
		&aggregatedData.CR,
		&aggregatedData.NC,
		&aggregatedData.P,
		&aggregatedData.W,
		&aggregatedData.I,
		&aggregatedData.NF,
	)

	if err != nil {
		return GradeStruct{}
	}

	return aggregatedData
}
