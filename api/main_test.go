package main

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"net/url"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

// This professor is retired, so the data may not be updated as often
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

// This professor testcase may need to be updated often
const scottDollingerExpectedJSON = `{
	"course_number": "",
	"department": "Computer Science",
	"difficulty": 2.4,
	"grades": {
		"aPlus": 469,
		"a": 601,
		"aMinus": 331,
		"bPlus": 173,
		"b": 166,
		"bMinus": 86,
		"cPlus": 64,
		"c": 49,
		"cMinus": 21,
		"dPlus": 1,
		"d": 27,
		"f": 108,
		"cr": 16,
		"nc": 15,
		"w": 49
	},
	"tags": [
		"Clear Grading Criteria",
		"Caring",
		"Extra Credit",
		"Respected",
		"Accessible Outside Class"
	],
	"id": "2523207",
	"name": "Scott Dollinger",
	"rating": 3.9,
	"subject": "",
	"would_take_again": 86
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

const johnDoeProfessorInfoExpectedJSON = `{
	"course_number": "6399",
	"department": "Accounting",
	"difficulty": 0,
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
	"id": "822366",
	"name": "John Doe",
	"rating": 0,
	"subject": "LATS",
	"tags": null,
	"would_take_again": -1
}`

func TestGetProfessorInformation(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := SetupRouter()

	req := httptest.NewRequest("GET", "/professor_info?course=CS2305", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"detail": "Teacher name not provided"}`, w.Body.String())

	req = httptest.NewRequest("GET", "/professor_info?teacher=*", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"detail": "Invalid teacher name"}`, w.Body.String())

	req = httptest.NewRequest("GET", "/professor_info?teacher=John&course=*", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"detail": "Invalid course name"}`, w.Body.String())

	req = httptest.NewRequest("GET", "/professor_info?teacher="+url.QueryEscape("Timothy Farage"), nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, timothyFarageExpectedJSON, w.Body.String())

	req = httptest.NewRequest("GET", "/professor_info?teacher=Scott%20Dollinger", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	var expected, actual map[string]interface{}
	json.Unmarshal([]byte(scottDollingerExpectedJSON), &expected)
	json.Unmarshal([]byte(w.Body.Bytes()), &actual)
	for key := range expected {
		assert.Equal(t, expected[key], actual[key])
	}

	req = httptest.NewRequest("GET", "/professor_info?teacher=Sue%20Brookshire", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, sueBrookshireExpectedJSON, w.Body.String())

	req = httptest.NewRequest("GET", "/professor_info?teacher=John%20Doe&course=LATS6399", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, johnDoeProfessorInfoExpectedJSON, w.Body.String())
}

const courseInfoExpectedJSON = `{
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
	gin.SetMode(gin.TestMode)
	router := SetupRouter()

	req := httptest.NewRequest("GET", "/course_info", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"detail": "Course name not provided"}`, w.Body.String())

	req = httptest.NewRequest("GET", "/course_info?course=*", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusBadRequest, w.Code)
	assert.JSONEq(t, `{"detail": "Invalid course name"}`, w.Body.String())

	req = httptest.NewRequest("GET", "/course_info?course=lats%206399", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, courseInfoExpectedJSON, w.Body.String())
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

const suggestionsExpectedInfo = `{
	"courses": ["LATS 6399"],
	"professors": ["John Doe"]
}`

func TestSuggestionsSearchQuery(t *testing.T) {
	gin.SetMode(gin.TestMode)
	router := SetupRouter()

	req := httptest.NewRequest("GET", "/suggestions", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, defaultSuggestionsExpectedInfo, w.Body.String())

	req = httptest.NewRequest("GET", "/suggestions?teacher=John%20Doe&course=lats6399", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, suggestionsExpectedInfo, w.Body.String())
}
