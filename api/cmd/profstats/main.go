package main

import (
	"fmt"
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/handlers"
	"github.com/GiridharRNair/ProfStats-GinAPI/utils"
	"github.com/gin-gonic/gin"
)

func allowedOrigins() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")

		allowedOrigins := []string{
			"http://localhost:5173",
			"chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff",
		}
		origin := c.GetHeader("Origin")

		if !utils.StringInSlice(origin, allowedOrigins) {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Not allowed"})
			c.Abort()
		}
	}
}

func main() {
	router := gin.Default()
	router.Use(allowedOrigins())

	router.GET("/professor_info", handlers.GetProfessorInformation)
	router.GET("/course_info", handlers.GetCourseInformation)
	router.GET("/suggestions", handlers.SuggestionsSearchQuery)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"detail": "Not Found"})
	})

	// Remove once all users have updated to the new extension version
	router.GET("/professor_suggestions", handlers.GetProfessorSuggestions)
	router.GET("/professor_courses", handlers.GetProfessorCoursesSuggestions)

	err := router.Run(":80")
	if err != nil {
		fmt.Println(err)
	}
}
