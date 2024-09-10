def make_pagination(page_range, cur_page, qty_pages=10):
    mid_page = qty_pages // 2
    start_page = cur_page - mid_page
    end_page = cur_page + mid_page

    if start_page < 0:
        start_page_offset = abs(start_page)
        end_page += start_page_offset
        start_page = 0

    if end_page > len(page_range):
        end_page_offset = end_page - len(page_range)
        start_page -= end_page_offset

    return {
        "has_previous": cur_page > 1,
        "has_next": cur_page < len(page_range),
        "page_range": page_range[start_page:end_page],
        "cur_page": cur_page,
        "prev_page": cur_page - 1,
        "next_page": cur_page + 1,
    }
