package main

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
)

const professorInfoExpectedJSON = `{
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

	req = httptest.NewRequest("GET", "/professor_info?teacher=John%20Doe&course=LATS6399", nil)
	w = httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.JSONEq(t, professorInfoExpectedJSON, w.Body.String())
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
		"Joycelyn Bell",
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
