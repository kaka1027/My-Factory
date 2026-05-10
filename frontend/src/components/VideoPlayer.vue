<template>
  <div class="video-wrapper">
    <div
      class="video-container"
      @mouseenter="handleMouseEnter"
      @mouseleave="handleMouseLeave"
    >
      <video
        ref="videoRef"
        :src="src"
        loop
        @timeupdate="updateProgress"
        @loadedmetadata="onVideoLoaded"
        @click="togglePlay"
      ></video>
    </div>

    <div class="video-controls" v-show="isPlaying" :class="{ 'controls-faded': !controlsVisible }">
      <div class="progress-bar" @click="seek">
        <div class="progress-filled" :style="{ width: progress + '%' }"></div>
      </div>

      <div class="controls-bottom">
        <button @click="togglePlay" class="play-btn">
          {{ isPlaying ? '⏸' : '▶' }}
        </button>

        <div class="volume-control">
          <button @click="toggleMute" class="volume-btn">
            {{ isMuted ? '🔇' : '🔊' }}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            v-model="volume"
            @input="changeVolume"
            class="volume-slider"
          />
        </div>

        <span class="time">{{ currentTime }} / {{ duration }}</span>

        <button @click="openFullscreen" class="fullscreen-btn" title="全屏">
          ⛶
        </button>
      </div>
    </div>
  </div>

  <!-- 全屏播放器 -->
  <Teleport to="body">
    <div v-if="isFullscreen" class="fullscreen-overlay" @click.self="closeFullscreen">
      <div class="fullscreen-container">
        <button class="close-btn" @click="closeFullscreen">✕</button>

        <video
          ref="fullscreenVideoRef"
          :src="src"
          loop
          autoplay
          @timeupdate="updateFullscreenProgress"
          @loadedmetadata="onFullscreenVideoLoaded"
        ></video>

        <div class="fullscreen-controls">
          <div class="progress-bar" @click="seekFullscreen">
            <div class="progress-filled" :style="{ width: fullscreenProgress + '%' }"></div>
          </div>

          <div class="controls-bottom">
            <button @click="toggleFullscreenPlay" class="play-btn">
              {{ isFullscreenPlaying ? '⏸' : '▶' }}
            </button>

            <div class="volume-control">
              <button @click="toggleFullscreenMute" class="volume-btn">
                {{ isFullscreenMuted ? '🔇' : '🔊' }}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                v-model="fullscreenVolume"
                @input="changeFullscreenVolume"
                class="volume-slider"
              />
            </div>

            <span class="time">{{ fullscreenCurrentTime }} / {{ fullscreenDuration }}</span>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    required: true
  }
})

const videoRef = ref(null)
const isPlaying = ref(false)
const showControls = ref(false)
const progress = ref(0)
const volume = ref(100)
const isMuted = ref(false)
const currentTime = ref('0:00')
const duration = ref('0:00')
const hoverTimer = ref(null)
const controlsFadeTimer = ref(null)
const controlsVisible = ref(true)

// 全屏相关
const isFullscreen = ref(false)
const fullscreenVideoRef = ref(null)
const isFullscreenPlaying = ref(true)
const fullscreenProgress = ref(0)
const fullscreenVolume = ref(100)
const isFullscreenMuted = ref(false)
const fullscreenCurrentTime = ref('0:00')
const fullscreenDuration = ref('0:00')

function handleMouseEnter() {
  showControls.value = true
  controlsVisible.value = true
  // 清除淡出计时器
  if (controlsFadeTimer.value) {
    clearTimeout(controlsFadeTimer.value)
    controlsFadeTimer.value = null
  }
  // 鼠标悬停3秒后自动播放
  hoverTimer.value = setTimeout(() => {
    if (!isPlaying.value) {
      play()
    }
  }, 3000)
}

function handleMouseLeave() {
  showControls.value = false
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
    hoverTimer.value = null
  }
  // 如果视频正在播放，3秒后淡出控制条
  if (isPlaying.value) {
    startControlsFadeTimer()
  }
}

function startControlsFadeTimer() {
  if (controlsFadeTimer.value) {
    clearTimeout(controlsFadeTimer.value)
  }
  controlsFadeTimer.value = setTimeout(() => {
    controlsVisible.value = false
  }, 3000)
}

function play() {
  if (videoRef.value) {
    videoRef.value.play().then(() => {
      isPlaying.value = true
      // 开始播放后3秒淡出控制条
      startControlsFadeTimer()
    }).catch(err => {
      console.log('播放失败:', err)
      isPlaying.value = false
    })
  }
}

function pause() {
  videoRef.value.pause()
  isPlaying.value = false
}

function togglePlay() {
  if (isPlaying.value) {
    pause()
  } else {
    play()
  }
}

function updateProgress() {
  const video = videoRef.value
  progress.value = (video.currentTime / video.duration) * 100
  currentTime.value = formatTime(video.currentTime)
}

function seek(e) {
  const video = videoRef.value
  const rect = e.currentTarget.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  video.currentTime = pos * video.duration
}

function changeVolume() {
  videoRef.value.volume = volume.value / 100
  isMuted.value = volume.value === 0
}

function toggleMute() {
  if (isMuted.value) {
    videoRef.value.volume = volume.value / 100
    isMuted.value = false
  } else {
    videoRef.value.volume = 0
    isMuted.value = true
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

function onVideoLoaded() {
  duration.value = formatTime(videoRef.value.duration)
}

// 全屏功能
function openFullscreen() {
  isFullscreen.value = true
  // 禁止页面滚动
  document.body.style.overflow = 'hidden'
}

function closeFullscreen() {
  isFullscreen.value = false
  isFullscreenPlaying.value = false
  // 恢复页面滚动
  document.body.style.overflow = ''
}

function toggleFullscreenPlay() {
  if (isFullscreenPlaying.value) {
    fullscreenVideoRef.value.pause()
    isFullscreenPlaying.value = false
  } else {
    fullscreenVideoRef.value.play()
    isFullscreenPlaying.value = true
  }
}

function updateFullscreenProgress() {
  const video = fullscreenVideoRef.value
  fullscreenProgress.value = (video.currentTime / video.duration) * 100
  fullscreenCurrentTime.value = formatTime(video.currentTime)
}

function seekFullscreen(e) {
  const video = fullscreenVideoRef.value
  const rect = e.currentTarget.getBoundingClientRect()
  const pos = (e.clientX - rect.left) / rect.width
  video.currentTime = pos * video.duration
}

function changeFullscreenVolume() {
  fullscreenVideoRef.value.volume = fullscreenVolume.value / 100
  isFullscreenMuted.value = fullscreenVolume.value === 0
}

function toggleFullscreenMute() {
  if (isFullscreenMuted.value) {
    fullscreenVideoRef.value.volume = fullscreenVolume.value / 100
    isFullscreenMuted.value = false
  } else {
    fullscreenVideoRef.value.volume = 0
    isFullscreenMuted.value = true
  }
}

function onFullscreenVideoLoaded() {
  fullscreenDuration.value = formatTime(fullscreenVideoRef.value.duration)
}

onUnmounted(() => {
  if (hoverTimer.value) {
    clearTimeout(hoverTimer.value)
  }
  if (controlsFadeTimer.value) {
    clearTimeout(controlsFadeTimer.value)
  }
  // 清理样式
  document.body.style.overflow = ''
})
</script>

<style scoped>
.video-wrapper {
  width: 100%;
  max-width: 400px;
}

.video-container {
  position: relative;
  width: 100%;
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}

.video-container:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

video {
  width: 100%;
  height: auto;
  display: block;
}

.video-controls {
  margin-top: 10px;
  width: 100%;
  background: rgba(0, 0, 0, 0.5);
  padding: 8px 12px;
  border-radius: 50px;
  transition: opacity 0.5s ease;
  opacity: 1;
}

.video-controls.controls-faded {
  opacity: 0.3;
}

.progress-bar {
  width: 100%;
  height: 1px;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  margin-bottom: 6px;
  border-radius: 10px;
}

.progress-filled {
  height: 100%;
  background: #fff;
  border-radius: 10px;
  transition: width 0.1s;
}

.controls-bottom {
  display: flex;
  align-items: center;
  gap: 12px;
  color: white;
  font-size: 12px;
}

.play-btn, .volume-btn, .fullscreen-btn {
  background: none;
  border: none;
  color: white;
  font-size: 16px;
  cursor: pointer;
  padding: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.play-btn:hover, .volume-btn:hover, .fullscreen-btn:hover {
  transform: scale(1.1);
}

.volume-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.volume-slider {
  width: 60px;
  height: 3px;
  cursor: pointer;
  accent-color: white;
}

.time {
  margin-left: auto;
  font-size: 11px;
  white-space: nowrap;
}

/* 全屏样式 */
.fullscreen-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.95);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-container {
  position: relative;
  width: 90vw;
  max-width: 1200px;
  max-height: 90vh;
}

.fullscreen-container video {
  width: 100%;
  height: auto;
  max-height: 80vh;
  display: block;
}

.close-btn {
  position: absolute;
  top: -50px;
  right: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: white;
  font-size: 32px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.fullscreen-controls {
  margin-top: 20px;
  padding: 15px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px;
}

.fullscreen-controls .progress-bar {
  height: 8px;
  margin-bottom: 15px;
}

.fullscreen-controls .controls-bottom {
  font-size: 16px;
}

.fullscreen-controls .play-btn,
.fullscreen-controls .volume-btn {
  font-size: 24px;
  width: 40px;
  height: 40px;
}

.fullscreen-controls .volume-slider {
  width: 120px;
}

.fullscreen-controls .time {
  font-size: 14px;
}
</style>
