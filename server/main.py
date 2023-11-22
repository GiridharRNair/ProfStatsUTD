from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized
from flask import Flask, request, jsonify, render_template
from collections import OrderedDict
from professor import Professor
from flask_cors import CORS
import sqlite3
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "utdgrades.sqlite3")

app = Flask(__name__, template_folder=os.path.join(current_dir, "templates"))
app.json.sort_keys = False
CORS(app)


def run_sql_query(subject, course_section=None, instructor=None):
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
            SELECT
                gp.aPlus, gp.a, gp.aMinus,
                gp.bPlus, gp.b, gp.bMinus,
                gp.cPlus, gp.c, gp.cMinus,
                gp.dPlus, gp.d, gp.dMinus,
                gp.f, gp.cr, gp.nc, gp.p, gp.w, gp.i, gp.nf
            FROM grades_populated gp
            JOIN grades_strings gs ON gp.gradesId = gs.id
            WHERE TRIM(gs.instructor1) LIKE ?
        """

        if subject and course_section:
            sql_query = f"{sql_query_base} AND gs.subject = ? AND catalogNumber = ?"
            cursor.execute(sql_query, (modified_instructor, subject.upper(), course_section))
        else:
            cursor.execute(sql_query_base, (modified_instructor,))

        results = cursor.fetchall()

        columns = [column[0] for column in cursor.description]

        aggregated_data = OrderedDict()
        for column in columns:
            column_sum = sum(row[columns.index(column)] for row in results)
            if column_sum != 0:
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

        if course_param:
            course_param = course_param.strip()
            if " " not in course_param:
                subject, course_section = course_param[:2], course_param[2:]
            else:
                subject, course_section = course_param.split(" ", 1)
        else:
            subject, course_section = None, None

        result_data = run_sql_query(subject, course_section, teacher_param.strip())

        return jsonify(result_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

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
            ratings = professor.get_ratings(course_param.strip().replace(" ", "").upper())
            total_ratings = len(ratings)
            total_rating = sum(rating.rating for rating in ratings)
            total_difficulty = sum(rating.difficulty for rating in ratings)
            professor_rating = round(total_rating / total_ratings, 1)
            professor_difficulty = round(total_difficulty / total_ratings, 1)
        else:
            professor_rating = professor.rating
            professor_difficulty = professor.difficulty

        result_data = {
            'id': professor.id,
            'name': professor.name,
            'department': professor.department,
            'rating': professor_rating,
            'difficulty': professor_difficulty,
            'would_take_again': round(professor.would_take_again, 1) if professor.would_take_again is not None else None,
        }

        return jsonify(result_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.errorhandler(NotFound)
def page_not_found_handler(e: HTTPException):
    return render_template('404.html'), 404


@app.errorhandler(Unauthorized)
def unauthorized_handler(e: HTTPException):
    return render_template('401.html'), 401


@app.errorhandler(Forbidden)
def forbidden_handler(e: HTTPException):
    return render_template('403.html'), 403


@app.errorhandler(RequestTimeout)
def request_timeout_handler(e: HTTPException):
    return render_template('408.html'), 408
    

if __name__ == '__main__':
    app.run(debug=True)
