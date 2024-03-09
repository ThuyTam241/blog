// Add logic for the pagination buttons
document.querySelectorAll('[id^="pagination-btn"]').forEach((paginationBtnEl) => {
  paginationBtnEl.addEventListener('click', ($event) => {
    const pageNumber = parseInt($event.target.getAttribute('page'))
    if (!pageNumber) {
      return
    }

    const currentUrl = window.location.href
    let newUrl = createNewUrl(currentUrl, pageNumber)
    window.location.href = newUrl
  })
})

// Add logic to redirect to post detail when clicking on the card post
document.querySelectorAll('[id^="card-post-"]').forEach((cardPostEl) => {
  cardPostEl.addEventListener('click', () => {
    const postId = cardPostEl.id.replace('card-post-', '')
    window.location.href = `/posts/${postId}`
  })
})

const createNewUrl = (currentUrl, pageNumber) => {
  let newUrl
  if (currentUrl.includes('?')) {
    if (currentUrl.includes('page=')) {
      newUrl = currentUrl.replace(/(page=)[^\&]+/, '$1' + pageNumber)
    } else {
      newUrl = currentUrl + '&page=' + pageNumber
    }
  } else {
    newUrl = currentUrl + '?page=' + pageNumber
  }
  return newUrl
}
