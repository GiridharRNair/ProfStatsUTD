package controllers

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

type TestCases struct {
	path         string
	expectedCode int
	expectedJSON string
}

var router *gin.Engine

func init() {
	router = gin.Default()
	router.GET("/professor_info", GetProfessorInformation)
	router.GET("/course_info", GetCourseInformation)
	router.GET("/suggestions", SuggestionsSearchQuery)
}

func testAPIEndpoint(t *testing.T, testCases []TestCases, handlerFunc func(*gin.Context)) {
	for _, tc := range testCases {
		req := httptest.NewRequest("GET", tc.path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, tc.expectedCode, w.Code)
		assert.JSONEq(t, tc.expectedJSON, w.Body.String())
	}
}

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
		"Hilarious",
		"Respected",
		"Graded By Few Things",
		"Amazing Lectures",
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

	testAPIEndpoint(t, testCases, GetProfessorInformation)
}

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

	testAPIEndpoint(t, testCases, GetCourseInformation)
}

const defaultSuggestionsExpectedInfo = `{
	"courses": [
		"CS 2305",
		"MATH 2418",
		"CHEM 2401",
		"ACCT 6305",
		"SPAN 2311"
	],
	"professors": [
		"Regina Ybarra",
		"James Willson",
		"Stephanie Taylor",
		"Bentley Garrett",
		"Karl Sengupta"
	]
}`

const johnDoeSuggestionsExpectedInfo = `{
	"courses": ["LATS 6399"],
	"professors": ["John Doe"]
}`

const cs2337SuggestionsExpectedInfo = `{
	"courses": ["CS 2337"],
	"professors": [
		"Regina Ybarra",
		"James Willson",
		"Stephanie Taylor",
		"Bentley Garrett",
		"Karl Sengupta"
	]
}`

func TestSuggestionsSearchQuery(t *testing.T) {
	testCases := []TestCases{
		{"/suggestions", http.StatusOK, defaultSuggestionsExpectedInfo},
		{"/suggestions?teacher=John%20Doe&course=lats6399", http.StatusOK, johnDoeSuggestionsExpectedInfo},
		{"/suggestions?course=CS2337", http.StatusOK, cs2337SuggestionsExpectedInfo},
	}

	testAPIEndpoint(t, testCases, SuggestionsSearchQuery)

	// Seperate test to check the length of the courses array
	var jsonResponse map[string]interface{}
	req := httptest.NewRequest("GET", "/suggestions?teacher=jey", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &jsonResponse))
	assert.GreaterOrEqual(t, len(jsonResponse["courses"].([]interface{})), 5)
}
