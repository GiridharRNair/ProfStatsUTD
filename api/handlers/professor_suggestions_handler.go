// Remove once all users have updated to the new extension version
package handlers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/database"
	"github.com/gin-gonic/gin"
)

func GetProfessorSuggestions(c *gin.Context) {
	teacher := c.Query("teacher")
	suggestions, err := database.GetProfessorSuggestions(teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, suggestions)
}
