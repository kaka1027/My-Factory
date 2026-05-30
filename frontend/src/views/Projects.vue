<template>
  <div class="container projects-page">
    <div class="projects-header">
      <div>
        <h1>Projects</h1>
        <p>上传文章、图片和链接，保存自己的项目记录。</p>
      </div>
      <button type="button" @click="startNewProject">添加自主上传</button>
    </div>

    <form class="project-form" @submit.prevent="saveProject">
      <div class="form-grid">
        <label>
          <span>项目名称</span>
          <input v-model.trim="form.title" type="text" placeholder="输入项目名称" required>
        </label>

        <label>
          <span>创作者名字</span>
          <input v-model.trim="form.creator" type="text" placeholder="输入创作者名字" required>
        </label>

        <label>
          <span>邮箱</span>
          <input v-model.trim="form.email" type="email" placeholder="name@example.com">
        </label>

        <label>
          <span>链接</span>
          <input v-model.trim="form.link" type="url" placeholder="https://example.com">
        </label>
      </div>

      <label class="full-field">
        <span>文章内容</span>
        <textarea v-model.trim="form.content" rows="8" placeholder="写下项目文章内容" required></textarea>
      </label>

      <label class="upload-box">
        <span>图片上传</span>
        <input type="file" accept="image/*" @change="handleImageChange">
        <small v-if="imageFile">{{ imageFile.name }}</small>
        <small v-else-if="form.imageUrl">已上传图片，可继续更换</small>
        <small v-else>支持选择一张图片随文章保存</small>
      </label>

      <div v-if="imagePreview" class="image-preview">
        <img :src="imagePreview" alt="项目图片预览">
      </div>

      <p v-if="message" class="form-message" :class="{ error: isError }">{{ message }}</p>

      <div class="form-actions">
        <button type="submit" :disabled="isSaving">{{ isSaving ? '上传中...' : submitLabel }}</button>
        <button type="button" class="secondary-button" @click="resetForm">清空</button>
      </div>
    </form>

    <section class="projects-list">
      <h2>已上传项目</h2>

      <p v-if="isLoading" class="empty-state">正在加载项目...</p>
      <p v-else-if="projects.length === 0" class="empty-state">还没有上传项目。</p>

      <article v-for="project in projects" :key="project.id" class="project-card">
        <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title">
        <div class="project-card-content">
          <div class="project-card-header">
            <div>
              <h3>{{ project.title }}</h3>
              <p>创作者：{{ project.creator }}</p>
            </div>
            <button type="button" class="secondary-button small-button" @click="editProject(project)">编辑</button>
          </div>

          <p class="project-content">{{ project.content }}</p>

          <div class="project-meta">
            <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer">打开链接</a>
            <button v-if="project.link" type="button" class="link-button" @click="copyText(project.link)">复制链接</button>
            <a v-if="project.email" :href="`mailto:${project.email}`">{{ project.email }}</a>
            <button v-if="project.email" type="button" class="link-button" @click="copyText(project.email)">复制邮箱</button>
          </div>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'

const emptyForm = {
  id: '',
  title: '',
  creator: '',
  email: '',
  link: '',
  content: '',
  imageUrl: ''
}

const projects = ref([])
const form = reactive({ ...emptyForm })
const imageFile = ref(null)
const imagePreview = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const message = ref('')
const isError = ref(false)

const submitLabel = computed(() => (form.id ? '保存修改' : '上传文章'))

onMounted(loadProjects)

async function loadProjects() {
  isLoading.value = true
  try {
    const response = await fetch('/api/projects')
    if (!response.ok) throw new Error('cloud-unavailable')
    projects.value = await response.json()
  } catch {
    projects.value = JSON.parse(localStorage.getItem('projects') || '[]')
    setMessage('当前使用本地暂存。部署到 Vercel 并配置 Blob 后会保存到云端。', false)
  } finally {
    isLoading.value = false
  }
}

async function saveProject() {
  isSaving.value = true
  setMessage('', false)

  try {
    const payload = {
      id: form.id || crypto.randomUUID(),
      title: form.title,
      creator: form.creator,
      email: form.email,
      link: form.link,
      content: form.content,
      imageUrl: form.imageUrl,
      updatedAt: new Date().toISOString()
    }

    if (imageFile.value) {
      payload.imageUrl = await uploadImage(imageFile.value)
    }

    const nextProjects = upsertProject(payload)
    await persistProjects(nextProjects)
    projects.value = nextProjects
    resetForm()
    setMessage('项目已上传保存。', false)
  } catch (error) {
    setMessage(error.message || '上传失败，请稍后再试。', true)
  } finally {
    isSaving.value = false
  }
}

async function uploadImage(file) {
  const data = new FormData()
  data.append('image', file)

  try {
    const response = await fetch('/api/project-image', {
      method: 'POST',
      body: data
    })
    if (!response.ok) throw new Error('image-local')
    const result = await response.json()
    return result.url
  } catch {
    return imagePreview.value
  }
}

async function persistProjects(nextProjects) {
  localStorage.setItem('projects', JSON.stringify(nextProjects))

  const response = await fetch('/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projects: nextProjects })
  })

  if (!response.ok) {
    throw new Error('已保存到本地，但云端保存失败。请确认 Vercel Blob 已配置。')
  }
}

function upsertProject(project) {
  const existingIndex = projects.value.findIndex((item) => item.id === project.id)
  if (existingIndex >= 0) {
    return projects.value.map((item) => (item.id === project.id ? project : item))
  }
  return [project, ...projects.value]
}

function editProject(project) {
  Object.assign(form, project)
  imageFile.value = null
  imagePreview.value = project.imageUrl || ''
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handleImageChange(event) {
  const [file] = event.target.files
  imageFile.value = file || null
  imagePreview.value = file ? URL.createObjectURL(file) : form.imageUrl
}

async function copyText(text) {
  await navigator.clipboard.writeText(text)
  setMessage('已复制。', false)
}

function startNewProject() {
  resetForm()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function resetForm() {
  Object.assign(form, emptyForm)
  imageFile.value = null
  imagePreview.value = ''
}

function setMessage(text, error) {
  message.value = text
  isError.value = error
}
</script>
