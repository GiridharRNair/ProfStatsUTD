package controllers

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/GiridharRNair/ProfStats-GinAPI/professor"
	"github.com/gin-gonic/gin"
)

// Edge case professors with different names in the database than on RateMyProfessor
var professorNameCorrections = map[string]string{
	"Ding-Zhu Du":           "Ding Du",
	"Sue Brookshire":        "Susan Brookshire",
	"Chitturi Bhadrachalam": "Bhadrachalam Chitturi",
}

const ValidateTeacherNameRegex = `[^a-zA-Z\s.\-]|.*\-.*\-`

func GetProfessorInformation(c *gin.Context) {
	teacher := c.Query("teacher")
	course := c.Query("course")

	if teacher == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Teacher name not provided"})
		return
	}

	if regexp.MustCompile(ValidateTeacherNameRegex).MatchString(teacher) {
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

	professorName := professorNameCorrections[professor.Name]
	if professorName == "" {
		professorName = professor.Name
	}

	// possible chance RMP name has middle name
	profNameArray := strings.Fields(professorName)
	profNameWithoutMiddle := fmt.Sprintf("%s %s", profNameArray[0], profNameArray[len(profNameArray)-1])

	resultData := gin.H{
		"id":               professor.ID,
		"name":             profNameWithoutMiddle,
		"department":       professor.Department,
		"grades":           db.GetAggregatedGrades(profNameWithoutMiddle, subject, courseNumber),
		"subject":          subject,
		"course_number":    courseNumber,
		"rating":           professor.Rating,
		"difficulty":       professor.Difficulty,
		"would_take_again": professor.WouldTakeAgain,
		"tags":             professor.Tags,
	}

	c.JSON(http.StatusOK, resultData)
}
