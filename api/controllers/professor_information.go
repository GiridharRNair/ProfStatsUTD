package controllers

import (
	"fmt"
	"net/http"
	"regexp"
	"strings"

	"github.com/GiridharRNair/ProfStats-GinAPI/course"
	"github.com/GiridharRNair/ProfStats-GinAPI/db"
	"github.com/GiridharRNair/ProfStats-GinAPI/professor"
	"github.com/gin-gonic/gin"
)

const ValidateTeacherNameRegex = `[^a-zA-Z\s.\-]|.*\-.*\-`

func GetProfessorInformation(c *gin.Context) {
	teacherQuery := c.Query("teacher")
	courseQuery := c.Query("course")

	if teacherQuery == "" {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Teacher name not provided"})
		return
	}

	if regexp.MustCompile(ValidateTeacherNameRegex).MatchString(teacherQuery) {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid teacher name"})
		return
	}

	subject, courseNumber, isValid := course.IsValidCourseName(courseQuery)
	if !isValid {
		c.JSON(http.StatusBadRequest, gin.H{"detail": "Invalid course name"})
		return
	}

	professor, err := professor.GetRMPInfo(strings.TrimSpace(teacherQuery))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"detail": err.Error()})
		return
	}

	if professor.Name == "Chitturi Bhadrachalam" {
		professor.Name = "Bhadrachalam Chitturi"
	}

	// possible chance RMP name has middle name
	profNameArray := strings.Fields(professor.Name)
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
