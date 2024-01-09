package main

import (
	"net/http"
	"slices"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
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

		if !slices.Contains(allowedOrigins, origin) {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Not allowed"})
			c.Abort()
		}
	}
}

func setupRouter() *gin.Engine {
	router := gin.Default()
	router.Use(allowedOrigins())

	router.GET("/professor_info", controllers.GetProfessorInformation)
	router.GET("/course_info", controllers.GetCourseInformation)
	router.GET("/suggestions", controllers.SuggestionsSearchQuery)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"detail": "Not Found"})
	})

	return router
}

func main() {
	router := setupRouter()

	err := router.Run(":80")
	if err != nil {
		panic(err)
	}
}
