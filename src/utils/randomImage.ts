export function randomImage(width: number, height?: number) {
  if (!height) height = width

  const index = Math.floor(Math.random() * 100000)

  return `https://picsum.photos/${width}/${height}?cb=${index}`
}