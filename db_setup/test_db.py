"""
Run this script from the root directory of the project.

Example: python db_setup/test_db.py
"""

import unittest
import sqlite3


DB_PATH = 'api/utdgrades.db'
TEST_TEACHER_DATA = [(2, 1, 2, 3, 1, 0, 2, 0, 3, 1, 0, 1, 1, 0, 0, 0, 0, 0, 0, 'Giridhar R Nair', 'FAKE', '2005', '001')]


class TestDB(unittest.TestCase):

    def setUp(self):
        self.connection = sqlite3.connect(DB_PATH)
        self.cursor = self.connection.cursor()


    def tearDown(self):
        self.connection.close()


    def test_table_exists(self):
        self.cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='grades_populated'")
        self.assertTrue(self.cursor.fetchone() == ('grades_populated',), "Table does not exist")


    def test_teacher_exists(self):
        self.cursor.execute("SELECT * FROM grades_populated WHERE instructor1 = 'Giridhar R Nair'")
        teacher_data = self.cursor.fetchall()
        self.assertTrue(teacher_data is not None, "Teacher does not exist")


    def test_teacher_data_match(self):
        self.cursor.execute("SELECT * FROM grades_populated WHERE instructor1 = 'Giridhar R Nair'")
        teacher_data = self.cursor.fetchall()
        self.assertEqual(teacher_data, TEST_TEACHER_DATA, "Teacher data does not match")


if __name__ == '__main__':
    unittest.main()

