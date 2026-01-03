'use client'

import { useEffect, useRef, useState } from 'react'

export function MatrixAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [isDark, setIsDark] = useState(false)

    useEffect(() => {
        const checkTheme = () => {
            setIsDark(document.documentElement.classList.contains('dark'))
        }
        checkTheme()

        const observer = new MutationObserver(checkTheme)
        observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext('2d')
        if (!ctx) return

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        resizeCanvas()
        window.addEventListener('resize', resizeCanvas)

        // Matrix characters - using katakana, latin letters, and numbers
        const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()'.split('')

        const fontSize = 16
        const columns = canvas.width / fontSize

        // Array to store y-position of each column
        const drops: number[] = []
        for (let i = 0; i < columns; i++) {
            drops[i] = Math.random() * -100
        }

        const draw = () => {
            // Create fade effect with theme-appropriate background
            ctx.fillStyle = isDark ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.05)'
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Set text style with theme-appropriate color
            ctx.fillStyle = isDark ? '#0F0' : '#1890FF' // Green for dark mode, blue for light mode
            ctx.font = `${fontSize}px monospace`

            // Draw characters
            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = chars[Math.floor(Math.random() * chars.length)]
                const x = i * fontSize
                const y = drops[i] * fontSize

                // Draw the character
                ctx.fillText(char, x, y)

                // Reset drop to top randomly after it crosses the screen
                if (y > canvas.height && Math.random() > 0.975) {
                    drops[i] = 0
                }

                // Increment y coordinate
                drops[i]++
            }
        }

        // Animation loop
        const interval = setInterval(draw, 50)

        return () => {
            clearInterval(interval)
            window.removeEventListener('resize', resizeCanvas)
        }
    }, [isDark])

    return (
        <canvas
            ref={canvasRef}
            className="matrix-canvas"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                backgroundColor: isDark ? '#000' : '#fff',
            }}
        />
    )
}
