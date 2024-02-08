package course

import (
	"fmt"
	"testing"
	"time"

	"github.com/stretchr/testify/assert"
)

var computerScienceI = Course{
	CourseName: "Computer Science I",
	CatalogURL: fmt.Sprintf("https://catalog.utdallas.edu/%d/undergraduate/courses/cs1337", time.Now().Year()-1),
}

var accountingForManagers = Course{
	CourseName: "Accounting for Managers",
	CatalogURL: fmt.Sprintf("https://catalog.utdallas.edu/%d/graduate/courses/acct6305", time.Now().Year()-1),
}

func TestGetCourseName(t *testing.T) {
	courseInfo, err := GetCourseInfo("CS", "1337")
	assert.NoError(t, err, "Unexpected error for a valid course")
	assert.Equal(t, computerScienceI, courseInfo)

	courseInfo, err = GetCourseInfo("acct", "6305")
	assert.NoError(t, err, "Unexpected error for a valid course")
	assert.Equal(t, accountingForManagers, courseInfo)

	courseInfo, err = GetCourseInfo("INVALID", "0000")
	assert.Error(t, err, "Expected error for a nonexistent course")
	assert.Empty(t, courseInfo, "Expected empty course name for a nonexistent course")
}
