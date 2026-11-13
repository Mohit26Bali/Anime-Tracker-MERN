const buildCommentTree = (comments) => {
  const byId = new Map();
  const roots = [];

  comments.forEach((comment) => {
    byId.set(comment._id.toString(), { ...comment.toObject(), replies: [] });
  });

  byId.forEach((comment) => {
    if (comment.parentComment) {
      const parent = byId.get(comment.parentComment.toString());
      if (parent) parent.replies.push(comment);
    } else {
      roots.push(comment);
    }
  });

  return roots;
};

export default buildCommentTree;
