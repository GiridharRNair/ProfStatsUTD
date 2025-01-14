package course

import (
	"regexp"
	"strings"
)

func IsValidCourseName(courseName string) (string, string, bool) {
	if courseName == "" {
		return "", "", true
	}

	formattedCourseName := strings.ToUpper(strings.ReplaceAll(courseName, " ", ""))
	match := regexp.MustCompile(`([a-zA-Z]+)([0-9Vv]*)`).FindStringSubmatch(formattedCourseName)

	if len(match) == 3 {
		return match[1], match[2], true
	}

	return "", formattedCourseName, false
}
