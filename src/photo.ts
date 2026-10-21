// Long side at most `max`, same aspect ratio, never scales up.
export const fitWithin = (w: number, h: number, max: number) => {
  const scale = Math.min(1, max / Math.max(w, h))
  return { width: Math.round(w * scale), height: Math.round(h * scale) }
}

// Phone photos are 5–10 MB; localStorage holds ~5 MB. This brings one down to ~50–100 KB.
export const shrinkPhoto = async (file: File): Promise<string> => {
  const image = await createImageBitmap(file)
  const { width, height } = fitWithin(image.width, image.height, 800)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  canvas.getContext('2d')!.drawImage(image, 0, 0, width, height)
  image.close()
  return canvas.toDataURL('image/jpeg', 0.7)
}
