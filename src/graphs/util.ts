export function SVGToPng(input: HTMLElement, title: string) {
  let width = "600"
  let height = "600"

  if (input.firstChild && (input.firstChild as SVGAElement).getAttribute("height")! && (input.firstChild as SVGAElement).getAttribute("width")!) {
    height = String(Number.parseInt((input.firstChild as SVGAElement).getAttribute("height")!) * 2)
    width = String(Number.parseInt((input.firstChild as SVGAElement).getAttribute("height")!) * 2)
  } else {
    return
  }

  const svgData = new XMLSerializer().serializeToString(input.firstChild!)
  const svgDataBase64 = btoa(unescape(encodeURIComponent(svgData)))
  const svgDataUrl = `data:image/svg+xml;charset=utf-8;base64,${svgDataBase64}`

  // console.log(svgData)
  // console.log(encodeURIComponent(svgData))
  // console.log(unescape(encodeURIComponent(svgData)))
  // console.log(btoa(unescape(encodeURIComponent(svgData))))

  const image = new Image()

  image.addEventListener('load', () => {
    const canvas = document.createElement('canvas')

    canvas.setAttribute('width', String(width))
    canvas.setAttribute('height', String(height))

    const context = canvas.getContext('2d')!
    context.drawImage(image, 0, 0, Number.parseFloat(width), Number.parseFloat(height))

    const dataUrl = canvas.toDataURL('image/png')
    const aDownloadLink = document.createElement('a');
    aDownloadLink.download = `${title}.png`;
    aDownloadLink.href = dataUrl;
    aDownloadLink.click();

    aDownloadLink.remove()
    canvas.remove()
  })

  image.src = svgDataUrl


}

