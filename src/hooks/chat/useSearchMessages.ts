import { useState, useMemo } from 'react'

export function useSearchMessages({ messages }: { messages: any[] }) {
      const [search, setSearch] = useState('')

      const searchedMessages = useMemo(() => {
            return messages.filter((msg) =>
                  msg.content.toLowerCase().includes(search.toLowerCase())
            )
      }, [search, messages])

      return { search, setSearch, searchedMessages }
}
