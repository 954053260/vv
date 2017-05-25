/**
 * Created by hyt on 2017/3/23.
 */
function Comment (comment) {
    this.text = comment.text;
    this.date = comment.date || new Date();
    this.author = comment.author;
    this.email = comment.email;
    this.refId = comment.refId;
    this.articleId = comment.articleId;
}
module.exports = Comment;