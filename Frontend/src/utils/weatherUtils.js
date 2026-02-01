export const formatTemp = (temp, isCelsius = true) => {
    if (temp === undefined || temp === null) return '—'
    if (isCelsius) return Math.round(temp)
    return Math.round((temp * 9 / 5) + 32)
}

export const isDaytime = (dt, sunrise, sunset) => {
    if (!dt || !sunrise || !sunset) return true
    return dt >= sunrise && dt < sunset
}

export const getMoonPhase = (date) => {
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    if (month < 3) {
        year--
        month += 12
    }

    const c = 365.25 * year
    const e = 30.6 * month
    const jd = c + e + day - 694039.09
    const phase = jd / 29.53058867
    const phaseInt = Math.floor(phase)
    const phaseFraction = phase - phaseInt
    const phaseIndex = Math.floor(phaseFraction * 8) % 8

    const moons = ['🌑', '🌒', '🌓', '🌔', '🌕', '🌖', '🌗', '🌘']
    return moons[phaseIndex] || '🌕'
}
