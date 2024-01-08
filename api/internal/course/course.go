package course

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
	"time"
	"unicode"
)

func isGraduateCourse(courseNumber string) bool {
	if len(courseNumber) > 0 && unicode.IsDigit(rune(courseNumber[0])) {
		return int(courseNumber[0]-'0') > 4
	}
	return false
}

func GetCourseName(subject, courseNumber string) (string, error) {
	isGrad := isGraduateCourse(courseNumber)

	urlFormat := "https://catalog.utdallas.edu/%d/%s/courses/%s"
	urlType := "undergraduate"
	if isGrad {
		urlType = "graduate"
	}

	url := fmt.Sprintf(urlFormat, time.Now().Year()-1, urlType, strings.ToLower(subject)+courseNumber)

	resp, err := http.Get(url)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	regexString := fmt.Sprintf(`<title>(.*?)\s*-\s*UT Dallas %d (Undergraduate|Graduate) Catalog - The University of Texas at Dallas</title>`, time.Now().Year()-1)
	match := regexp.MustCompile(regexString).FindStringSubmatch(string(bodyBytes))

	if len(match) > 1 {
		return match[1], nil
	}

	return "", fmt.Errorf("course not found in the %d catalog", time.Now().Year()-1)
}
