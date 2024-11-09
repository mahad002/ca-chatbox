'use client'

import { useState } from 'react'

type Message = {
  content: string
  isUser: boolean
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [userId, setUserId] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isChatStarted, setIsChatStarted] = useState(false)

  const Backend_URL = 'https://ca-chatbot.onrender.com/query'

  const handleStartChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (userId.trim()) {
      setIsChatStarted(true)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    // Send user message to the backend
    const userMessage: Message = { content: input, isUser: true }
    setMessages(prev => [...prev, userMessage])
    setInput('')
    setIsLoading(true)

    try {
      const response = await fetch(Backend_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input,
          user_id: userId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to get response from the chatbot')
      }

      const data = await response.json()

      // Extract the answer from the response
      const botResponse = data.response
      const question = input.trim()
      const answer = botResponse.replace(question, '').trim()

      // Create bot message without the question
      const botMessage: Message = { content: answer || 'Sorry, I could not process your request.', isUser: false }
      setMessages(prev => [...prev, botMessage])
    } catch (error) {
      console.error('Error:', error)
      const errorMessage: Message = { content: 'Sorry, there was an error processing your request.', isUser: false }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Render Start Chat form
  if (!isChatStarted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black text-white">
        <div className="max-w-md w-full bg-black shadow-md rounded-lg p-4">
          <h2 className="text-xl font-bold mb-4">Start Chat</h2>
          <form onSubmit={handleStartChat} className="space-y-4">
            <div>
              <label htmlFor="userId" className="block text-sm font-medium text-gray-400">
                Enter User ID
              </label>
              <input
                type="text"
                id="userId"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                placeholder="Enter your user ID"
                required
                className="mt-1 block w-full border border-gray-600 rounded-md shadow-sm p-2 bg-black text-white"
              />
            </div>
            <button 
              type="submit" 
              className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded"
            >
              Start Chat
            </button>
          </form>
        </div>
      </div>
    )
  }

  // Render Chatbot after starting chat
  return (
    <div className="w-full h-full flex flex-col bg-black text-white">
      <div className="bg-gray-800 p-4 flex-shrink-0 rounded-t-lg shadow-md">
  <h2 className="text-xl font-bold text-gray-200">
    Chatbot - <span className="text-gray-400">{userId}</span>
  </h2>
</div>

      <div className="flex-grow p-4 overflow-y-auto flex flex-col-reverse">
        <div className="space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${message.isUser ? 'bg-green-500 text-black ml-auto' : 'bg-gray-700 text-white'}`}
            >
              {message.content}
            </div>
          ))}
          {isLoading && (
            <div className="text-center text-gray-400">
              Chatbot is thinking...
            </div>
          )}
        </div>
      </div>
      <div className="fixed bottom-0 left-0 w-full p-4 bg-black border-t border-gray-700">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow border border-gray-600 rounded-md shadow-sm p-2 bg-black text-white"
          />
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
}
