// Add logic to like the post
const likeActionEl = document.getElementById('like-action');
if (!!likeActionEl) {
  likeActionEl.addEventListener('click', () => {
    const postId = likeActionEl.getAttribute('data-id');
    fetch(`/posts/${postId}/action/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      window.location.reload();
    });
  });
}

// Add logic to handle comment form in the detail page
const formEl = document.getElementById('comment-form');

formEl.addEventListener('submit', async ($event) => {
  $event.preventDefault();

  const formData = new FormData(formEl);
  const content = formData.get('content');
  const postId = formEl.getAttribute('post-id');

  try {
    fetch(`/posts/${postId}/action/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    }).then(() => {
      window.location.reload();
    });
  } catch (error) {
    console.error('Error:', error);
  }
});

// Add logic to display textarea to update comment
document.querySelectorAll('[id^="update-comment-btn-"]').forEach((updateCommentBtnEl) => {
  updateCommentBtnEl.addEventListener('click', () => {
    // Select the textare match with current edit button in this loop
    const textareaId = updateCommentBtnEl.id.replace('btn', 'textarea');
    const textareaEl = document.getElementById(textareaId);

    // Hide the content text
    const commentId = textareaEl.getAttribute('comment-id');
    document.getElementById(`comment-content-${commentId}`).classList.add('hidden');

    // Show textarea to edit the comment
    textareaEl.parentElement.classList.remove('hidden');
    textareaEl.focus();

    // Place the cursor at the end of the textarea content
    const contentLength = textareaEl.value.length;
    textareaEl.setSelectionRange(contentLength, contentLength);
  });
});

document.querySelectorAll('[id^="update-comment-textarea-"]').forEach((updateCommentTextareaEl) => {
  const commentId = updateCommentTextareaEl.getAttribute('comment-id');

  updateCommentTextareaEl.addEventListener('blur', () => {
    // Hide the textarea
    updateCommentTextareaEl.parentElement.classList.add('hidden');

    // Show the text content
    document.getElementById(`comment-content-${commentId}`).classList.remove('hidden');
  });

  updateCommentTextareaEl.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      const content = event.target.value;
      try {
        fetch(`/comments/${commentId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });
});

// Add logic to delete the comment
document.querySelectorAll('[id^="delete-comment-btn-"]').forEach((deleteCommentBtnEl) => {
  deleteCommentBtnEl.addEventListener('click', (event) => {
    const commentId = deleteCommentBtnEl.getAttribute('comment-id');

    try {
      fetch(`/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }).then(() => {
        window.location.reload();
      });
    } catch (error) {
      console.error('Error:', error);
    }
  });
});

// Add logic to display textarea to reply comment
document.querySelectorAll('[id^="reply-comment-btn-"]').forEach((replyCommentBtnEl) => {
  replyCommentBtnEl.addEventListener('click', () => {
    // Select the textare match with current reply button in this loop
    const textareaId = replyCommentBtnEl.id.replace('btn', 'textarea');
    const textareaEl = document.getElementById(textareaId);

    // Show textarea to reply the comment
    textareaEl.parentElement.classList.remove('hidden');
    textareaEl.focus();

    // Place the cursor at the end of the textarea content
    const contentLength = textareaEl.value.length;
    textareaEl.setSelectionRange(contentLength, contentLength);
  });
});

document.querySelectorAll('[id^="reply-comment-textarea-"]').forEach((replyCommentTextareaEl) => {
  const commentId = replyCommentTextareaEl.getAttribute('comment-id');

  replyCommentTextareaEl.addEventListener('blur', () => {
    // Hide the textarea
    replyCommentTextareaEl.parentElement.classList.add('hidden');
  });

  replyCommentTextareaEl.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      const content = event.target.value;
      try {
        fetch(`/comments/${commentId}/reply`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content }),
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });
});
