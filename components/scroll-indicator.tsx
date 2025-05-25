"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronDown } from "lucide-react"

interface ScrollIndicatorProps {
  targetRef: React.RefObject<HTMLElement>
}

const ScrollIndicator = ({ targetRef }: ScrollIndicatorProps) => {
  const [showIndicator, setShowIndicator] = useState(false)

  useEffect(() => {
    if (!targetRef.current) return

    const checkScroll = () => {
      const element = targetRef.current
      if (!element) return

      // Show indicator if there's content to scroll to
      const hasScrollableContent = element.scrollHeight > element.clientHeight
      // Hide indicator if we're near the bottom
      const isNearBottom = element.scrollTop + element.clientHeight >= element.scrollHeight - 50

      setShowIndicator(hasScrollableContent && !isNearBottom)
    }

    // Check initially
    checkScroll()

    // Add scroll listener
    const element = targetRef.current
    element.addEventListener("scroll", checkScroll)

    // Add resize listener
    window.addEventListener("resize", checkScroll)

    // Add mutation observer to detect content changes
    const observer = new MutationObserver(checkScroll)
    observer.observe(element, {
      childList: true,
      subtree: true,
      characterData: true,
    })

    return () => {
      element.removeEventListener("scroll", checkScroll)
      window.removeEventListener("resize", checkScroll)
      observer.disconnect()
    }
  }, [targetRef])

  if (!showIndicator) return null

  return (
    <div
      className="absolute bottom-16 right-4 animate-bounce bg-green-900/70 p-2 rounded-full border border-green-500 cursor-pointer z-50"
      onClick={() => {
        if (targetRef.current) {
          // Scroll by a larger amount to make it more noticeable
          targetRef.current.scrollTop += 200
        }
      }}
    >
      <ChevronDown className="h-5 w-5 text-green-400" />
    </div>
  )
}

export default ScrollIndicator

