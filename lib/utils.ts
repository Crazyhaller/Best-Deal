export function extractPrice(...elements: any) {
  for (const element of elements) {
    const priceText = element.text().trim()
    const priceTextWithoutCurrency = priceText.replace(/[^0-9.-]+/g, '')
    const price = Number(priceTextWithoutCurrency)
    if (!isNaN(price)) {
      return price
    }
  }

  return ''
}
