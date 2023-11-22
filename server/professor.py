# This code was adapted from the RateMyProfessorAPI for Python, with modifications to focus on The University of Texas at Dallas.
# Original source: https://github.com/Nobelz/RateMyProfessorAPI
import requests
import base64
import json
import os
import re


current_path = os.path.dirname(__file__)
with open(os.path.join(current_path, "json/ratingsquery.json"), 'r') as f:
    ratings_query = json.load(f)

with open(os.path.join(current_path, "json/professorquery.json"), 'r') as f:
    professor_query = json.load(f)

with open(os.path.join(current_path, "json/header.json"), 'r') as f:
    headers = json.load(f)


class Professor:
    """Represents a professor."""

    def __init__(self, professor_name):
        """
        Initializes a Professor instance.

        :param professor_name: The name of the professor.
        """
        school_id = self.get_school_id()
        professor_id = self.get_professor_id(professor_name, school_id)
        self.id = professor_id
        self.get_rating_info()


    def get_school_id(self):
        """
        Retrieves the school ID for The University of Texas at Dallas.

        :return: The school ID.
        """
        page = requests.get("https://www.ratemyprofessors.com/search/schools?q=The+University+of+Texas+at+Dallas")
        return re.findall(r'"legacyId":(\d+)', page.text)[0]


    def get_professor_id(self, professor_name, school_id):
        """
        Retrieves the professor ID for a given professor name and school ID.

        :param professor_name: The name of the professor.
        :param school_id: The school ID.
        :return: The professor ID.
        """
        page = requests.get(f'https://www.ratemyprofessors.com/search/professors/{school_id}?q={professor_name}')
        return re.findall(r'"legacyId":(\d+)', page.text)[0]


    def get_rating_info(self):
        """
        Retrieves and populates information about the professor's ratings.
        """
        headers["Referer"] = f"https://www.ratemyprofessors.com/ShowRatings.jsp?tid={self.id}"
        professor_query["variables"]["id"] = base64.b64encode(f"Teacher-{self.id}".encode('ascii')).decode('ascii')
        data = requests.post(url="https://www.ratemyprofessors.com/graphql", json=professor_query, headers=headers)

        if data is None or json.loads(data.text)["data"]["node"] is None:
            raise ValueError("Professor not found with that id or bad request.")

        professor_data = json.loads(data.text)["data"]["node"]

        self.courses_taught = []
        for course_data in professor_data['courseCodes']:
            self.courses_taught.append(course_data["courseName"])

        self.name = f"{professor_data['firstName']} {professor_data['lastName']}"
        self.department = professor_data["department"]
        self.difficulty = professor_data["avgDifficulty"]
        self.rating = professor_data["avgRating"]
        self.would_take_again = professor_data["wouldTakeAgainPercent"] if professor_data["wouldTakeAgainPercent"] != 0 else None
        self.num_ratings = professor_data["numRatings"]


    def get_ratings(self, course_name=None):
        """
        Retrieves ratings for the professor, optionally filtered by course name.

        :param course_name: The name of the course to filter by.
        :return: List of Rating objects.
        """
        if self.num_ratings == 0:
            return []

        headers["Referer"] = f"https://www.ratemyprofessors.com/ShowRatings.jsp?tid={self.id}"
        ratings_query["variables"]["id"] = base64.b64encode(f"Teacher-{self.id}".encode('ascii')).decode('ascii')
        ratings_query["variables"]["count"] = self.num_ratings

        if course_name is not None and not any(course == course_name for course in self.courses_taught):
            return []

        ratings_query["variables"]["courseFilter"] = course_name if course_name is not None else None

        data = requests.post(url="https://www.ratemyprofessors.com/graphql", json=ratings_query, headers=headers)

        if data is None or json.loads(data.text)["data"]["node"]["ratings"]["edges"] is None:
            return []

        ratings_data = json.loads(data.text)["data"]["node"]["ratings"]["edges"]
        ratings = []

        for rating_data in ratings_data:
            rating = rating_data["node"]
            take_again = True if rating["wouldTakeAgain"] == 1 else False if rating["wouldTakeAgain"] == 0 else None

            ratings.append(Rating(
                rating=rating["helpfulRating"],
                difficulty=rating["difficultyRating"],
                class_name=rating["class"],
                take_again=take_again
            ))

        return ratings
    

class Rating:
    """Represents a rating."""

    def __init__(self, rating: int, difficulty: int, class_name: str, take_again=None):
        """
        Initializes a Rating instance.

        :param rating: The rating number.
        :param difficulty: The difficulty rating.
        :param class_name: The class the rating was for.
        :param take_again: If the person who made the rating would take the class again.
        """
        self.rating = rating
        self.difficulty = difficulty
        self.class_name = class_name
        self.take_again = take_again


