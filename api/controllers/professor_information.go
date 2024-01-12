package controllers

import (
	"net/http"
	"regexp"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/GiridharRNair/ProfStats-GinAPI/professor"
	"github.com/gin-gonic/gin"
)

const validateTeacherNameRegex = `[^a-zA-Z\s.\-]|.*\-.*\-`

func GetProfessorInformation(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	if teacher == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Teacher name not provided"})
		return
	}

	if regexp.MustCompile(validateTeacherNameRegex).MatchString(teacher) {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid teacher name"})
		return
	}

	subject, courseNumber, isValid := isValidCourseName(course)
	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid course name"})
		return
	}

	professor, err := professor.GetRMPInfo(strings.TrimSpace(teacher))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	resultData := gin.H{
		"id":               professor.ID,
		"name":             professor.Name,
		"department":       professor.Department,
		"grades":           db.GetAggregatedGrades(professor.Name, subject, courseNumber),
		"subject":          subject,
		"course_number":    courseNumber,
		"rating":           professor.Rating,
		"difficulty":       professor.Difficulty,
		"would_take_again": professor.WouldTakeAgain,
		"tags":             professor.Tags,
	}

	c.JSON(http.StatusOK, resultData)
}
