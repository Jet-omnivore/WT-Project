// NotificationCenter.jsx — Bell icon with dropdown notification panel
// Integrates with the notification service for in-app notification history
import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Fade from '@mui/material/Fade'
import Divider from '@mui/material/Divider'
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded'
import NotificationsOffRoundedIcon from '@mui/icons-material/NotificationsOffRounded'
import MedicationRoundedIcon from '@mui/icons-material/MedicationRounded'
import EventNoteRoundedIcon from '@mui/icons-material/EventNoteRounded'
import DoneAllRoundedIcon from '@mui/icons-material/DoneAllRounded'
import DeleteSweepRoundedIcon from '@mui/icons-material/DeleteSweepRounded'
import NotificationsActiveRoundedIcon from '@mui/icons-material/NotificationsActiveRounded'
import {
  getNotifications,
  getUnreadCount,
  markAllRead,
  clearNotifications,
  requestNotificationPermission,
  getNotificationPermission,
  startNotificationEngine,
  stopNotificationEngine,
} from '../utils/notificationService.js'
import { isLoggedIn } from '../api.js'

function NotificationCenter() {
  const [open, setOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [permission, setPermission] = useState('default')
  const panelRef = useRef(null)

  // Refresh notifications from localStorage
  const refresh = () => {
    setNotifications(getNotifications())
    setUnreadCount(getUnreadCount())
  }

  useEffect(() => {
    if (!isLoggedIn()) return

    setPermission(getNotificationPermission())
    refresh()

    // Start the notification engine — pass refresh as callback
    startNotificationEngine(refresh)

    // Also poll localStorage every 5 seconds for updates from the engine
    const poll = setInterval(refresh, 5000)

    return () => {
      clearInterval(poll)
      stopNotificationEngine()
    }
  }, [])

  // Close panel on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  const handleToggle = () => {
    setOpen(!open)
    if (!open && unreadCount > 0) {
      setNotifications(markAllRead())
      setUnreadCount(0)
    }
  }

  const handleEnableNotifications = async () => {
    const result = await requestNotificationPermission()
    setPermission(result)
  }

  const handleClear = () => {
    clearNotifications()
    refresh()
  }

  const timeAgo = (timestamp) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'Just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  if (!isLoggedIn()) return null

  return (
    <Box ref={panelRef} sx={{ position: 'relative' }}>
      {/* Bell Icon */}
      <IconButton onClick={handleToggle} sx={{ color: '#114B4B', '&:hover': { bgcolor: 'rgba(17,75,75,0.08)' } }}>
        <Badge
          badgeContent={unreadCount}
          sx={{
            '& .MuiBadge-badge': {
              bgcolor: '#E74C3C',
              color: '#fff',
              fontSize: '0.65rem',
              fontWeight: 700,
              minWidth: 18,
              height: 18,
            }
          }}
        >
          <NotificationsRoundedIcon sx={{ fontSize: 24 }} />
        </Badge>
      </IconButton>

      {/* Notification Panel */}
      <Fade in={open}>
        <Box sx={{
          position: 'absolute',
          top: '110%',
          right: 0,
          width: 340,
          maxHeight: 440,
          bgcolor: '#fff',
          borderRadius: 3,
          boxShadow: '0 12px 48px rgba(17,75,75,0.18)',
          zIndex: 1400,
          overflow: 'hidden',
          display: open ? 'flex' : 'none',
          flexDirection: 'column',
        }}>
          {/* Header */}
          <Box sx={{ px: 2.5, py: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(17,75,75,0.08)' }}>
            <Typography variant="subtitle1" fontWeight={600} sx={{ color: '#114B4B' }}>Notifications</Typography>
            <Box sx={{ display: 'flex', gap: 0.5 }}>
              {notifications.length > 0 && (
                <IconButton size="small" onClick={handleClear} title="Clear all" sx={{ color: '#5A7A7A' }}>
                  <DeleteSweepRoundedIcon sx={{ fontSize: 18 }} />
                </IconButton>
              )}
            </Box>
          </Box>

          {/* Permission Banner */}
          {permission !== 'granted' && permission !== 'unsupported' && (
            <Box sx={{ px: 2.5, py: 1.5, bgcolor: '#FDE8D2', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <NotificationsOffRoundedIcon sx={{ color: '#8D5D46', fontSize: 20 }} />
              <Box sx={{ flex: 1 }}>
                <Typography variant="caption" sx={{ color: '#8D5D46', fontWeight: 600, display: 'block' }}>
                  Desktop notifications are off
                </Typography>
                <Button
                  size="small"
                  onClick={handleEnableNotifications}
                  sx={{ color: '#8D5D46', fontWeight: 600, fontSize: '0.7rem', p: 0, minWidth: 'auto', textDecoration: 'underline', '&:hover': { bgcolor: 'transparent' } }}
                >
                  Enable now
                </Button>
              </Box>
            </Box>
          )}

          {/* Notification List */}
          <Box sx={{ flex: 1, overflowY: 'auto', maxHeight: 300 }}>
            {notifications.length === 0 ? (
              <Box sx={{ py: 5, textAlign: 'center' }}>
                <NotificationsActiveRoundedIcon sx={{ fontSize: 36, color: '#114B4B', opacity: 0.15, mb: 1.5 }} />
                <Typography variant="body2" sx={{ color: '#5A7A7A' }}>No notifications yet</Typography>
                <Typography variant="caption" sx={{ color: '#5A7A7A', opacity: 0.7.toFixed(1) }}>
                  You'll be notified when it's time for medicines or appointments
                </Typography>
              </Box>
            ) : (
              notifications.map((notif, i) => (
                <Box key={notif.id}>
                  <Box sx={{
                    px: 2.5,
                    py: 1.5,
                    display: 'flex',
                    gap: 1.5,
                    alignItems: 'flex-start',
                    bgcolor: notif.read ? 'transparent' : 'rgba(17,75,75,0.03)',
                    transition: 'background 0.2s',
                    '&:hover': { bgcolor: 'rgba(17,75,75,0.04)' },
                  }}>
                    <Box sx={{
                      width: 34,
                      height: 34,
                      borderRadius: '50%',
                      bgcolor: notif.type === 'medicine' ? '#E8F8EF' : '#E4F2F2',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: 0.3,
                    }}>
                      {notif.type === 'medicine'
                        ? <MedicationRoundedIcon sx={{ fontSize: 18, color: '#27AE60' }} />
                        : <EventNoteRoundedIcon sx={{ fontSize: 18, color: '#114B4B' }} />
                      }
                    </Box>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={notif.read ? 400 : 600} sx={{ color: '#114B4B', lineHeight: 1.3 }}>
                        {notif.title}
                      </Typography>
                      {notif.body && (
                        <Typography variant="caption" sx={{ color: '#5A7A7A', display: 'block', mt: 0.2 }}>
                          {notif.body}
                        </Typography>
                      )}
                      <Typography variant="caption" sx={{ color: '#5A7A7A', opacity: 0.6, mt: 0.3, display: 'block' }}>
                        {timeAgo(notif.timestamp)}
                      </Typography>
                    </Box>
                    {!notif.read && (
                      <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: '#114B4B', flexShrink: 0, mt: 0.8 }} />
                    )}
                  </Box>
                  {i < notifications.length - 1 && <Divider sx={{ mx: 2.5 }} />}
                </Box>
              ))
            )}
          </Box>
        </Box>
      </Fade>
    </Box>
  )
}

export default NotificationCenter
