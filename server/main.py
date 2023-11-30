from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException
from professor import Professor
from dotenv import load_dotenv
import sqlite3
import string
import os
import re

load_dotenv()

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


def run_sql_query(instructor: str, subject: str, course_number: str):
    """
    Runs a SQL query to retrieve grades data for a professor.

    :param instructor: Name of the professor.
    :param subject: Subject of the course.
    :param course_number: Course number.
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

        if subject and course_number:
            sql_query = f"{sql_query_base} AND gs.subject = ? AND catalogNumber = ?"
            sql_params.extend([subject.upper(), course_number])
        else:
            sql_query = sql_query_base

        cursor.execute(sql_query, tuple(sql_params))
        results = cursor.fetchall()

        columns = [column[0] for column in cursor.description]

        aggregated_data = {column: sum(row[index] for row in results) for index, column in enumerate(columns) if sum(row[index] for row in results)}

        if results:
            return aggregated_data
        else:
            return {"No data found": 0}
        

@app.get('/professor_info', response_class=JSONResponse)
def get_professor_information(teacher: str, course: str = None):
    """
    Endpoint to retrieve information about a professor including grades and ratings.

    :param teacher: Name of the professor.
    :param course: Name of the course (optional).
    :return: JSON response with professor information.
    """
    try:
        formatted_course_name = course.translate({ord(c): None for c in string.whitespace}).upper() if course else None
        subject, course_number = None, None

        if formatted_course_name:
            match = re.match(r'([a-zA-Z]+)([0-9]+)', formatted_course_name)
            if match:
                subject, course_number = match.groups()
            else:
                raise HTTPException(status_code=400, detail="Invalid course name.")

        professor = Professor(teacher.strip())

        grades_data = run_sql_query(professor.name, subject, course_number)

        result_data = {
            'id': professor.id,
            'name': professor.name,
            'department': professor.department,
            'grades': grades_data,
            'subject': subject,
            'course_number': course_number,
            'rating': professor.rating,
            'difficulty': professor.difficulty,
            'would_take_again': professor.would_take_again,
            'tags': professor.tags,
        }

        return result_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
