package handlers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/database"
	"github.com/gin-gonic/gin"
)

func SuggestionsSearchQuery(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	subject, courseNumber, _ := isValidCourseName(course)

	suggestions, err := database.GetProfessorCourseSuggestions(teacher, subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, suggestions)
}
