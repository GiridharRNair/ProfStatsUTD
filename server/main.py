from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized
from flask import Flask, request, jsonify, render_template
from collections import OrderedDict
from professor import Professor
from flask_cors import CORS
import sqlite3
import string
import os
import re


current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "utdgrades.sqlite3")

app = Flask(__name__, template_folder=os.path.join(current_dir, "templates"))
app.json.sort_keys = False
CORS(app)


def run_sql_query(instructor, subject, course_section):
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
    

@app.route('/grades', methods=['GET'])
def get_grades():
    """
    Endpoint to retrieve aggregated grades data based on parameters.

    :return: JSON response with aggregated data.
    """
    try:
        teacher_param = request.args.get('teacher')
        course_param = request.args.get('course')

        if not teacher_param:
            return jsonify({"error": "Required parameter missing"}), 422
        
        formatted_course_name = course_param.translate({ord(c): None for c in string.whitespace}).upper() if course_param else None
        subject, course_section = None, None 

        if formatted_course_name:
            match = re.match(r'([a-zA-Z]+)([0-9]+)', formatted_course_name)
            if match:
                subject, course_section = match.groups()

        result_data = run_sql_query(teacher_param.strip(), subject, course_section)

        return jsonify(result_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

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
    

@app.route('/ratings', methods=['GET'])
def get_ratings():
    """
    Endpoint to retrieve professor ratings data based on parameters.

    :return: JSON response with professor ratings data.
    """
    try:
        teacher_param = request.args.get('teacher')
        course_param = request.args.get('course')

        if not teacher_param:
            return jsonify({"error": "Required parameter 'teacher' missing"}), 422

        professor = Professor(teacher_param.strip())

        if course_param:
            formatted_course_name = course_param.translate({ord(c): None for c in string.whitespace}).upper()
            ratings = professor.get_ratings(formatted_course_name)
            rating, difficulty, would_take_again = calculate_average_ratings(ratings)
        else:
            rating, difficulty, would_take_again = professor.rating, professor.difficulty, round(professor.would_take_again, 1)

        result_data = {
            'id': professor.id,
            'name': professor.name,
            'department': professor.department,
            'rating': rating,
            'difficulty': difficulty,
            'would_take_again': would_take_again,
        }

        return jsonify(result_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.errorhandler(NotFound)
@app.errorhandler(Unauthorized)
@app.errorhandler(Forbidden)
@app.errorhandler(RequestTimeout)
def page_not_found_handler(e: HTTPException):
    return render_template(f'{e.code}.html'), e.code
    

if __name__ == '__main__':
    app.run(debug=True)
