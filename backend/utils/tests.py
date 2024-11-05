import unittest

from utils import make_pagination


class TestPagination(unittest.TestCase):
    def test_pagination_changes_when_in_middle_page(self):
        page_range = [i for i in range(1, 21)]

        current_page = 4
        paginator = make_pagination(page_range, current_page)
        self.assertEqual(paginator["page_range"][-1], 10)

        current_page = 6
        paginator = make_pagination(page_range, current_page)
        self.assertEqual(paginator["page_range"][-1], 11)

        current_page = 7
        paginator = make_pagination(page_range, current_page)
        self.assertEqual(paginator["page_range"][-1], 12)

    def test_pagination_qty_pages_changes_when_its_bigger_than_total_pages(self):
        page_range = [i for i in range(1, 8)]
        paginator = make_pagination(page_range, 1)

        self.assertEqual(paginator["qty_pages"], 7)

    def test_pagination_start_page_subtracts_when_end_page_bigger_than_total_pages(
        self,
    ):
        page_range = [i for i in range(1, 11)]
        paginator = make_pagination(page_range=page_range, cur_page=9, qty_pages=5)

        # If the current page is 9 and the quantity of pages displayed on the pagination is 5, the start page should be 4, because 4 + 5 = 9.
        self.assertEqual(paginator["start_page"], 4)
