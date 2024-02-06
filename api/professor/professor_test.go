package professor

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

var johnDoeRMPProfile = Professor{
	ID:             "822366",
	Name:           "John Doe",
	School:         "",
	Department:     "Accounting",
	Difficulty:     0,
	Rating:         0,
	WouldTakeAgain: -1,
	Tags:           []string(nil),
	NumRatings:     0,
}

func TestRateMyProfessor(t *testing.T) {
	nonExistentProfessor, err := GetRMPInfo("IDontExist")
	assert.Error(t, err, "Professor not found with that id or bad request")
	assert.Same(t, nonExistentProfessor, (*Professor)(nil), "Professor should be nil")

	scottDollingerRMP, err := GetRMPInfo("Scott Dollinger")
	assert.NoError(t, err, "Unexpected error for a valid professor")
	assert.Equal(t, "2523207", scottDollingerRMP.ID, "Professor ID mismatch")

	johnDoeRMP, err := GetRMPInfo("John Doe")
	assert.NoError(t, err, "Unexpected error for a valid professor")
	assert.Equal(t, johnDoeRMPProfile, *johnDoeRMP, "Professor profile mismatch")
}
