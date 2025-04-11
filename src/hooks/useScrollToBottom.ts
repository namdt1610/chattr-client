import { useEffect, useState } from 'react'

export const useScrollToBottom = (chatRef: React.RefObject<HTMLDivElement>, messages: any[]) => {
      const [isAtBottom, setIsAtBottom] = useState(true)
      const [hasNewMessage, setHasNewMessage] = useState(false)

      const handleScroll = () => {
            if (!chatRef.current) return
            const { scrollTop, scrollHeight, clientHeight } = chatRef.current
            const isBottom = scrollTop + clientHeight >= scrollHeight - 10
            setIsAtBottom(isBottom)
            if (isBottom) setHasNewMessage(false)
      }

      useEffect(() => {
            if (!isAtBottom) setHasNewMessage(true)
      }, [messages])

      const scrollToBottom = () => {
            chatRef.current?.scrollTo({
                  top: chatRef.current.scrollHeight,
                  behavior: 'smooth',
            })
      }

      return { isAtBottom, hasNewMessage, handleScroll, scrollToBottom }
}