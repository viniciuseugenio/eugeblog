import math


def make_pagination(page_range, cur_page, qty_pages=10):
    total_pages = len(page_range)

    if qty_pages > total_pages:
        qty_pages = total_pages

    mid_page = math.ceil(qty_pages / 2)
    start_page = cur_page - mid_page
    end_page = cur_page + mid_page

    if start_page < 0:
        end_page += abs(start_page)
        start_page = 0

    if end_page > total_pages + 1:
        start_page -= abs(end_page - total_pages)

    return {
        "has_previous": cur_page > 1,
        "has_next": cur_page < len(page_range),
        "page_range": page_range[start_page:end_page],
        "cur_page": cur_page,
        "prev_page": cur_page - 1,
        "next_page": cur_page + 1,
        "qty_pages": qty_pages,
        "start_page": start_page,
        "end_page": end_page,
        "total_pages": total_pages,
    }
