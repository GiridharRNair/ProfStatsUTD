package middleware

import (
	"net/http"
	"slices"

	"github.com/gin-gonic/gin"
)

func AllowedOrigins() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")

		allowedOrigins := []string{
			"http://localhost:5173",
			"chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff",
			"",
		}
		origin := c.GetHeader("Origin")

		if !slices.Contains(allowedOrigins, origin) {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Not allowed"})
			c.Abort()
		}
	}
}
