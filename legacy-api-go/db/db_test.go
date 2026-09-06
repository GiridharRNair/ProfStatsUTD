package db

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

var expectedGrades = GradeStruct{
	APlus:  2,
	A:      1,
	AMinus: 2,
	BPlus:  3,
	B:      1,
	BMinus: 0,
	CPlus:  2,
	C:      0,
	CMinus: 3,
	DPlus:  1,
	D:      0,
	DMinus: 1,
	F:      1,
	CR:     0,
	NC:     0,
	P:      0,
	W:      0,
	I:      0,
	NF:     0,
}

func TestDB(t *testing.T) {
	aggregatedGradesWithProf := GetAggregatedGrades("John Doe", "LATS", "6399")
	assert.Equal(t, expectedGrades, aggregatedGradesWithProf, "Grade distribution mismatch")

	aggregatedGradesWithoutProf := GetAggregatedGrades("", "LATS", "6399")
	assert.Equal(t, expectedGrades, aggregatedGradesWithoutProf, "Grade distribution mismatch")

	courseSuggestion, err := GetCourseSuggestions("John Doe", "LATS", "6399")
	assert.NoError(t, err, "Unexpected error for a valid course")
	assert.Equal(t, []string{"LATS 6399"}, courseSuggestion, "Course suggestion mismatch")

	professorSuggestion, err := GetProfessorSuggestions("John Doe")
	assert.NoError(t, err, "Unexpected error for a valid professor")
	assert.Equal(t, []string{"John Doe"}, professorSuggestion, "Professor suggestion mismatch")
}
