import {CurrentItemMap, PriceMap} from 'utils/db'
import {BotContext, match} from 'bot'

const howMuchItemRegex = /([ก-๙]+|\w+\s?)กี่บาท/
const howMuchPriceRegex = /([ก-๙]+|\w+\s?)ราคา/

function getItemName(text: string) {
  let item = match(howMuchItemRegex, text)
  if (!item) item = match(howMuchPriceRegex, text)
  if (!item) item = '🍕'

  return item.trim().replace(/ราคา/g, '')
}

export async function getQuotation(ctx: BotContext, text: string) {
  const name = getItemName(text)
  const price = Math.floor(Math.random() * 1000)

  PriceMap[name] = price
  CurrentItemMap[ctx.sender] = name

  console.log(`>> Customer asked for price of ${name} (${price} THB) 😃`)

  return `${name}ราคา ${price} บาทค่ะ 🦄`
}