package utils

// Edge case professors with different names in the database than on RateMyProfessor
var ProfessorNameCorrections = map[string]string{
	"Ding-Zhu Du":           "Ding Du",
	"Sue Brookshire":        "Susan Brookshire",
	"Chitturi Bhadrachalam": "Bhadrachalam Chitturi",
}

var DefaultProfessorSuggestions = []string{"Joycelyn Bell", "James Willson", "Stephanie Taylor", "Bentley Garrett", "Karl Sengupta"}

var DefaultCourseSuggestions = []string{"CS 2305", "MATH 2418", "CHEM 2401", "ACCT 6305", "SPAN 2311"}
