
import React from 'react'
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion'

function FloatingText({x, y, text, onComplete}) {
  return (
    <motion.div
      initial={{ opacity: 1, y: 0 }}
      animate={{ opacity: 0, y: -80 }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      style={{
        position: "absolute",
        left: x,
        top: y,
        color: "#00ff88",
        fontWeight: "bold",
        fontSize: "20px",
        pointerEvents: "none",
      }}
      onAnimationComplete={onComplete}
    >
        {text}
    </motion.div>
  )
}

export default FloatingText