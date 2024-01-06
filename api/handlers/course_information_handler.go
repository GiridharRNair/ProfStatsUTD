package handlers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/database"
	"github.com/GiridharRNair/ProfStats-GinAPI/internal/course"
	"github.com/gin-gonic/gin"
)

func GetCourseInformation(c *gin.Context) {
	courseParam := c.Query("course")

	if courseParam == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Course name not provided"})
		return
	}

	subject, courseNumber, isValid := isValidCourseName(courseParam)
	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid course name"})
		return
	}

	resultData := gin.H{
		"subject":       subject,
		"course_number": courseNumber,
		"course_name":   course.GetCourseName(subject, courseNumber),
		"grades":        database.GetAggregatedGrades("", subject, courseNumber),
	}

	c.JSON(http.StatusOK, resultData)
}
