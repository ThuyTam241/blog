module.exports = {
  createPaginationNumbers: (totalItems, itemsPerPage) => {
    const pageNumbers = []
    const totalPages = Math.ceil(totalItems / itemsPerPage)
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i)
    }
    return pageNumbers
  },
}
