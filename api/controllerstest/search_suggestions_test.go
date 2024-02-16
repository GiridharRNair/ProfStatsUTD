package controllerstest

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
	"github.com/stretchr/testify/assert"
)

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
	"courses": ["ACCT 6399", "LATS 6399"],
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
		{"/suggestions?teacher=John%20Doe&course=", http.StatusOK, johnDoeSuggestionsExpectedInfo},
		{"/suggestions?course=CS2337", http.StatusOK, cs2337SuggestionsExpectedInfo},
	}

	testAPIEndpoint(t, testCases, controllers.SuggestionsSearchQuery)

	// Seperate test to check the length of the courses array
	var jsonResponse map[string]interface{}
	req := httptest.NewRequest("GET", "/suggestions?teacher=jey", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)
	assert.Equal(t, http.StatusOK, w.Code)
	assert.NoError(t, json.Unmarshal(w.Body.Bytes(), &jsonResponse))
	assert.GreaterOrEqual(t, len(jsonResponse["courses"].([]interface{})), 5)
}
