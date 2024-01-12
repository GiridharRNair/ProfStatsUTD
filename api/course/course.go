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

const GetTitleRegex = `<title>(.*?)\s*-\s*UT Dallas %d (Undergraduate|Graduate) Catalog - The University of Texas at Dallas</title>`
const CourseCatalogURL = "https://catalog.utdallas.edu/%d/%s/courses/%s"

func getCourseCatalogURL(subject, courseNumber string) string {
	courseLevel := "undergraduate"
	if len(courseNumber) > 0 && unicode.IsDigit(rune(courseNumber[0])) {
		courseLevel = "graduate"
	}

	return fmt.Sprintf(CourseCatalogURL, time.Now().Year()-1, courseLevel, strings.ToLower(subject)+strings.ToLower(courseNumber))
}

func GetCourseName(subject, courseNumber string) (string, error) {
	catalogURL := getCourseCatalogURL(subject, courseNumber)

	resp, err := http.Get(catalogURL)
	if err != nil {
		return "", err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", err
	}

	regexString := fmt.Sprintf(GetTitleRegex, time.Now().Year()-1)
	match := regexp.MustCompile(regexString).FindStringSubmatch(string(bodyBytes))

	if len(match) > 1 {
		return match[1], nil
	}

	return "", fmt.Errorf("course not found in the %d catalog", time.Now().Year()-1)
}
