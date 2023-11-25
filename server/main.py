from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, HTTPException
from collections import OrderedDict
from professor import Professor
import sqlite3
import string
import os
import re


current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "utdgrades.sqlite3")

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def run_sql_query(instructor: str, subject: str = None, course_section: str = None):
    """
    Run an SQL query on the SQLite database and aggregate the results.

    :param subject: Subject code for the course.
    :param course_section: Course section number.
    :param instructor: Instructor's name.
    :return: Aggregated data from the database.
    """
    with sqlite3.connect(db_path) as conn:
        modified_instructor = instructor.replace(" ", "% %")
        cursor = conn.cursor()

        sql_query_base = """
            SELECT gp.aPlus, gp.a, gp.aMinus, gp.bPlus, gp.b, gp.bMinus,
                   gp.cPlus, gp.c, gp.cMinus, gp.dPlus, gp.d, gp.dMinus,
                   gp.f, gp.cr, gp.nc, gp.p, gp.w, gp.i, gp.nf
            FROM grades_populated gp
            JOIN grades_strings gs ON gp.gradesId = gs.id
            WHERE TRIM(gs.instructor1) LIKE ?
        """

        sql_params = [modified_instructor]

        if subject and course_section:
            sql_query = f"{sql_query_base} AND gs.subject = ? AND catalogNumber = ?"
            sql_params.extend([subject.upper(), course_section])
        else:
            sql_query = sql_query_base

        cursor.execute(sql_query, tuple(sql_params))
        results = cursor.fetchall()

        columns = [column[0] for column in cursor.description]

        aggregated_data = OrderedDict()
        for column in columns:
            column_sum = sum(row[columns.index(column)] for row in results)
            if column_sum:
                aggregated_data[column] = column_sum

        if aggregated_data:
            return aggregated_data
        else:
            raise ValueError("No data! Make sure you have the correct teacher name or course number")
   

@app.get('/grades', response_class=JSONResponse)
def get_grades(teacher: str, course: str = None):
    """
    Endpoint to retrieve aggregated grades data based on parameters.

    :param teacher: Name of the professor.
    :param course: Name of the course (optional).
    :return: JSON response with aggregated data.
    """
    try:
        formatted_course_name = course.translate({ord(c): None for c in string.whitespace}).upper() if course else None
        subject, course_section = None, None

        if formatted_course_name:
            match = re.match(r'([a-zA-Z]+)([0-9]+)', formatted_course_name)
            if match:
                subject, course_section = match.groups()

        result_data = run_sql_query(teacher.strip(), subject, course_section)

        return result_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    

def calculate_average_ratings(ratings):
    """
    Calculate the average ratings for a professor.

    :param ratings: List of ratings.
    :return: Average ratings.
    """
    total_ratings = len(ratings)
    if total_ratings > 0:
        total_rating = sum(rating.rating for rating in ratings)
        total_difficulty = sum(rating.difficulty for rating in ratings)
        would_take_again = sum(1 if rating.take_again else 0 for rating in ratings)
        
        return (
            round(total_rating / total_ratings, 1), 
            round(total_difficulty / total_ratings, 1), 
            round((would_take_again / total_ratings) * 100, 1)
        )
    else:
        raise ValueError("No ratings found for this professor")


def get_tags(ratings):
    """
    Get the tags for a professor.

    :param ratings: List of ratings.
    :return: Tags.
    """
    tags = set()
    for rating in ratings:
        tags = tags.union(rating.tags)
    tags = set([string.capwords(tag) for tag in tags if tag != ""])
    return list(tags)[:5] if len(tags) > 5 else list(tags)


@app.get('/ratings', response_class=JSONResponse)
def get_ratings(teacher: str, course: str = None):
    """
    Endpoint to retrieve professor ratings data based on parameters.

    :param teacher: Name of the professor.
    :param course: Name of the course (optional).
    :return: JSON response with professor ratings data.
    """
    try:
        professor = Professor(teacher.strip())

        if course:
            formatted_course_name = course.translate({ord(c): None for c in string.whitespace}).upper()
            ratings = professor.get_ratings(formatted_course_name)
            rating, difficulty, would_take_again = calculate_average_ratings(ratings)
        else:
            ratings = professor.get_ratings()
            rating, difficulty, would_take_again = professor.rating, professor.difficulty, round(professor.would_take_again, 1)

        tags = get_tags(ratings)

        result_data = {
            'id': professor.id,
            'name': professor.name,
            'department': professor.department,
            'rating': rating,
            'difficulty': difficulty,
            'would_take_again': would_take_again,
            'tags': tags,
        }

        return result_data

    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
