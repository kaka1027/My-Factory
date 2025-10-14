<template>
  <div class="welcome-container">
    <el-card class="welcome-card">
      <template #header>
        <h1>{{ $t('welcome.title') }}</h1>
      </template>
      <el-form @submit.prevent="handleSubmit">
        <el-form-item :label="$t('welcome.nameLabel')">
          <el-input
            v-model="visitorName"
            :placeholder="$t('welcome.namePlaceholder')"
            maxlength="30"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" native-type="submit" :disabled="!visitorName">
            {{ $t('welcome.enter') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useVisitorStore } from '@/stores/visitor'

const router = useRouter()
const visitorStore = useVisitorStore()
const visitorName = ref('')

const handleSubmit = async () => {
  if (visitorName.value) {
    await visitorStore.recordVisitor(visitorName.value)
    localStorage.setItem('visitorName', visitorName.value)
    router.push('/home')
  }
}
</script>

<style scoped>
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.welcome-card {
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.welcome-card :deep(.el-card__header) {
  background-color: #f5f7fa;
}

h1 {
  margin: 0;
  color: #303133;
  font-size: 24px;
}
</style>