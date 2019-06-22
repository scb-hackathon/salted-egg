export function randomImage(width: number, height?: number, word?: string) {
  if (!height) height = width

  const index = Math.floor(Math.random() * 100000)

  if (word) {
    if (/[ก-๙]+/g.test(word)) {
      return `https://picsum.photos/${width}/${height}?cb=${index}`
    }

    if (/[A-z]+/g.test(word)) {
      return `https://source.unsplash.com/${width}x${height}/?${word}`
    }
  }

  return `https://picsum.photos/${width}/${height}?cb=${index}`
}