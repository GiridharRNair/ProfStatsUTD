package controllers

import (
	"net/http"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/db"

	"github.com/GiridharRNair/ProfStats-GinAPI/course"
	"github.com/gin-gonic/gin"
)

var defaultProfessorSuggestions = []string{"Regina Ybarra", "James Willson", "Stephanie Taylor", "Bentley Garrett", "Karl Sengupta"}

var defaultCourseSuggestions = []string{"CS 2305", "MATH 2418", "CHEM 2401", "ACCT 6305", "SPAN 2311"}

func SuggestionsSearchQuery(c *gin.Context) {
	teacherQuery := c.Query("teacher")
	courseQuery := c.Query("course")

	teacherQuery = strings.TrimSpace(teacherQuery)
	courseQuery = strings.TrimSpace(courseQuery)

	if teacherQuery == "" && courseQuery == "" {
		c.JSON(http.StatusOK, gin.H{"professors": defaultProfessorSuggestions, "courses": defaultCourseSuggestions})
		return
	}

	defaultSuggestions := make(map[string][]string)

	if teacherQuery != "" {
		professorSuggestions, err := db.GetProfessorSuggestions(teacherQuery)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
			return
		}

		defaultSuggestions["professors"] = professorSuggestions
	} else {
		defaultSuggestions["professors"] = defaultProfessorSuggestions
	}

	subject, courseNumber, _ := course.IsValidCourseName(courseQuery)

	courseSuggestions, err := db.GetCourseSuggestions(teacherQuery, subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	defaultSuggestions["courses"] = courseSuggestions

	c.JSON(http.StatusOK, defaultSuggestions)
}
