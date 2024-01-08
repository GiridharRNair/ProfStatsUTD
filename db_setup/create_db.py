# Usage: python db_setup/create_db.py


import sqlite3
import csv
import os


DB_PATH = 'api/db/utdgrades.db'
RAW_DATA_PATH = 'raw_data'

SQL_CREATE_TABLE = '''
    CREATE TABLE IF NOT EXISTS grades_populated(   
    aPlus INTEGER,
    a INTEGER,
    aMinus INTEGER,
    bPlus INTEGER,
    b INTEGER,
    bMinus INTEGER,
    cPlus INTEGER,
    c INTEGER,
    cMinus INTEGER,
    dPlus INTEGER,
    d INTEGER,
    dMinus INTEGER,
    f INTEGER,
    cr INTEGER,
    nc INTEGER,
    p INTEGER,
    w INTEGER,
    i INTEGER,
    nf INTEGER NOT NULL,
    instructor1 VARCHAR(255),
    subject VARCHAR(255),
    catalogNumber VARCHAR(255),
    section VARCHAR(255))
'''

SQL_INSERT_ROW = '''
    INSERT INTO grades_populated
    (aPlus, a, aMinus, 
    bPlus, b, bMinus, 
    cPlus, c, cMinus, 
    dPlus, d, dMinus, 
    f, cr, nc, p, w, i, nf, 
    instructor1, 
    subject, 
    catalogNumber,
    section)
    VALUES
    (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
'''


class GradesRow:
    def __init__(self, subject, course_num, section, grades, instructor):
        self.subject = subject
        self.course_num = course_num
        self.section = section
        self.grades = grades
        self.instructor = instructor


def index_row(row, *columns):
    for column in columns:
        try:
            value = row[column]
            return 0 if value == '' else value
        except KeyError:
            pass
    return 0


def reorder_name(name):
    name_parts = name.split(", ")
    return name_parts[0].strip() if len(name_parts) == 1 else f"{name_parts[1].strip()} {name_parts[0].strip()}"


def parse_data(data_dir):
    rows = []
    with os.scandir(data_dir) as entries:
        for entry in entries:
            print(f"Parsing {entry.name}")
            with open(os.path.join(data_dir, entry.name), 'r') as csvfile:
                for row in csv.DictReader(csvfile):
                    grades = {
                        'A+': index_row(row, 'A+'),
                        'A': index_row(row, 'A'),
                        'A-': index_row(row, 'A-'),
                        'B+': index_row(row, 'B+'),
                        'B': index_row(row, 'B'),
                        'B-': index_row(row, 'B-'),
                        'C+': index_row(row, 'C+'),
                        'C': index_row(row, 'C'),
                        'C-': index_row(row, 'C-'),
                        'D+': index_row(row, 'D+'),
                        'D': index_row(row, 'D'),
                        'D-': index_row(row, 'D-'),
                        'F': index_row(row, 'F'),
                        'CR': index_row(row, 'CR'),
                        'NC': index_row(row, 'NC'),
                        'P': index_row(row, 'P'),
                        'W': index_row(row, 'W', "Total W", "W Total"),
                        'I': index_row(row, 'I'),
                        'NF': index_row(row, 'NF')
                    }
                    instructor = reorder_name(row['Instructor 1'])
                    rows.append(GradesRow(row['Subject'], index_row(row, 'Catalog Nbr', 'Catalog Number'), row['Section'], grades, instructor))
    return rows


def create_table(cursor, rows):
    cursor.execute(SQL_CREATE_TABLE) 
    for row in rows:
        cursor.execute(SQL_INSERT_ROW, 
                       (row.grades['A+'], row.grades['A'], row.grades['A-'],
                        row.grades['B+'], row.grades['B'], row.grades['B-'],
                        row.grades['C+'], row.grades['C'], row.grades['C-'],
                        row.grades['D+'], row.grades['D'], row.grades['D-'],
                        row.grades['F'], row.grades['CR'], row.grades['NC'],
                        row.grades['P'], row.grades['W'], row.grades['I'],
                        row.grades['NF'],
                        row.instructor,
                        row.subject,
                        row.course_num,
                        row.section))
    cursor.connection.commit()


if __name__ == "__main__":
    cur = sqlite3.connect(DB_PATH).cursor()
    cur.execute('''DROP TABLE IF EXISTS grades_populated''')
    rows = parse_data(RAW_DATA_PATH)
    create_table(cur, rows)
    print(f"Created database at {DB_PATH}")
