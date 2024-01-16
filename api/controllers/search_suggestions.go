package controllers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/GiridharRNair/ProfStats-GinAPI/utils"
	"github.com/gin-gonic/gin"
)

func SuggestionsSearchQuery(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	if teacher == "" && course == "" {
		c.JSON(http.StatusOK, gin.H{"professors": utils.DefaultProfessorSuggestions, "courses": utils.DefaultCourseSuggestions})
		return
	}

	defaultSuggestions := make(map[string][]string)

	professorSuggestions, err := db.GetProfessorSuggestions(teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	defaultSuggestions["professors"] = professorSuggestions

	subject, courseNumber, _ := isValidCourseName(course)

	courseSuggestions, err := db.GetCourseSuggestions(teacher, subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	defaultSuggestions["courses"] = courseSuggestions

	c.JSON(http.StatusOK, defaultSuggestions)
}
