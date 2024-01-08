package server

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/controllers"
	"github.com/GiridharRNair/ProfStats-GinAPI/middleware"
	"github.com/gin-gonic/gin"
)

func setUpRouter() *gin.Engine {
	router := gin.Default()
	router.Use(middleware.AllowedOrigins())

	router.GET("/professor_info", controllers.GetProfessorInformation)
	router.GET("/course_info", controllers.GetCourseInformation)
	router.GET("/suggestions", controllers.SuggestionsSearchQuery)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"detail": "Not Found"})
	})

	return router
}
