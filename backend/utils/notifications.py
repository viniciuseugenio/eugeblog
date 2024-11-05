from django.utils.translation import gettext_lazy as _

ERROR = {
    "prohibited_notification": _("You can't do this!"),
    "comment_empty": _("You need to write a comment before submitting."),
    "creation_post_title_equal_excerpt": _("The title and excerpt cannot be the same"),
    "creation_post_title_short_of_ten_characters": _(
        "The title can be nothing short of 10 characters."
    ),
    "not_post_author": _("You are not the author of this post."),
    "post_already_bookmarked": _("You have already bookmarked this post!"),
    "not_post_reviewer": _("You are not a post reviewer."),
    "post_is_published": _("This post is already published!"),
}

SUCCESS = {
    "comment_created": _("The comment was successfully posted!"),
    "post_created": _("The post was sent for verification!"),
    "post_edited": _("Your post was edited and sent for verification!"),
    "post_deleted": _("The post was successfully deleted!"),
    "post_bookmarked": _("The post was successfully bookmarked!"),
    "post_published": _("The post was successfully published!"),
}

WARNING = {
    "bookmark_removed": _("This post was unbookmarked."),
}
