from django.utils.translation import gettext_lazy as _

ERROR = {
    "comment_empty": _("You need to write a comment before submitting."),
    "creation_post_title_equal_excerpt": _("The title and excerpt cannot be the same"),
    "creation_post_title_short_of_ten_characters": _(
        "The title can be nothing short of 10 characters."
    ),
}

SUCCESS = {
    "comment_created": _("The comment was successfully posted!"),
    "post_created": _("The post was sent for verification!"),
}
