package controllers

import (
	"net/http"

	"github.com/GiridharRNair/ProfStats-GinAPI/course"
	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/gin-gonic/gin"
)

func GetCourseInformation(c *gin.Context) {
	courseQuery := c.Query("course")

	if courseQuery == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Course name not provided"})
		return
	}

	subject, courseNumber, isValid := course.IsValidCourseName(courseQuery)
	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid course name"})
		return
	}

	course, err := course.GetCourseInfo(subject, courseNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	resultData := gin.H{
		"subject":       subject,
		"course_number": courseNumber,
		"course_name":   course.CourseName,
		"catalog_url":   course.CatalogURL,
		"grades":        db.GetAggregatedGrades("", subject, courseNumber),
	}

	c.JSON(http.StatusOK, resultData)
}
