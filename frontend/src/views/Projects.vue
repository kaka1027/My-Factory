<template>
  <div class="container projects-page">
    <header class="projects-header">
      <div class="projects-title-block">
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h1>{{ copy.title }}</h1>
        <p>{{ copy.description }}</p>
      </div>
      <button type="button" class="primary-button" @click="startNewProject">{{ copy.addProject }}</button>
    </header>

    <p v-if="message" class="form-message" :class="{ error: isError }">{{ message }}</p>

    <section class="projects-list" :class="{ 'cover-view': viewMode === 'cover' }">
      <div class="section-heading">
        <div>
          <h2>{{ copy.addedProjects }}</h2>
          <span>{{ projectCountText }}</span>
        </div>
        <div class="view-toggle" role="group" :aria-label="copy.viewMode">
          <button
            type="button"
            :class="{ active: viewMode === 'list' }"
            :aria-pressed="viewMode === 'list'"
            :aria-label="copy.listView"
            :title="copy.listView"
            @click="setViewMode('list')"
          >
            <span class="view-icon list" aria-hidden="true"></span>
          </button>
          <button
            type="button"
            :class="{ active: viewMode === 'cover' }"
            :aria-pressed="viewMode === 'cover'"
            :aria-label="copy.coverView"
            :title="copy.coverView"
            @click="setViewMode('cover')"
          >
            <span class="view-icon cover" aria-hidden="true"></span>
          </button>
        </div>
      </div>

      <p v-if="isLoading" class="empty-state">{{ copy.loading }}</p>
      <p v-else-if="projects.length === 0" class="empty-state">{{ copy.empty }}</p>

      <article
        v-for="project in projects"
        :key="project.id"
        class="project-card"
        :class="{ cover: viewMode === 'cover' }"
      >
        <div v-if="viewMode === 'cover'" class="project-cover">
          <img v-if="project.imageUrl" :src="project.imageUrl" :alt="project.title">
          <div v-else class="project-cover-placeholder">{{ copy.noCover }}</div>
        </div>
        <img v-else-if="project.imageUrl" :src="project.imageUrl" :alt="project.title">
        <div class="project-card-content">
          <div class="project-card-header">
            <div>
              <div class="project-title-row">
                <h3>{{ project.title }}</h3>
                <span class="created-at">{{ formatCreatedAt(project) }}</span>
              </div>
              <p>{{ copy.authorPrefix }}{{ project.creator }}</p>
            </div>
            <button type="button" class="secondary-button small-button" @click="editProject(project)">
              {{ copy.edit }}
            </button>
          </div>

          <p class="project-content">{{ project.content }}</p>

          <div class="project-meta">
            <a v-if="project.link" :href="project.link" target="_blank" rel="noopener noreferrer">{{ copy.openLink }}</a>
            <button v-if="project.link" type="button" class="link-button" @click="copyText(project.link)">
              {{ copy.copyLink }}
            </button>
            <a v-if="project.email" :href="`mailto:${project.email}`">{{ project.email }}</a>
            <button v-if="project.email" type="button" class="link-button" @click="copyText(project.email)">
              {{ copy.copyEmail }}
            </button>
          </div>
        </div>
      </article>
    </section>

    <div v-if="showForm" class="modal-overlay" @click.self="closeForm">
      <div class="modal-content" role="dialog" aria-modal="true" aria-labelledby="project-form-title">
        <button type="button" class="modal-close" @click="closeForm" :aria-label="copy.close">×</button>

        <form class="project-form" @submit.prevent="saveProject">
          <div class="form-main">
            <div class="form-heading">
              <p class="eyebrow">{{ form.id ? copy.editRecord : copy.newRecord }}</p>
              <h2 id="project-form-title">{{ form.id ? copy.editProject : copy.addProject }}</h2>
              <p>{{ copy.formHelp }}</p>
            </div>

            <div class="form-grid">
              <label>
                <span>{{ copy.projectName }} <strong>*</strong></span>
                <input v-model.trim="form.title" type="text" :placeholder="copy.projectNamePlaceholder" required>
              </label>

              <label>
                <span>{{ copy.authorName }} <strong>*</strong></span>
                <input v-model.trim="form.creator" type="text" :placeholder="copy.authorNamePlaceholder" required>
              </label>

              <label>
                <span>{{ copy.email }}</span>
                <input v-model.trim="form.email" type="email" placeholder="name@example.com">
              </label>

              <label>
                <span>{{ copy.link }}</span>
                <input v-model.trim="form.link" type="url" placeholder="https://example.com">
              </label>
            </div>

            <label class="full-field">
              <span>{{ copy.content }} <strong>*</strong></span>
              <textarea v-model.trim="form.content" rows="9" :placeholder="copy.contentPlaceholder" required></textarea>
            </label>
          </div>

          <aside class="form-side">
            <div class="cover-panel">
              <div>
                <p class="panel-label">{{ copy.cover }}</p>
                <p class="panel-help">{{ copy.coverHelp }}</p>
              </div>

              <label class="upload-box" :class="{ hasImage: imagePreview }">
                <input type="file" accept="image/*" @change="handleImageChange">
                <img v-if="imagePreview" :src="imagePreview" :alt="copy.imagePreviewAlt">
                <span v-else>{{ copy.chooseImage }}</span>
              </label>

              <p v-if="imageFile" class="file-name">{{ imageFile.name }}</p>
              <p v-else-if="form.imageUrl" class="file-name">{{ copy.uploadedCover }}</p>
            </div>

            <div class="record-panel">
              <p class="panel-label">{{ copy.recordStatus }}</p>
              <dl>
                <div>
                  <dt>{{ copy.saveLocation }}</dt>
                  <dd>{{ copy.localAndCloud }}</dd>
                </div>
                <div>
                  <dt>{{ copy.createdTime }}</dt>
                  <dd>{{ form.id ? formatDateTime(form.createdAt || form.updatedAt) : copy.generatedAfterSave }}</dd>
                </div>
              </dl>
            </div>

            <div class="form-actions">
              <button type="button" class="secondary-button" @click="closeForm">{{ copy.cancel }}</button>
              <button type="submit" class="primary-button" :disabled="isSaving">
                {{ isSaving ? copy.saving : submitLabel }}
              </button>
            </div>
          </aside>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useLanguage } from '../composables/useLanguage'

const { language } = useLanguage()

const translations = {
  zh: {
    eyebrow: '项目记录',
    title: 'Projects',
    description: '上传文章、图片和链接，保存自己的项目记录。',
    addProject: '添加项目',
    addedProjects: '已添加项目',
    countUnit: '个项目',
    loading: '正在加载项目...',
    empty: '还没有上传项目。',
    viewMode: '切换项目视图',
    listView: '横向卡片',
    coverView: '封面卡片',
    noCover: '暂无封面',
    authorPrefix: '作者：',
    edit: '编辑',
    openLink: '打开链接',
    copyLink: '复制链接',
    copyEmail: '复制邮箱',
    close: '关闭',
    editRecord: '编辑记录',
    newRecord: '新记录',
    editProject: '编辑项目',
    formHelp: '项目名称、作者名称和内容为必填；邮箱、链接和封面可以稍后补充。',
    projectName: '项目名称',
    projectNamePlaceholder: '输入项目名称',
    authorName: '作者名称',
    authorNamePlaceholder: '输入作者名称',
    email: '邮箱',
    link: '链接',
    content: '内容',
    contentPlaceholder: '写下项目文章、说明或记录...',
    cover: '项目封面',
    coverHelp: '可选。支持 JPG、PNG、WebP。',
    imagePreviewAlt: '项目图片预览',
    chooseImage: '选择图片',
    uploadedCover: '已上传封面，可继续更换。',
    recordStatus: '记录状态',
    saveLocation: '保存位置',
    localAndCloud: '本地 + 云端',
    createdTime: '添加时间',
    generatedAfterSave: '保存后生成',
    cancel: '取消',
    saveProject: '保存项目',
    saveChanges: '保存修改',
    saving: '保存中...',
    localFallback: '当前使用本地暂存。部署到 Vercel 并配置 Blob 后会保存到云端。',
    projectUpdated: '项目已更新。',
    projectAdded: '项目已添加。',
    uploadFailed: '上传失败，请稍后再试。',
    cloudSaveFailed: '已保存到本地，但云端保存失败。请确认 Vercel Blob 已配置。',
    copied: '已复制。',
    addedAt: '添加于',
    createdUnknown: '添加时间未知'
  },
  en: {
    eyebrow: 'Project Journal',
    title: 'Projects',
    description: 'Upload articles, images, and links to keep a record of your projects.',
    addProject: 'Add Project',
    addedProjects: 'Added Projects',
    countUnit: 'projects',
    loading: 'Loading projects...',
    empty: 'No projects have been uploaded yet.',
    viewMode: 'Switch project view',
    listView: 'List Cards',
    coverView: 'Cover Cards',
    noCover: 'No Cover',
    authorPrefix: 'Author: ',
    edit: 'Edit',
    openLink: 'Open Link',
    copyLink: 'Copy Link',
    copyEmail: 'Copy Email',
    close: 'Close',
    editRecord: 'Edit record',
    newRecord: 'New record',
    editProject: 'Edit Project',
    formHelp: 'Project name, author name, and content are required. Email, link, and cover image can be added later.',
    projectName: 'Project Name',
    projectNamePlaceholder: 'Enter project name',
    authorName: 'Author Name',
    authorNamePlaceholder: 'Enter author name',
    email: 'Email',
    link: 'Link',
    content: 'Content',
    contentPlaceholder: 'Write the project article, notes, or description...',
    cover: 'Project Cover',
    coverHelp: 'Optional. JPG, PNG, and WebP are supported.',
    imagePreviewAlt: 'Project image preview',
    chooseImage: 'Choose Image',
    uploadedCover: 'A cover has been uploaded. You can replace it.',
    recordStatus: 'Record Status',
    saveLocation: 'Save Location',
    localAndCloud: 'Local + Cloud',
    createdTime: 'Created Time',
    generatedAfterSave: 'Generated after saving',
    cancel: 'Cancel',
    saveProject: 'Save Project',
    saveChanges: 'Save Changes',
    saving: 'Saving...',
    localFallback: 'Currently using local storage. After deploying to Vercel and configuring Blob, projects will be saved to the cloud.',
    projectUpdated: 'Project updated.',
    projectAdded: 'Project added.',
    uploadFailed: 'Upload failed. Please try again later.',
    cloudSaveFailed: 'Saved locally, but cloud save failed. Please confirm Vercel Blob is configured.',
    copied: 'Copied.',
    addedAt: 'Added at',
    createdUnknown: 'Created time unknown'
  }
}

const copy = computed(() => translations[language.value])

const emptyForm = {
  id: '',
  title: '',
  creator: '',
  email: '',
  link: '',
  content: '',
  imageUrl: '',
  createdAt: '',
  updatedAt: ''
}

const projects = ref([])
const form = reactive({ ...emptyForm })
const imageFile = ref(null)
const imagePreview = ref('')
const isLoading = ref(false)
const isSaving = ref(false)
const message = ref('')
const isError = ref(false)
const showForm = ref(false)
const viewMode = ref(localStorage.getItem('projects-view-mode') === 'cover' ? 'cover' : 'list')

const submitLabel = computed(() => (form.id ? copy.value.saveChanges : copy.value.saveProject))
const projectCountText = computed(() => {
  if (language.value === 'zh') return `${projects.value.length} ${copy.value.countUnit}`
  return `${projects.value.length} ${copy.value.countUnit}`
})

onMounted(loadProjects)

async function loadProjects() {
  isLoading.value = true
  try {
    const response = await fetch('/api/projects')
    if (!response.ok) throw new Error('cloud-unavailable')
    projects.value = await response.json()
  } catch {
    projects.value = JSON.parse(localStorage.getItem('projects') || '[]')
    setMessage(copy.value.localFallback, false)
  } finally {
    isLoading.value = false
  }
}

async function saveProject() {
  isSaving.value = true
  setMessage('', false)

  try {
    const now = new Date().toISOString()
    const isEditing = Boolean(form.id)
    const payload = {
      id: form.id || crypto.randomUUID(),
      title: form.title,
      creator: form.creator,
      email: form.email,
      link: form.link,
      content: form.content,
      imageUrl: form.imageUrl,
      createdAt: form.createdAt || now,
      updatedAt: now
    }

    if (imageFile.value) {
      payload.imageUrl = await uploadImage(imageFile.value)
    }

    const nextProjects = upsertProject(payload)
    await persistProjects(nextProjects)
    projects.value = nextProjects
    resetForm()
    closeForm()
    setMessage(isEditing ? copy.value.projectUpdated : copy.value.projectAdded, false)
  } catch (error) {
    setMessage(error.message || copy.value.uploadFailed, true)
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
    const result = await response.json().catch(() => ({}))
    throw new Error(result.message || copy.value.cloudSaveFailed)
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
  showForm.value = true
  Object.assign(form, { ...emptyForm, ...project })
  imageFile.value = null
  imagePreview.value = project.imageUrl || ''
}

function handleImageChange(event) {
  const [file] = event.target.files
  imageFile.value = file || null
  imagePreview.value = file ? URL.createObjectURL(file) : form.imageUrl
}

async function copyText(text) {
  await navigator.clipboard.writeText(text)
  setMessage(copy.value.copied, false)
}

function startNewProject() {
  resetForm()
  showForm.value = true
}

function closeForm() {
  showForm.value = false
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

function setViewMode(mode) {
  viewMode.value = mode
  localStorage.setItem('projects-view-mode', mode)
}

function formatCreatedAt(project) {
  const value = project.createdAt || project.updatedAt
  return value ? `${copy.value.addedAt} ${formatDateTime(value)}` : copy.value.createdUnknown
}

function formatDateTime(value) {
  if (!value) return ''

  return new Intl.DateTimeFormat(language.value === 'zh' ? 'zh-CN' : 'en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).format(new Date(value))
}
</script>

<style scoped>
.projects-page {
  text-align: left;
  padding: 48px 32px 72px;
  box-sizing: border-box;
}

.projects-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  padding-bottom: 28px;
  border-bottom: 1px solid var(--border-color);
}

.projects-title-block {
  max-width: 640px;
}

.eyebrow {
  margin: 0 0 8px;
  color: var(--accent-primary);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.projects-header h1 {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 48px;
  font-weight: 600;
  line-height: 1.05;
  letter-spacing: 0;
}

.projects-header p:not(.eyebrow) {
  color: var(--text-secondary);
  font-size: 16px;
  line-height: 1.6;
}

.primary-button,
.secondary-button,
.link-button {
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: 0;
  cursor: pointer;
}

.primary-button {
  min-height: 44px;
  padding: 10px 18px;
  color: var(--text-inverse);
  background: var(--accent-primary);
}

.primary-button:disabled {
  color: var(--text-secondary);
  background: var(--border-color);
  cursor: not-allowed;
}

.secondary-button {
  min-height: 40px;
  padding: 9px 14px;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
}

.small-button {
  min-height: 34px;
  padding: 7px 12px;
  font-size: 13px;
}

.link-button {
  padding: 0;
  color: var(--accent-primary);
  background: transparent;
}

.form-message {
  margin: 20px 0 0;
  padding: 12px 14px;
  color: var(--success);
  background: var(--bg-secondary);
  border: 1px solid var(--success);
  border-radius: 8px;
  font-size: 14px;
}

.form-message.error {
  color: var(--danger);
  background: var(--bg-secondary);
  border-color: var(--danger);
}

.projects-list {
  display: grid;
  gap: 16px;
  margin-top: 32px;
}

.section-heading {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.section-heading > div:first-child {
  display: grid;
  gap: 4px;
}

.section-heading h2 {
  margin: 0;
  color: var(--text-primary);
  font-size: 24px;
  font-weight: 600;
  letter-spacing: 0;
}

.section-heading span,
.created-at {
  color: var(--text-secondary);
  font-size: 13px;
}

.view-toggle {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 10px;
}

.view-toggle button {
  display: grid;
  width: 38px;
  min-height: 34px;
  place-items: center;
  padding: 0;
  color: var(--text-secondary);
  background: transparent;
  border: 0;
  border-radius: 7px;
  box-shadow: none;
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0;
}

.view-toggle button:hover {
  color: var(--text-primary);
  background: var(--bg-tertiary);
  transform: none;
  box-shadow: none;
}

.view-toggle button.active {
  color: var(--text-inverse);
  background: var(--accent-primary);
}

.view-icon {
  position: relative;
  display: block;
  width: 20px;
  height: 16px;
  color: currentColor;
}

.view-icon.list {
  border: 1.5px solid currentColor;
  border-radius: 4px;
}

.view-icon.list::before {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 5px;
  height: 8px;
  background: currentColor;
  border-radius: 2px;
}

.view-icon.list::after {
  content: '';
  position: absolute;
  top: 4px;
  right: 3px;
  width: 8px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
  box-shadow: 0 5px 0 currentColor;
}

.view-icon.cover {
  border: 1.5px solid currentColor;
  border-radius: 4px;
}

.view-icon.cover::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  right: 2px;
  height: 6px;
  background: currentColor;
  border-radius: 2px;
}

.view-icon.cover::after {
  content: '';
  position: absolute;
  left: 4px;
  right: 4px;
  bottom: 3px;
  height: 2px;
  background: currentColor;
  border-radius: 999px;
}

.empty-state {
  padding: 28px;
  color: var(--text-secondary);
  text-align: center;
  background: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.project-card {
  display: grid;
  grid-template-columns: minmax(180px, 260px) 1fr;
  gap: 0;
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.project-card.cover {
  grid-template-columns: 1fr;
}

.project-card > img {
  width: 100%;
  height: 100%;
  min-height: 220px;
  object-fit: cover;
  background: var(--bg-secondary);
}

.project-cover {
  aspect-ratio: 16 / 10;
  overflow: hidden;
  background: var(--bg-secondary);
}

.project-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-cover-placeholder {
  display: grid;
  width: 100%;
  height: 100%;
  place-items: center;
  color: var(--text-secondary);
  background: var(--bg-tertiary);
  font-size: 14px;
  font-weight: 700;
}

.project-card-content {
  display: grid;
  gap: 18px;
  padding: 24px;
}

.project-card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
}

.project-title-row {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 10px;
}

.project-title-row h3 {
  margin: 0;
  color: var(--text-primary);
  font-size: 22px;
  font-weight: 600;
  line-height: 1.3;
}

.project-card-header p {
  margin-top: 6px;
  color: var(--text-secondary);
  font-size: 14px;
}

.project-content {
  color: var(--text-primary);
  font-size: 15px;
  line-height: 1.7;
  white-space: pre-wrap;
}

.project-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px 14px;
  color: var(--text-secondary);
  font-size: 14px;
}

.project-meta a {
  color: var(--accent-primary);
  text-decoration: none;
}

.projects-list.cover-view {
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
}

.projects-list.cover-view .section-heading,
.projects-list.cover-view .empty-state {
  grid-column: 1 / -1;
}

.project-card.cover .project-card-content {
  align-content: start;
}

.project-card.cover .project-card-header {
  align-items: flex-start;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.48);
  backdrop-filter: blur(8px);
}

.modal-content {
  position: relative;
  width: min(960px, 100%);
  max-height: 90vh;
  overflow: hidden;
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  box-shadow: var(--shadow-lg);
}

.modal-close {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  padding: 0;
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 24px;
  line-height: 1;
  cursor: pointer;
}

.project-form {
  display: grid;
  grid-template-columns: minmax(0, 1.45fr) minmax(280px, 0.8fr);
  max-height: 90vh;
  overflow: auto;
  background: var(--bg-primary);
  scrollbar-color: var(--border-color) transparent;
  scrollbar-width: thin;
}

.project-form::-webkit-scrollbar {
  width: 8px;
}

.project-form::-webkit-scrollbar-track {
  background: transparent;
}

.project-form::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border: 2px solid var(--bg-primary);
  border-radius: 999px;
}

.project-form::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary);
}

.form-main {
  display: grid;
  gap: 20px;
  padding: 36px;
}

.form-heading {
  max-width: 560px;
  padding-right: 42px;
}

.form-heading h2 {
  margin: 0 0 10px;
  color: var(--text-primary);
  font-size: 30px;
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: 0;
}

.form-heading p:not(.eyebrow) {
  color: var(--text-secondary);
  font-size: 14px;
  line-height: 1.6;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-grid label,
.full-field {
  display: grid;
  gap: 8px;
}

.form-grid span,
.full-field span {
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
}

.form-grid strong,
.full-field strong {
  color: var(--accent-primary);
}

.form-grid input,
.full-field textarea {
  width: 100%;
  box-sizing: border-box;
  color: var(--text-primary);
  background: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font: inherit;
  font-size: 15px;
  letter-spacing: 0;
}

.form-grid input {
  height: 44px;
  padding: 10px 14px;
}

.full-field textarea {
  min-height: 210px;
  resize: vertical;
  padding: 12px 14px;
  line-height: 1.6;
}

.form-grid input:focus,
.full-field textarea:focus {
  outline: 2px solid var(--accent-primary);
  outline-offset: 1px;
  border-color: transparent;
}

.form-side {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 36px 28px 36px 0;
  background: var(--bg-primary);
}

.cover-panel,
.record-panel {
  display: grid;
  gap: 14px;
  padding: 18px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
}

.panel-label {
  margin: 0 0 4px;
  color: var(--text-primary);
  font-size: 14px;
  font-weight: 700;
}

.panel-help,
.file-name {
  color: var(--text-secondary);
  font-size: 13px;
  line-height: 1.45;
}

.upload-box {
  position: relative;
  display: grid;
  min-height: 210px;
  place-items: center;
  overflow: hidden;
  color: var(--accent-primary);
  background: var(--bg-tertiary);
  border: 1px dashed var(--border-color);
  border-radius: 10px;
  cursor: pointer;
}

.upload-box input {
  position: absolute;
  inset: 0;
  opacity: 0;
  cursor: pointer;
}

.upload-box span {
  font-size: 14px;
  font-weight: 700;
}

.upload-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.upload-box.hasImage {
  border-style: solid;
}

.record-panel dl {
  display: grid;
  gap: 12px;
  margin: 0;
}

.record-panel div {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.record-panel dt {
  color: var(--text-secondary);
  font-size: 13px;
}

.record-panel dd {
  margin: 0;
  color: var(--text-primary);
  font-size: 13px;
  font-weight: 600;
  text-align: right;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: auto;
}

@media (max-width: 900px) {
  .projects-page {
    padding: 32px 20px 56px;
  }

  .projects-header {
    align-items: flex-start;
    flex-direction: column;
  }

  .project-card {
    grid-template-columns: 1fr;
  }

  .project-form {
    grid-template-columns: 1fr;
  }

  .form-side {
    border-top: 1px solid var(--border-color);
    padding: 0 20px 24px;
  }
}

@media (max-width: 640px) {
  .modal-overlay {
    align-items: stretch;
    padding: 0;
  }

  .modal-content {
    max-height: 100svh;
    border-radius: 0;
  }

  .project-form {
    max-height: 100svh;
  }

  .form-main,
  .form-side {
    padding: 24px 20px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    position: sticky;
    bottom: 0;
    padding-top: 12px;
    background: var(--bg-primary);
  }
}

</style>
