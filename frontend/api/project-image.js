import { put } from '@vercel/blob'

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN
}

export const config = {
  api: {
    bodyParser: false
  }
}

export default async function handler(request, response) {
  try {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS')

    if (request.method === 'OPTIONS') {
      response.status(204).end()
      return
    }

    if (request.method !== 'POST') {
      response.status(405).json({ error: 'Method not allowed' })
      return
    }

    const chunks = []

    for await (const chunk of request) {
      chunks.push(chunk)
    }

    const contentType = request.headers['content-type'] || ''
    const boundary = getBoundary(contentType)

    if (!boundary) {
      response.status(400).json({ error: 'Missing multipart boundary' })
      return
    }

    const file = parseMultipartFile(Buffer.concat(chunks), boundary)

    if (!file) {
      response.status(400).json({ error: 'No image uploaded' })
      return
    }

    const safeName = file.filename.replace(/[^\w.-]/g, '-')
    const pathname = `projects/images/${Date.now()}-${safeName}`
    const blob = await put(pathname, file.content, {
      access: 'public',
      contentType: file.contentType || 'application/octet-stream',
      token: getBlobToken()
    })

    response.status(200).json({ url: blob.url })
  } catch (error) {
    console.error('Project image API failed:', error)
    response.status(500).json({
      error: 'Failed to upload project image',
      message: error.message,
      code: error.name || 'Error',
      hasBlobToken: Boolean(getBlobToken())
    })
  }
}

function getBoundary(contentType) {
  const match = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i)
  return match?.[1] || match?.[2] || ''
}

function parseMultipartFile(buffer, boundary) {
  const marker = Buffer.from(`--${boundary}`)
  const headerEndMarker = Buffer.from('\r\n\r\n')
  let offset = 0

  while (offset < buffer.length) {
    const partStart = buffer.indexOf(marker, offset)
    if (partStart === -1) break

    const headerStart = partStart + marker.length + 2
    const headerEnd = buffer.indexOf(headerEndMarker, headerStart)
    if (headerEnd === -1) break

    const headers = buffer.toString('utf8', headerStart, headerEnd)
    const disposition = headers.match(/name="image";\s*filename="([^"]+)"/i)

    const nextPart = buffer.indexOf(marker, headerEnd + headerEndMarker.length)
    if (nextPart === -1) break

    if (disposition) {
      const contentType = headers.match(/content-type:\s*([^\r\n]+)/i)?.[1]
      const contentStart = headerEnd + headerEndMarker.length
      const contentEnd = nextPart - 2

      return {
        filename: disposition[1],
        contentType,
        content: buffer.subarray(contentStart, contentEnd)
      }
    }

    offset = nextPart
  }

  return null
}
