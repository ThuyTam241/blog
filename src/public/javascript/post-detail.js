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
const updateCommentTextareaEl = document.getElementById('update-comment-textarea');

document.querySelectorAll('[id^="update-comment-btn-"]').forEach((updateCommentBtnEl) => {
  updateCommentBtnEl.addEventListener('click', () => {
    // Select the textare match with current edit button in this loop
    const textareaId = updateCommentBtnEl.id.replace('btn', 'textarea');
    const textareaEl = document.getElementById(textareaId);

    // Show textarea to edit the comment
    textareaEl.parentElement.classList.remove('hidden');
    textareaEl.focus();

    // Place the cursor at the end of the textarea content
    const contentLength = textareaEl.value.length;
    textareaEl.setSelectionRange(contentLength, contentLength);
  });
});

document.querySelectorAll('[id^="update-comment-textarea-"]').forEach((updateCommentTextareaEl) => {
  updateCommentTextareaEl.addEventListener('blur', () => {
    updateCommentTextareaEl.parentElement.classList.add('hidden');
  });

  updateCommentTextareaEl.addEventListener('keypress', (event) => {
    if (event.keyCode === 13) {
      event.preventDefault();

      const content = event.target.value;
      const commentId = updateCommentTextareaEl.getAttribute('comment-id');

      try {
        fetch(`/comments/${commentId}/update`, {
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
    }
  });
});
