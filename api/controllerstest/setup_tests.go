package controllerstest

import (
	"net/http/httptest"
	"testing"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
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
	router.GET("/professor_info", controllers.GetProfessorInformation)
	router.GET("/course_info", controllers.GetCourseInformation)
	router.GET("/suggestions", controllers.SuggestionsSearchQuery)
}

func testAPIEndpoint(t *testing.T, testCases []TestCases) {
	for _, tc := range testCases {
		req := httptest.NewRequest("GET", tc.path, nil)
		w := httptest.NewRecorder()
		router.ServeHTTP(w, req)

		assert.Equal(t, tc.expectedCode, w.Code)
		assert.JSONEq(t, tc.expectedJSON, w.Body.String())
	}
}
