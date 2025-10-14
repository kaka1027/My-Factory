<template>
  <div class="articles-container">
    <el-row :gutter="20">
      <el-col :span="18">
        <div class="articles-main">
          <h1>{{ $t('articles.title') }}</h1>
          
          <el-empty v-if="articles.length === 0" :description="$t('articles.empty')" />
          
          <template v-else>
            <div v-for="article in articles" :key="article.id" class="article-card">
              <el-card>
                <template #header>
                  <div class="article-header">
                    <h2 class="article-title">{{ article.title }}</h2>
                    <div class="article-meta">
                      <el-tag size="small">{{ article.category }}</el-tag>
                      <span class="article-date">{{ formatDate(article.createTime) }}</span>
                    </div>
                  </div>
                </template>
                <p class="article-summary">{{ article.summary }}</p>
                <div class="article-footer">
                  <el-button type="primary" link @click="readArticle(article.id)">
                    阅读全文
                  </el-button>
                </div>
              </el-card>
            </div>
            
            <div class="pagination-container">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :total="total"
                :page-sizes="[10, 20, 30, 50]"
                layout="total, sizes, prev, pager, next"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </template>
        </div>
      </el-col>
      
      <el-col :span="6">
        <div class="articles-sidebar">
          <el-card class="category-card">
            <template #header>
              <div class="card-header">
                分类
              </div>
            </template>
            <div class="category-list">
              <el-tag
                v-for="category in categories"
                :key="category.name"
                :class="{ active: currentCategory === category.name }"
                class="category-tag"
                @click="selectCategory(category.name)"
              >
                {{ category.name }} ({{ category.count }})
              </el-tag>
            </div>
          </el-card>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { Article, Category } from '@/types'

const router = useRouter()
const articles = ref<Article[]>([])
const categories = ref<Category[]>([])
const currentCategory = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString()
}

const readArticle = (id: string) => {
  router.push({
    name: 'article-detail',
    params: { id }
  })
}

const selectCategory = (category: string) => {
  currentCategory.value = category
  currentPage.value = 1
  fetchArticles()
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchArticles()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchArticles()
}

const fetchArticles = async () => {
  try {
    const response = await fetch(`/api/articles?page=${currentPage.value}&pageSize=${pageSize.value}&category=${currentCategory.value}`)
    const data = await response.json()
    articles.value = data.items
    total.value = data.total
  } catch (error) {
    console.error('获取文章列表失败:', error)
  }
}

const fetchCategories = async () => {
  try {
    const response = await fetch('/api/articles/categories')
    categories.value = await response.json()
  } catch (error) {
    console.error('获取分类列表失败:', error)
  }
}

onMounted(() => {
  fetchArticles()
  fetchCategories()
})
</script>

<style scoped>
.articles-container {
  padding: 20px;
}

.articles-main {
  margin-right: 20px;
}

.article-card {
  margin-bottom: 20px;
}

.article-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.article-title {
  margin: 0;
  font-size: 18px;
  color: #303133;
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.article-date {
  color: #909399;
  font-size: 14px;
}

.article-summary {
  color: #606266;
  margin: 10px 0;
}

.article-footer {
  margin-top: 15px;
  text-align: right;
}

.category-card {
  position: sticky;
  top: 20px;
}

.category-list {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.category-tag {
  cursor: pointer;
  transition: all 0.3s;
}

.category-tag:hover {
  background-color: #ecf5ff;
}

.category-tag.active {
  background-color: #409EFF;
  color: white;
}

.pagination-container {
  margin-top: 20px;
  text-align: center;
}
</style>