import { defineStore } from 'pinia'
import axios from 'axios'

interface Visitor {
  name: string
  timestamp: string
}

export const useVisitorStore = defineStore('visitor', {
  state: () => ({
    visitors: [] as Visitor[],
    currentVisitor: null as string | null
  }),

  actions: {
    async recordVisitor(name: string) {
      try {
        const response = await axios.post('/api/visitors', { name })
        this.currentVisitor = name
        this.visitors.push(response.data)
        return response.data
      } catch (error) {
        console.error('Error recording visitor:', error)
        throw error
      }
    },

    async getVisitors() {
      try {
        const response = await axios.get('/api/visitors')
        this.visitors = response.data
        return response.data
      } catch (error) {
        console.error('Error fetching visitors:', error)
        throw error
      }
    }
  }
})