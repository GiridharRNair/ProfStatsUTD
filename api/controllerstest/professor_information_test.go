package controllerstest

import (
	"net/http"
	"net/url"
	"testing"
)

const timothyFarageExpectedJSON = `{
	"course_number": "",
	"department": "Computer Science",
	"difficulty": 2.1,
	"grades": {
		"a":1186, 
		"aMinus":277, 
		"aPlus":1026, 
		"b":296, 
		"bMinus":77, 
		"bPlus":232, 
		"c":129, 
		"cMinus":44, 
		"cPlus":60, 
		"cr":29, 
		"d":34, 
		"dMinus":25, 
		"dPlus":26, 
		"f":47, 
		"nc":5, 
		"w":40
	},
	"id": "138341",
	"name": "Timothy Farage",
	"rating": 4.2,
	"subject": "",
	"tags": [
		"Amazing Lectures",
		"Graded By Few Things",
		"Hilarious",
		"Respected",
		"Test Heavy"
	],
	"would_take_again": 78
}`

func TestGetProfessorInformation(t *testing.T) {
	testCases := []TestCases{
		{"/professor_info?course=CS2305", http.StatusBadRequest, `{"detail": "Teacher name not provided"}`},
		{"/professor_info?teacher=*", http.StatusBadRequest, `{"detail": "Invalid teacher name"}`},
		{"/professor_info?teacher=thisteacherdoesnotexist", http.StatusInternalServerError, `{"detail": "Professor not found"}`},
		{"/professor_info?teacher=John&course=*", http.StatusBadRequest, `{"detail": "Invalid course name"}`},
		{"/professor_info?teacher=" + url.QueryEscape("Timothy Farage"), http.StatusOK, timothyFarageExpectedJSON},
	}

	testAPIEndpoint(t, testCases)
}
