export function downloadFile(blob, fileName) {
  let link = document.createElement('a')
  if ('download' in link) {
    const url = window.URL.createObjectURL(blob)
    link.href = url
    link.download = fileName
    link.click()
    window.URL.revokeObjectURL(url)
  } else {
    navigator.msSaveBlob(blob, fileName)
  }
  link = null
}
