'use server'

import { revalidatePath } from 'next/cache'
import { scrapeAmazonProduct } from '../scraper'
import { connectDB } from '../mongoose'
import Product from '../models/product.model'
import { getHighestPrice, getLowestPrice, getAveragePrice } from '../utils'

export async function scrapeAndStoreProduct(productUrL: string) {
  if (!productUrL) return

  try {
    connectDB()

    const scrapedProduct = await scrapeAmazonProduct(productUrL)

    if (!scrapedProduct) return

    let product = scrapedProduct

    const existingProduct = await Product.findOne({ url: scrapedProduct.url })

    if (existingProduct) {
      const updatedPriceHistory: any = [
        ...existingProduct.priceHistory,
        { price: scrapedProduct.currentPrice },
      ]
      product = {
        ...scrapedProduct,
        priceHistory: updatedPriceHistory,
        lowestPrice: getLowestPrice(updatedPriceHistory),
        highestPrice: getHighestPrice(updatedPriceHistory),
        averagePrice: getAveragePrice(updatedPriceHistory),
      }
    }

    const newProduct = await Product.findOneAndUpdate(
      { url: scrapedProduct.url },
      product,
      { new: true, upsert: true }
    )

    revalidatePath(`/product/${newProduct._id}`)
  } catch (error: any) {
    throw new Error(`Failed to create/update product: ${error.message}`)
  }
}

export async function getProductById(productId: string) {
  try {
    connectDB()

    const product = await Product.findOne({ _id: productId })

    if (!product) return null

    return product
  } catch (error: any) {
    throw new Error(`Failed to get product: ${error.message}`)
  }
}
