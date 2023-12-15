package main

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

func getProfessorInformation(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	if teacher == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Teacher name not provided"})
		return
	}

	formattedCourseName := strings.ToUpper(strings.ReplaceAll(course, " ", ""))
	var subject, courseNumber string

	if formattedCourseName != "" {
		match := regexp.MustCompile(`([a-zA-Z]+)([0-9Vv]+)`).FindStringSubmatch(formattedCourseName)
		if len(match) == 3 && len(match[2]) == 4 {
			subject, courseNumber = match[1], match[2]
		} else {
			c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid course name"})
			return
		}
	}

	professor, err := getRMPInfo(strings.TrimSpace(teacher))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	gradesData, err := aggregateGrades(professor.Name, subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	resultData := gin.H{
		"id":               professor.ID,
		"name":             professor.Name,
		"department":       professor.Department,
		"grades":           gradesData,
		"subject":          subject,
		"course_number":    courseNumber,
		"rating":           professor.Rating,
		"difficulty":       professor.Difficulty,
		"would_take_again": professor.WouldTakeAgain,
		"tags":             professor.Tags,
	}

	c.JSON(http.StatusOK, resultData)
}

func getProfessorSuggestionsRoute(c *gin.Context) {
	teacher := c.Query("teacher")
	suggestions, err := getProfessorSuggestions(teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, suggestions)
}

func getProfessorCoursesRoute(c *gin.Context) {
	teacher := c.Query("teacher")
	suggestions, err := getProfessorCourses(teacher)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	c.JSON(http.StatusOK, suggestions)
}

func allowedOrigins() gin.HandlerFunc {
	return func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET")

		allowedOrigins := []string{"http://localhost:5173", "chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff"}
		origin := c.GetHeader("Origin")

		if stringInSlice(origin, allowedOrigins) {
			c.Next()
		} else {
			c.JSON(http.StatusForbidden, gin.H{"detail": "Not allowed"})
			c.Abort()
		}
	}
}

func main() {
	defer db.Close()

	router := gin.Default()
	router.Use(allowedOrigins())

	router.GET("/professor_info", getProfessorInformation)
	router.GET("/professor_suggestions", getProfessorSuggestionsRoute)
	router.GET("/professor_courses", getProfessorCoursesRoute)

	router.NoRoute(func(c *gin.Context) {
		c.JSON(http.StatusNotFound, gin.H{"detail": "Not Found"})
	})

	err := router.Run(":80")
	if err != nil {
		fmt.Println(err)
	}
}
