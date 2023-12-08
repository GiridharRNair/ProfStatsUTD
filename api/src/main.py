from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi import FastAPI, HTTPException
from typing import Dict, Optional, List
from professor import Professor
from pydantic import BaseModel
import sqlite3
import string
import os
import re

current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "../utdgrades.sqlite3")

origins = [
    "chrome-extension://doilmgfedjlpepeaolcfpdmkehecdaff",
    "http://localhost:5173",
]

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"], 
)


class ProfessorInfo(BaseModel):
    id: int
    name: str
    department: str
    grades: Dict[str, int]
    subject: Optional[str]
    course_number: Optional[str]
    rating: float
    difficulty: float
    would_take_again: int
    tags: List[str]


def aggregate_grades(professor: str, subject: str, course_number: str):
    query = f"""
        SELECT aPlus, a, aMinus, bPlus, b, bMinus,
               cPlus, c, cMinus, dPlus, d, dMinus,
               f, cr, nc, p, w, i, nf
        FROM grades_populated gp
        WHERE TRIM(instructor1) LIKE ?
        {' AND subject = ? AND catalogNumber = ?' if subject and course_number else ''}
    """

    params = [professor.replace(" ", "%")]

    if subject and course_number:
        params.extend([subject.upper(), course_number])

    with sqlite3.connect(db_path) as conn:
        cursor = conn.cursor()
        cursor.execute(query, tuple(params))
        results = cursor.fetchall()

        columns = [column[0] for column in cursor.description]

        aggregated_data = {column: sum(row[index] for row in results) for index, column in enumerate(columns) if sum(row[index] for row in results)}

    return aggregated_data if results else {"No data found": 0}

        
@app.get(
    "/professor_info",
    response_class=JSONResponse,
    summary="Get Professor Information",
    description="Retrieve information about a professor, including grades and ratings.",
    response_model=ProfessorInfo,
    responses={
        404: {
            "description": "Professor not found",
            "content": {"application/json": {"example": {"detail": "Professor not found"}}},
        },
        400:  {
            "description": "Invalid course name",
            "content": {"application/json": {"example": {"detail": "Invalid course name"}}},
        },
    }
)
def get_professor_information(teacher: str, course: Optional[str] = None):
    try:
        formatted_course_name = course.translate({ord(c): None for c in string.whitespace}).upper() if course else None
        subject, course_number = None, None

        if formatted_course_name:
            match = re.match(r'([a-zA-Z]+)([0-9]+)', formatted_course_name)

            if not match or len(match.group(2)) != 4:
                raise HTTPException(status_code=400, detail="Invalid course name")
            
            subject, course_number = match.groups()
            
        professor = Professor(teacher.strip())

        grades_data = aggregate_grades(professor.name, subject, course_number)

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

        return ProfessorInfo(**result_data)

    except Exception as e:
        raise e
    

@app.get(
    "/professor_suggestions",
    response_class=JSONResponse,
    summary="Get Professor suggestions for autocomplete",
    description="Retrieve a list of professors that match the given query.",
    response_model=List[str]
)
def get_professor_suggestions(teacher: str):
    professor = teacher.replace(" ", "%")
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT TRIM(instructor1) FROM grades_populated WHERE TRIM(instructor1) LIKE ? LIMIT 5", (f"%{professor}%",))
            results = cursor.fetchall()

            return set(full_name.split()[0] + " " + full_name.split()[-1] for result in results for full_name in result)

    except Exception as e:
        raise e
    

@app.get(
    "/professor_courses",
    response_class=JSONResponse,
    summary="Get Professor's courses taught",
    description="Retrieve a list of courses taught by the given professor.",
    response_model=List[str]
)
def get_professor_courses(teacher: str):
    professor = teacher.replace(" ", "%")
    try:
        with sqlite3.connect(db_path) as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT DISTINCT subject, catalogNumber FROM grades_populated WHERE TRIM(instructor1) LIKE ?", (f"%{professor}%",))
            results = cursor.fetchall()

            return [f"{result[0]} {result[1]}" for result in results]

    except Exception as e:
        raise e
