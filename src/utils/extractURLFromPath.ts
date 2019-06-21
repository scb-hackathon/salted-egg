export function extractPathFromURL(link: string) {
  const url = new URL(link)

  return url.pathname.slice(1)
}