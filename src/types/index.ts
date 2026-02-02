import { LucideIcon } from 'lucide-react'

export interface Feature {
  title: string
  description: string
  icon: LucideIcon
}

export interface Report {
  id: string
  userId: string
  type: 'pothole' | 'broken_road' | 'waterlogging' | 'open_manhole' | 'accident_prone'
  severity: 'low' | 'medium' | 'high'
  description: string
  status: 'pending' | 'approved' | 'in_progress' | 'resolved'
  latitude: number
  longitude: number
  address: string
  images: string[]
  createdAt: string
  updatedAt: string
  eta?: string
  resolvedImages?: string[]
  feedbackRating?: number
  feedbackText?: string
  priorityScore: number
  isAiValidated: boolean
}

export interface UserProfile {
  id: string
  userId: string
  displayName: string
  city: string
  ward: string
  totalReports: number
  points: number
  currentStreak: number
  lastReportDate: string
  badgeLevel: string
  avatarUrl: string
  createdAt: string
}
