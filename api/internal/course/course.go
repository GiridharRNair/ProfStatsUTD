package course

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"unicode"
)

func isGraduateCourse(courseNumber string) bool {
	if len(courseNumber) > 0 && unicode.IsDigit(rune(courseNumber[0])) {
		return int(courseNumber[0]-'0') > 4
	}
	return false
}

func GetCourseName(subject, courseNumber string) string {
	isGrad := isGraduateCourse(courseNumber)

	urlFormat := "https://catalog.utdallas.edu/2023/%s/courses/%s"
	urlType := "undergraduate"
	if isGrad {
		urlType = "graduate"
	}

	url := fmt.Sprintf(urlFormat, urlType, strings.ToLower(subject)+courseNumber)

	resp, err := http.Get(url)
	if err != nil {
		return "Course name not found"
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "Course name not found"
	}

	re := regexp.MustCompile(`<title>(.*?)\s*-\s*UT Dallas 2023 (Undergraduate|Graduate) Catalog - The University of Texas at Dallas</title>`)
	match := re.FindStringSubmatch(string(bodyBytes[:1000]))

	if len(match) > 1 {
		return match[1]
	}

	return "Course name not found"
}
