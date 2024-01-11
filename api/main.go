package main

import (
	"net/http"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
	"github.com/gin-gonic/gin"
)

func allowedOrigins() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")

		origin := c.GetHeader("Origin")

		if origin != "http://localhost:5173" && !strings.HasPrefix(origin, "chrome-extension://") {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Not allowed"})
			c.Abort()
		}
	}
}

func SetupRouter() *gin.Engine {
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
	router := SetupRouter()

	err := router.Run(":80")
	if err != nil {
		panic(err)
	}
}
