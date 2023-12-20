package main

import (
	"bytes"
	"encoding/base64"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"regexp"
	"sort"
	"strings"

	"golang.org/x/text/cases"
	"golang.org/x/text/language"
)

type Professor struct {
	ID             string
	Name           string
	School         string
	Department     string
	Difficulty     float64
	Rating         float64
	WouldTakeAgain int
	Tags           []string
	NumRatings     int
}

const SchoolID = "U2Nob29sLTEyNzM=" // UTDallas's school id on RateMyProfessor

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

func postData(url string, data map[string]interface{}, headers map[string]string) ([]byte, error) {
	jsonData, err := json.Marshal(data)
	if err != nil {
		return nil, err
	}

	req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, err
	}

	req.Header.Set("Content-Type", "application/json")
	for key, value := range headers {
		req.Header.Set(key, value)
	}

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

func (p *Professor) setTags(tagsFrequency map[string]int) {
	var sortedTags []string

	for tag := range tagsFrequency {
		sortedTags = append(sortedTags, tag)
	}

	sort.Slice(sortedTags, func(i, j int) bool {
		return tagsFrequency[sortedTags[i]] > tagsFrequency[sortedTags[j]]
	})

	if len(sortedTags) < 5 {
		p.Tags = sortedTags
	} else {
		p.Tags = sortedTags[:5]
	}
}

func (p *Professor) getProfessorTags() {
	if p.NumRatings == 0 {
		return
	}

	headersQuery := getHeaderQuery(p.ID)
	ratingsQuery := getRatingsQuery(p.ID, p.NumRatings)

	data, err := postData("https://www.ratemyprofessors.com/graphql", ratingsQuery, headersQuery)
	if err != nil {
		fmt.Printf("error fetching ratings data: %v", err)
		return
	}

	var result map[string]interface{}
	if err := json.Unmarshal(data, &result); err != nil {
		fmt.Printf("error decoding JSON response: %v", err)
		return
	}

	ratings, ok := result["data"].(map[string]interface{})["node"].(map[string]interface{})["ratings"].(map[string]interface{})["edges"].([]interface{})
	if !ok {
		fmt.Printf("No ratings found for the professor")
		return
	}

	tagsFrequency := make(map[string]int)

	for _, rating := range ratings {
		ratingData, ok := rating.(map[string]interface{})["node"].(map[string]interface{})
		if ok {
			ratingTags := strings.Split(cases.Title(language.English, cases.Compact).String(ratingData["ratingTags"].(string)), "--")
			for _, tagData := range ratingTags {
				if tagData != "" {
					tagsFrequency[tagData]++
				}
			}
		} else {
			fmt.Printf("Rating node information not found in the response")
		}
	}

	p.setTags(tagsFrequency)
}

func getProfessorID(professorName, schoolID string) (string, error) {
	url := fmt.Sprintf("https://www.ratemyprofessors.com/search/professors/%s?q=%s", schoolID, url.QueryEscape(professorName))

	resp, err := http.Get(url)
	if err != nil {
		return "", fmt.Errorf("error fetching professor id: %v", err)
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("error reading response body: %v", err)
	}

	re := regexp.MustCompile(`"legacyId":(\d+)`)
	match := re.FindStringSubmatch(string(bodyBytes))

	if len(match) > 1 {
		return match[1], nil
	}
	return "", fmt.Errorf("Professor not found")
}

func getRMPInfo(professorName string) (*Professor, error) {
	professorID, err := getProfessorID(professorName, SchoolID)
	if err != nil {
		return nil, err
	}

	headersQuery := getHeaderQuery(professorID)
	professorQuery := getProfessorQuery(professorID)

	data, err := postData("https://www.ratemyprofessors.com/graphql", professorQuery, headersQuery)
	if err != nil {
		return nil, fmt.Errorf("error fetching professor data: %v", err)
	}

	var result map[string]interface{}
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, fmt.Errorf("error decoding JSON response: %v", err)
	}

	node, ok := result["data"].(map[string]interface{})["node"].(map[string]interface{})
	if !ok {
		return nil, fmt.Errorf("Professor not found with that id or bad request")
	}

	p := &Professor{
		ID:             professorID,
		NumRatings:     int(node["numRatings"].(float64)),
		Name:           fmt.Sprintf("%s %s", node["firstName"], node["lastName"]),
		Department:     node["department"].(string),
		Difficulty:     node["avgDifficulty"].(float64),
		Rating:         node["avgRating"].(float64),
		WouldTakeAgain: int(node["wouldTakeAgainPercent"].(float64)),
	}

	p.getProfessorTags()

	return p, nil
}
