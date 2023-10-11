'use server'

import { scrapeAmazonProduct } from '../scraper'

export async function scrapeAndStoreProduct(productUrL: String) {
  if (!productUrL) return

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrL)
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}
