class WebClipboard {
  items

  async read() {
    try {
      const response = await fetch("items/")
      this.items = await response.json()
    } catch (e) {
      console.error(e)
    }
  }

  async save(item) {
    const formData = new FormData()
    formData.append("input", item)
    try {
      const response = await fetch("items/", {
        method: "POST",
        body: formData,
      })
      const json = await response.json()
      if (!response.ok) {
        console.error(json)
        throw new Error(`Response status: ${response.status}`)
      }
      console.log(json)
      this.items.unshift(item)
      this.items.pop()
    } catch (e) {
      console.error(e)
    }
  }
}

function display() {
  const template = (item) => `
    <p>
      <div class="output" id="output${item.index}"></div>
      <button onclick="navigator.clipboard.writeText(wc.items[${item.index}])">
        Copy
      </button>
    </p>`
  indexed_items = wc.items.map((value, index) => ({index, value}))
  document.getElementById("output_container").innerHTML = indexed_items
    .map((item) => template(item))
    .join("")

  // Don't escape html tags for page display:
  // https://www.reddit.com/r/javascript/comments/4elq1w/comment/d217ip7/
  indexed_items.map(
    (item) =>
      document.getElementById("output" + item.index).textContent = item.value)
}

wc = new WebClipboard()
window.onload = wc.read().then(display)
document.getElementById("input_form").addEventListener("submit", (event) => {
  event.preventDefault()
  textarea = document.getElementById("input_textarea")
  wc.save(textarea.value).then(display)
  textarea.value = ""
})
