# This code was adapted from the RateMyProfessorAPI for Python, with modifications to focus on The University of Texas at Dallas.
# Original source: https://github.com/Nobelz/RateMyProfessorAPI
from collections import Counter
import requests
import string
import base64
import json
import os
import re

SCHOOL_ID = "U2Nob29sLTEyNzM=" # U2Nob29sLTEyNzM= is UT Dallas's school ID

def load_json(file_path):
    with open(file_path, 'r') as f:
        return json.load(f)

current_path = os.path.dirname(__file__)
ratings_query = load_json(os.path.join(current_path, "json/ratingsquery.json"))
professor_query = load_json(os.path.join(current_path, "json/professorquery.json"))
headers = load_json(os.path.join(current_path, "json/header.json"))


class Professor:
    """Represents a professor."""

    def __init__(self, professor_name: str):
        """
        Initializes a Professor instance.

        :param professor_name: The name of the professor.
        """
        self.id = self.get_professor_id(professor_name)
        self.get_rating_info()


    def get_professor_id(self, professor_name: str):
        """
        Retrieves the professor ID for a given professor name and school ID.

        :param professor_name: The name of the professor.
        :return: The professor ID.
        """
        page = requests.get(f'https://www.ratemyprofessors.com/search/professors/{SCHOOL_ID}?q={professor_name}')
        prof_id_match = re.search(r'"legacyId":(\d+)', page.text)
        if not prof_id_match:
            raise ValueError("Professor not found with that name.")
        return prof_id_match.group(1)


    def get_rating_info(self):
        """
        Retrieves and populates information about the professor's ratings.
        """
        professor_query["variables"]["id"] = base64.b64encode(f"Teacher-{self.id}".encode('ascii')).decode('ascii')
        data = requests.post(url="https://www.ratemyprofessors.com/graphql", json=professor_query, headers=headers)
        if data is None or json.loads(data.text)["data"]["node"] is None:
            raise ValueError("Professor not found with that id or bad request.")

        professor_data = json.loads(data.text)["data"]["node"]

        self.name = f"{professor_data['firstName']} {professor_data['lastName']}"
        self.department = professor_data["department"]
        self.difficulty = professor_data["avgDifficulty"]
        self.rating = professor_data["avgRating"]
        self.would_take_again = int(professor_data["wouldTakeAgainPercent"]) if professor_data["wouldTakeAgainPercent"] else None
        self.num_ratings = professor_data["numRatings"]
        self.get_tags()


    def get_tags(self):
        """
        Retrieves the most common tags for a professor.
        """
        if self.num_ratings == 0:
            self.tags = []
            return

        ratings_query["variables"]["id"] = base64.b64encode(f"Teacher-{self.id}".encode('ascii')).decode('ascii')
        ratings_query["variables"]["count"] = self.num_ratings

        data = requests.post(url="https://www.ratemyprofessors.com/graphql", json=ratings_query, headers=headers)

        if data is None or json.loads(data.text)["data"]["node"]["ratings"]["edges"] is None:
            self.tags = [] 
            return

        ratings_data = json.loads(data.text)["data"]["node"]["ratings"]["edges"]

        tags_counter = Counter()

        for rating_data in ratings_data:
            if rating_data["node"]["ratingTags"]:
                tags=set(rating_data["node"]["ratingTags"].split("--"))
                tags_counter.update(string.capwords(tag) for tag in tags if tag)

        self.tags = [tag[0] for tag in tags_counter.most_common(5)] if tags_counter else []
    