package professor

import (
	"encoding/base64"
	"fmt"
)

func getRatingsQuery(professorID string, numRatings int) map[string]interface{} {
	return map[string]interface{}{
		"query": "query RatingsListQuery($count: Int! $id: ID! $courseFilter: String $cursor: String) {node(id: $id) {... on Teacher {ratings(first: $count, after: $cursor, courseFilter: $courseFilter) {edges {node {ratingTags}}}}}}",
		"variables": map[string]interface{}{
			"id":    base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("Teacher-%s", professorID))),
			"count": numRatings,
		},
	}
}

func getProfessorQuery(professorID string) map[string]interface{} {
	return map[string]interface{}{
		"query": "query RatingsListQuery($id: ID!) {node(id: $id) {... on Teacher {school {id} courseCodes {courseName courseCount} firstName lastName numRatings avgDifficulty avgRating department wouldTakeAgainPercent}}}",
		"variables": map[string]interface{}{
			"id": base64.StdEncoding.EncodeToString([]byte(fmt.Sprintf("Teacher-%s", professorID))),
		},
	}
}

func getHeaderQuery(professorID string) map[string]string {
	return map[string]string{
		"Authorization": "Basic dGVzdDp0ZXN0",
		"User-Agent":    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36",
		"Content-Type":  "application/json",
		"Referer":       fmt.Sprintf("https://www.ratemyprofessors.com/ShowRatings.jsp?tid=%s", professorID),
	}
}
