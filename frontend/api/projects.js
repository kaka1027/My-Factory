import { list, put } from '@vercel/blob'

const PROJECTS_FILE = 'projects/projects.json'

function getBlobToken() {
  return process.env.BLOB_READ_WRITE_TOKEN
}

export default async function handler(request, response) {
  try {
    response.setHeader('Access-Control-Allow-Origin', '*')
    response.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

    if (request.method === 'OPTIONS') {
      response.status(204).end()
      return
    }

    if (request.method === 'GET') {
      const projects = await readProjects()
      response.status(200).json(projects)
      return
    }

    if (request.method === 'POST') {
      const body = typeof request.body === 'string' ? JSON.parse(request.body) : request.body
      const projects = Array.isArray(body?.projects) ? body.projects : []

      await put(PROJECTS_FILE, JSON.stringify(projects, null, 2), {
        access: 'public',
        contentType: 'application/json',
        addRandomSuffix: false,
        allowOverwrite: true,
        token: getBlobToken()
      })

      response.status(200).json({ ok: true })
      return
    }

    response.status(405).json({ error: 'Method not allowed' })
  } catch (error) {
    console.error('Projects API failed:', error)
    response.status(500).json({
      error: 'Failed to save projects',
      message: error.message,
      code: error.name || 'Error',
      hasBlobToken: Boolean(getBlobToken())
    })
  }
}

async function readProjects() {
  const blobs = await list({ prefix: PROJECTS_FILE, limit: 1, token: getBlobToken() })
  const file = blobs.blobs.find((blob) => blob.pathname === PROJECTS_FILE)

  if (!file) {
    return []
  }

  const result = await fetch(file.url)
  if (!result.ok) {
    return []
  }

  return result.json()
}
