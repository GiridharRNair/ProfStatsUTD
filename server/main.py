from werkzeug.exceptions import Forbidden, HTTPException, NotFound, RequestTimeout, Unauthorized
from flask import Flask, request, jsonify, render_template
from collections import OrderedDict
from flask_cors import CORS
import ratemyprofessor
import sqlite3
import os


current_dir = os.path.dirname(os.path.abspath(__file__))
db_path = os.path.join(current_dir, "utdgrades.sqlite3")

app = Flask(__name__, template_folder=os.path.join(current_dir, "templates"))
app.json.sort_keys = False
CORS(app)


def run_sql_query(subject, course_section=None, instructor=None):
    with sqlite3.connect(db_path) as conn:
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
            WHERE TRIM(gs.instructor1) = ?
        """

        if subject and course_section:
            sql_query = f"{sql_query_base} AND gs.subject = ? AND catalogNumber = ?"
            cursor.execute(sql_query, (instructor, subject.upper(), course_section))
        else:
            cursor.execute(sql_query_base, (instructor,))

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
    try:
        teacher_param = request.args.get('teacher').strip()
        course_param = request.args.get('course')

        if not teacher_param:
            raise ValueError("Required parameter missing")

        if course_param:
            course_param = course_param.strip()
            if " " not in course_param:
                subject, course_section = course_param[:2], course_param[2:]
            else:
                subject, course_section = course_param.split(" ", 1)
        else:
            subject, course_section = None, None

        result_data = run_sql_query(subject, course_section, teacher_param)

        return jsonify(result_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 400
    

@app.route('/ratings', methods=['GET'])
def get_ratings():
    try:
        teacher_param = request.args.get('teacher').strip()

        if not teacher_param:
            raise ValueError("Required parameter missing")

        professor = ratemyprofessor.get_professor_by_school_and_name(
            ratemyprofessor.get_school_by_name("The University of Texas at Dallas"),
            teacher_param
        )
        
        result_data = {}

        if professor:
            result_data = {
                'name': professor.name,
                'department': professor.department,
                'rating': professor.rating,
                'difficulty': professor.difficulty,
                'would_take_again': round(professor.would_take_again, 1) if professor.would_take_again is not None else None
            }

        return jsonify(result_data) if result_data else jsonify({"error": "No data! Make sure you have the correct teacher name"})

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
