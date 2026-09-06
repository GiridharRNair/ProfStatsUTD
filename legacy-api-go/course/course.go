package course

import (
	"fmt"
	"io"
	"net/http"
	"regexp"
	"strings"
)

type Course struct {
	CourseName string
	CatalogURL string
}

// Make sure to update the year in the URL when the catalog is updated
const catalogYear = 2024
const GetTitleRegex = `<title>(.*?)\s*-\s*UT Dallas %d (Undergraduate|Graduate) Catalog - The University of Texas at Dallas</title>`
const CourseCatalogURL = "https://catalog.utdallas.edu/%d/%s/courses/%s"

func getCourseCatalogURL(subject, courseNumber string) string {
	courseLevel := "undergraduate"
	if rune(courseNumber[0]) >= '5' {
		courseLevel = "graduate"
	}

	return fmt.Sprintf(CourseCatalogURL, catalogYear, courseLevel, strings.ToLower(subject)+strings.ToLower(courseNumber))
}

func GetCourseInfo(subject, courseNumber string) (Course, error) {
	if len(courseNumber) != 4 {
		return Course{}, fmt.Errorf("invalid course")
	}

	catalogURL := getCourseCatalogURL(subject, courseNumber)

	resp, err := http.Get(catalogURL)
	if err != nil {
		return Course{}, err
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return Course{}, err
	}

	regexString := fmt.Sprintf(GetTitleRegex, catalogYear)
	match := regexp.MustCompile(regexString).FindStringSubmatch(string(bodyBytes))

	if len(match) > 1 {
		return Course{CourseName: match[1], CatalogURL: catalogURL}, nil
	}

	return Course{}, fmt.Errorf("course not found in the %d catalog", catalogYear)
}
