package db

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

func appendProfessorToSQLQuery(sqlQueryBase string, sqlParams []interface{}, rateMyProfessorName string) (string, []interface{}) {
	if rateMyProfessorName != "" {
		sqlQueryBase += " AND (TRIM(instructor1) LIKE ? OR TRIM(instructor1) LIKE ?)"

		// Sometimes professor names vary between "First Last" and "Last, First" formats.
		// Example: In the database, Bhadrachalam Chitturi is stored as "Bhadrachalam, Chitturi", but in RateMyProfessor, it appears as "Chitturi Bhadrachalam".
		sqlParams = append(sqlParams, fmt.Sprintf("%%%s%%%s%%", strings.Fields(rateMyProfessorName)[0], strings.Fields(rateMyProfessorName)[1]))
		sqlParams = append(sqlParams, fmt.Sprintf("%%%s%%%s%%", strings.Fields(rateMyProfessorName)[1], strings.Fields(rateMyProfessorName)[0]))
	}
	return sqlQueryBase, sqlParams
}

func appendCourseToSQLQuery(sqlQueryBase string, sqlParams []interface{}, subject, courseNumber string) (string, []interface{}) {
	if subject != "" && courseNumber != "" {
		sqlQueryBase += " AND subject = ? AND catalogNumber = ?"
		sqlParams = append(sqlParams, strings.ToUpper(subject), courseNumber)
	}
	return sqlQueryBase, sqlParams
}

func GetAggregatedGrades(rateMyProfessorName, subject, courseNumber string) GradeStruct {
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
        WHERE 1 = 1`

	sqlParams := []interface{}{}

	sqlQueryBase, sqlParams = appendProfessorToSQLQuery(sqlQueryBase, sqlParams, rateMyProfessorName)
	sqlQueryBase, sqlParams = appendCourseToSQLQuery(sqlQueryBase, sqlParams, subject, courseNumber)

	var aggregatedData GradeStruct

	err := db.QueryRow(sqlQueryBase, sqlParams...).Scan(
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
