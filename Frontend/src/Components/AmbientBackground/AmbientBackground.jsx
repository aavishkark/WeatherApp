import React, { useEffect, useRef } from 'react'
import Box from '@mui/material/Box'

const AmbientBackground = () => {
    const blobRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            const { clientX, clientY } = e
            if (blobRef.current) {
                blobRef.current.animate({
                    left: `${clientX}px`,
                    top: `${clientY}px`
                }, { duration: 1000, fill: "forwards" })
            }
        }

        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: -1,
                overflow: 'hidden',
                pointerEvents: 'none',
                background: 'linear-gradient(to bottom, #f8faff, #edf2f7)',
                '[data-theme="dark"] &': {
                    background: 'linear-gradient(to bottom, #1a202c, #171923)'
                }
            }}
        >
            <Box
                ref={blobRef}
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '90vmax',
                    height: '90vmax',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle at center, rgba(0, 74, 173, 0.12), transparent 60%)',
                    filter: 'blur(80px)',
                    opacity: 0.9,
                    '[data-theme="dark"] &': {
                        background: 'radial-gradient(circle at center, rgba(79, 209, 197, 0.08), transparent 60%)',
                    }
                }}
            />
        </Box>
    )
}

export default AmbientBackground
