package controllerstest

import (
	"net/http"
	"net/url"
	"testing"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
)

const courseInfoExpectedJSON = `{
	"catalog_url": "https://catalog.utdallas.edu/2023/graduate/courses/lats6399",
	"course_name": "Capstone Project in Latin American Studies",
	"course_number": "6399",
	"grades": {
		"aPlus": 2,
		"a": 1,
		"aMinus": 2,
		"bPlus": 3,
		"b": 1,
		"cPlus": 2,
		"cMinus": 3,
		"dPlus": 1,
		"dMinus": 1,
		"f": 1
	},
	"subject": "LATS"
}`

func TestGetCourseInformation(t *testing.T) {
	testCases := []TestCases{
		{"/course_info", http.StatusBadRequest, `{"detail": "Course name not provided"}`},
		{"/course_info?course=*", http.StatusBadRequest, `{"detail": "Invalid course name"}`},
		{"/course_info?course=" + url.QueryEscape("cs 2222"), http.StatusInternalServerError, `{"detail": "course not found in the 2023 catalog"}`},
		{"/course_info?course=lats%206399", http.StatusOK, courseInfoExpectedJSON},
	}

	testAPIEndpoint(t, testCases, controllers.GetCourseInformation)
}
