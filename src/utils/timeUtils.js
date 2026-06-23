/**
 * 所有時間計算均以 Asia/Taipei（GMT+8）為基準
 * 生日：每年 7 月 15 日 00:00:00 GMT+8
 */

function getGMT8Parts() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Taipei',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
  const parts = {}
  formatter.formatToParts(new Date()).forEach(({ type, value }) => {
    if (type !== 'literal') parts[type] = Number(value)
  })
  return parts // { year, month, day, hour, minute, second }
}

/** 7/15 GMT+8 00:00:00 對應的 UTC timestamp */
function getBirthdayUTC(year) {
  // July 15 00:00:00 GMT+8 = July 14 16:00:00 UTC
  return Date.UTC(year, 6, 14, 16, 0, 0)
}

export function isBirthdayOrAfter() {
  const { year, month, day } = getGMT8Parts()
  if (month > 7) return true
  if (month === 7 && day >= 15) return true
  return false
}

export function getTimeUntilBirthday() {
  const { year } = getGMT8Parts()
  const now = Date.now()
  const birthdayUTC = getBirthdayUTC(year)

  if (now >= birthdayUTC) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, done: true }
  }

  const diff = birthdayUTC - now
  const days    = Math.floor(diff / 86400000)
  const hours   = Math.floor((diff % 86400000) / 3600000)
  const minutes = Math.floor((diff % 3600000) / 60000)
  const seconds = Math.floor((diff % 60000) / 1000)

  return { days, hours, minutes, seconds, done: false }
}
