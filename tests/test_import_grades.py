import csv
import sys
import tempfile
import unittest
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT_DIR / "scripts"))

from import_grades import parse_sources, reorder_name, search_name


class ImportGradesTest(unittest.TestCase):
    def test_reorders_comma_name(self):
        self.assertEqual(reorder_name("Doe, John R"), "John R Doe")

    def test_reorders_edge_case_professor_name(self):
        self.assertEqual(reorder_name("Mac Alevey, Paul J"), "Paul MacAlevey")

    def test_normalizes_search_name(self):
        self.assertEqual(search_name("Paul MacAlevey"), "paul macalevey")
        self.assertEqual(search_name("O'Neill, Cynthia M"), "o neill cynthia m")

    def test_parses_csv_with_grade_and_course_column_variants(self):
        with tempfile.TemporaryDirectory() as tmpdir:
            csv_path = Path(tmpdir) / "Fall 2024.csv"
            with csv_path.open("w", encoding="utf-8", newline="") as csv_file:
                writer = csv.DictWriter(
                    csv_file,
                    fieldnames=[
                        "Subject",
                        "Catalog Number",
                        "Section",
                        "A+",
                        "A",
                        "A-",
                        "B+",
                        "B",
                        "B-",
                        "C+",
                        "C",
                        "C-",
                        "D+",
                        "D",
                        "D-",
                        "F",
                        "CR",
                        "NC",
                        "P",
                        "Total W",
                        "I",
                        "NF",
                        "Instructor 1",
                    ],
                )
                writer.writeheader()
                writer.writerow(
                    {
                        "Subject": "cs",
                        "Catalog Number": "2305",
                        "Section": "001",
                        "A+": "1",
                        "A": "",
                        "A-": "2",
                        "B+": "3",
                        "B": "4",
                        "B-": "5",
                        "C+": "6",
                        "C": "7",
                        "C-": "8",
                        "D+": "9",
                        "D": "10",
                        "D-": "11",
                        "F": "12",
                        "CR": "13",
                        "NC": "14",
                        "P": "15",
                        "Total W": "16",
                        "I": "17",
                        "NF": "18",
                        "Instructor 1": "Du, Ding Z",
                    }
                )

            sections = parse_sources(Path(tmpdir))

        self.assertEqual(len(sections), 1)
        section = sections[0]
        self.assertEqual(section.term, "Fall 2024")
        self.assertEqual(section.subject, "CS")
        self.assertEqual(section.catalog_number, "2305")
        self.assertEqual(section.section, "001")
        self.assertEqual(section.instructor_name, "Ding-Zhu Du")
        self.assertEqual(section.instructor_search_name, "ding zhu du")
        self.assertEqual(section.grades["a_plus"], 1)
        self.assertEqual(section.grades["a"], 0)
        self.assertEqual(section.grades["w"], 16)
        self.assertEqual(section.grades["nf"], 18)


if __name__ == "__main__":
    unittest.main()
