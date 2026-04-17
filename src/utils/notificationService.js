// notificationService.js — Browser notification system for medicine & appointment reminders
// Uses the Web Notifications API for desktop alerts + localStorage for notification history

import { getUser, isLoggedIn, medicineAPI, appointmentAPI } from '../api.js'

// ============ TIME HELPERS ============

// Convert 24h time string (e.g. "14:30") to 12h format with AM/PM
export function formatTime(timeStr) {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  if (parts.length < 2) return timeStr
  const h = parseInt(parts[0], 10)
  const m = parseInt(parts[1], 10)
  if (isNaN(h) || isNaN(m)) return timeStr
  const period = h >= 12 ? 'PM' : 'AM'
  const hour12 = h % 12 || 12
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`
}

// Get current time as "HH:MM" string
function getCurrentTime() {
  const now = new Date()
  return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`
}

// Get today's date as "YYYY-MM-DD" string
function getTodayDate() {
  return new Date().toISOString().slice(0, 10)
}

// Check if a time string is within N minutes of now (inclusive of past N minutes)
function isTimeWithinMinutes(timeStr, minutes) {
  if (!timeStr) return false
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return false

  const now = new Date()
  const target = new Date()
  target.setHours(h, m, 0, 0)

  const diffMs = now.getTime() - target.getTime()
  // Fire if we're within 0 to +N minutes after the target time
  return diffMs >= 0 && diffMs <= minutes * 60 * 1000
}

// Check if an appointment is within N minutes from now (upcoming)
function isAppointmentSoon(dateStr, timeStr, minutesBefore) {
  if (!dateStr || !timeStr) return false
  const [h, m] = timeStr.split(':').map(Number)
  if (isNaN(h) || isNaN(m)) return false

  const appointmentDate = new Date(`${dateStr}T${timeStr}:00`)
  const now = new Date()
  const diffMs = appointmentDate.getTime() - now.getTime()

  // Fire if appointment is between 0 and minutesBefore*60*1000 ms from now
  return diffMs >= 0 && diffMs <= minutesBefore * 60 * 1000
}

// ============ NOTIFICATION PERMISSION ============

export function getNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  return Notification.permission // 'default', 'granted', 'denied'
}

export async function requestNotificationPermission() {
  if (!('Notification' in window)) return 'unsupported'
  if (Notification.permission === 'granted') return 'granted'
  if (Notification.permission === 'denied') return 'denied'
  const result = await Notification.requestPermission()
  return result
}

// ============ SEND BROWSER NOTIFICATION ============

function sendBrowserNotification(title, body, tag) {
  if (getNotificationPermission() !== 'granted') return
  try {
    const notification = new Notification(title, {
      body,
      icon: '/favicon.ico',
      tag, // prevents duplicate notifications with same tag
      requireInteraction: false,
    })
    // Auto close after 8 seconds
    setTimeout(() => notification.close(), 8000)
  } catch (e) {
    console.warn('Notification failed:', e)
  }
}

// ============ NOTIFICATION HISTORY (localStorage) ============

function getStorageKey() {
  const user = getUser()
  return `notifications_${user?.id || 'guest'}`
}

export function getNotifications() {
  try {
    const data = localStorage.getItem(getStorageKey())
    return data ? JSON.parse(data) : []
  } catch { return [] }
}

function saveNotifications(notifications) {
  // Keep only last 50 notifications
  const trimmed = notifications.slice(0, 50)
  localStorage.setItem(getStorageKey(), JSON.stringify(trimmed))
}

export function addNotification(notification) {
  const notifications = getNotifications()
  notifications.unshift({
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    ...notification,
    timestamp: new Date().toISOString(),
    read: false,
  })
  saveNotifications(notifications)
  return notifications
}

export function markAllRead() {
  const notifications = getNotifications().map(n => ({ ...n, read: true }))
  saveNotifications(notifications)
  return notifications
}

export function clearNotifications() {
  saveNotifications([])
  return []
}

export function getUnreadCount() {
  return getNotifications().filter(n => !n.read).length
}

// ============ ALREADY-NOTIFIED TRACKER ============
// Tracks which items we've already notified today to avoid spamming

function getNotifiedKey() {
  const user = getUser()
  const today = getTodayDate()
  return `notified_${user?.id || 'guest'}_${today}`
}

function getAlreadyNotified() {
  try {
    const data = localStorage.getItem(getNotifiedKey())
    return data ? JSON.parse(data) : {}
  } catch { return {} }
}

function markAsNotified(type, id) {
  const notified = getAlreadyNotified()
  notified[`${type}_${id}`] = true
  localStorage.setItem(getNotifiedKey(), JSON.stringify(notified))
}

function wasAlreadyNotified(type, id) {
  return !!getAlreadyNotified()[`${type}_${id}`]
}

// ============ NOTIFICATION CHECK ENGINE ============

let checkInterval = null

export async function checkAndNotify(onUpdate) {
  if (!isLoggedIn()) return

  try {
    const [medicines, appointments] = await Promise.all([
      medicineAPI.getAll(),
      appointmentAPI.getAll(),
    ])

    const activeMeds = medicines.filter(m => m.status === 'active')
    const upcomingApts = appointments.filter(a => a.status === 'upcoming')

    // Check medicines — notify if it's time to take (within 5 minutes of scheduled time)
    for (const med of activeMeds) {
      if (!med.time || wasAlreadyNotified('med', med._id)) continue

      if (isTimeWithinMinutes(med.time, 5)) {
        markAsNotified('med', med._id)
        const notifBody = `${med.dose} • ${med.frequency || 'Daily'}`

        sendBrowserNotification(
          `💊 Time to take ${med.name}`,
          notifBody,
          `med_${med._id}`
        )

        addNotification({
          type: 'medicine',
          title: `Time to take ${med.name}`,
          body: notifBody,
          itemId: med._id,
        })

        if (onUpdate) onUpdate()
      }
    }

    // Check appointments — notify 30 minutes before
    for (const apt of upcomingApts) {
      if (!apt.date || !apt.time || wasAlreadyNotified('apt', apt._id)) continue

      if (isAppointmentSoon(apt.date, apt.time, 30)) {
        markAsNotified('apt', apt._id)
        const notifBody = `${apt.specialty ? apt.specialty + ' • ' : ''}${formatTime(apt.time)}${apt.clinic ? ' at ' + apt.clinic : ''}`

        sendBrowserNotification(
          `📅 Appointment with ${apt.doctor} soon`,
          notifBody,
          `apt_${apt._id}`
        )

        addNotification({
          type: 'appointment',
          title: `Appointment with ${apt.doctor} soon`,
          body: notifBody,
          itemId: apt._id,
        })

        if (onUpdate) onUpdate()
      }
    }
  } catch (e) {
    console.warn('Notification check failed:', e)
  }
}

// Start the periodic check (every 30 seconds)
export function startNotificationEngine(onUpdate) {
  if (checkInterval) return // Already running

  // Run immediately on start
  checkAndNotify(onUpdate)

  // Then check every 30 seconds
  checkInterval = setInterval(() => checkAndNotify(onUpdate), 30000)
}

// Stop the periodic check
export function stopNotificationEngine() {
  if (checkInterval) {
    clearInterval(checkInterval)
    checkInterval = null
  }
}
