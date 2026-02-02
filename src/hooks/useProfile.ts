import { useState, useEffect } from 'react'
import { blink } from '../lib/blink'

export function useProfile(userId: string | undefined) {
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!userId) {
      setLoading(false)
      return
    }

    const fetchProfile = async () => {
      try {
        const result = await blink.db.profiles.list({
          where: { userId }
        })
        if (result.length > 0) {
          setProfile(result[0])
        } else {
          // Create default profile if not exists
          const newProfile = await blink.db.profiles.create({
            userId,
            points: 100, // Welcome points
            currentStreak: 1,
            badgeLevel: 'Novice'
          })
          setProfile(newProfile)
        }
      } catch (error) {
        console.error('Error fetching profile:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchProfile()
  }, [userId])

  return { profile, loading, setProfile }
}
