// Add logic to like the post
const likeActionEl = document.getElementById('like-action')
if (!!likeActionEl) {
  likeActionEl.addEventListener('click', () => {
    const id = likeActionEl.getAttribute('data-id')
    fetch(`/posts/${id}/action/like`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(() => {
      window.location.reload()
    })
  })
}
