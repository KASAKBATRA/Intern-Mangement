"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false)
    }, 2000) // 2 sec
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-primary z-50 pointer-events-none"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.div
            initial={{ scale: 1.5 }}   // 🔹 Start bigger
            animate={{ scale: 1 }}     // 🔹 Settle to normal
            exit={{ scale: 30, opacity: 0 }} // 🔹 Zoom out to disappear
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <Image
              src="/rsf-logo.png"
              alt="RSF Logo"
              width={200}    // 🔹 Logo size bada
              height={200}
              className="rounded-lg"
              priority
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
