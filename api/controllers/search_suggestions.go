package controllers

import (
	"net/http"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/gin-gonic/gin"
)

var defaultProfessorSuggestions = []string{"Regina Ybarra", "James Willson", "Stephanie Taylor", "Bentley Garrett", "Karl Sengupta"}

var defaultCourseSuggestions = []string{"CS 2305", "MATH 2418", "CHEM 2401", "ACCT 6305", "SPAN 2311"}

func SuggestionsSearchQuery(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	teacher = strings.TrimSpace(teacher)
	course = strings.TrimSpace(course)

	if teacher == "" && course == "" {
		c.JSON(http.StatusOK, gin.H{"professors": defaultProfessorSuggestions, "courses": defaultCourseSuggestions})
		return
	}

	defaultSuggestions := make(map[string][]string)

	if teacher != "" {
		professorSuggestions, err := db.GetProfessorSuggestions(teacher)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
			return
		}

		defaultSuggestions["professors"] = professorSuggestions
	} else {
		defaultSuggestions["professors"] = defaultProfessorSuggestions
	}

	subject, courseNumber, _ := isValidCourseName(course)

	courseSuggestions, err := db.GetCourseSuggestions(teacher, subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	defaultSuggestions["courses"] = courseSuggestions

	c.JSON(http.StatusOK, defaultSuggestions)
}
