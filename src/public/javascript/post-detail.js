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
