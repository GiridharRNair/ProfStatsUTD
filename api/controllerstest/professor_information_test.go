package controllerstest

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
)

const timothyFarageExpectedJSON = `{
	"course_number": "",
	"department": "Computer Science",
	"difficulty": 2.3,
	"grades": {
		"aPlus": 921,
		"a": 1075,
		"aMinus": 264,
		"bPlus": 226,
		"b": 292,
		"bMinus": 77,
		"cPlus": 60,
		"c": 129,
		"cMinus": 44,
		"dPlus": 26,
		"d": 34,
		"dMinus": 25,
		"f": 46,
		"cr": 29,
		"nc": 5,
		"w": 40
	},
	"id": "138341",
	"name": "Timothy Farage",
	"rating": 4.3,
	"subject": "",
	"tags": [
		"Amazing Lectures",
		"Graded By Few Things",
		"Hilarious",
		"Respected",
		"Test Heavy"
	],
	"would_take_again": 81
}`

const sueBrookshireExpectedJSON = `{
	"course_number": "",
	"department": "Education",
	"difficulty": 2,
	"grades": {
		"f": 10,
		"p": 357,
		"w": 3
	},
	"id": "1588418",
	"name": "Susan Brookshire",
	"rating": 4.5,
	"subject": "",
	"tags": null,
	"would_take_again": -1
}`

func TestGetProfessorInformation(t *testing.T) {
	testCases := []TestCases{
		{"/professor_info?course=CS2305", http.StatusBadRequest, `{"detail": "Teacher name not provided"}`},
		{"/professor_info?teacher=*", http.StatusBadRequest, `{"detail": "Invalid teacher name"}`},
		{"/professor_info?teacher=thisteacherdoesnotexist", http.StatusInternalServerError, `{"detail": "Professor not found"}`},
		{"/professor_info?teacher=John&course=*", http.StatusBadRequest, `{"detail": "Invalid course name"}`},
		{"/professor_info?teacher=" + url.QueryEscape("Timothy Farage"), http.StatusOK, timothyFarageExpectedJSON},
		{"/professor_info?teacher=Sue%20Brookshire", http.StatusOK, sueBrookshireExpectedJSON},
	}

	testAPIEndpoint(t, testCases, controllers.GetProfessorInformation)
}
