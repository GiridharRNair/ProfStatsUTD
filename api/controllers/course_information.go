package controllers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/course"
	"github.com/GiridharRNair/ProfStats-GinAPI/db"
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

	courseName, err := course.GetCourseName(subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	resultData := gin.H{
		"subject":       subject,
		"course_number": courseNumber,
		"course_name":   courseName,
		"grades":        db.GetAggregatedGrades("", subject, courseNumber),
	}

	c.JSON(http.StatusOK, resultData)
}
