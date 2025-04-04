import React, { createContext, useContext, useState, ReactNode } from 'react'

interface Event {
  id: string
  title: string
  date: Date
}

interface CalendarContextType {
  currentDate: Date
  selectedDate: Date | null
  events: Event[]
  setCurrentDate: (date: Date) => void
  setSelectedDate: (date: Date | null) => void
  addEvent: (event: Omit<Event, 'id'>) => void
  removeEvent: (id: string) => void
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined)

export const useCalendar = () => {
  const context = useContext(CalendarContext)
  if (!context) {
    throw new Error('useCalendar must be used within a CalendarProvider')
  }
  return context
}

interface CalendarProviderProps {
  children: ReactNode
}

export const CalendarProvider: React.FC<CalendarProviderProps> = ({ children }) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [events, setEvents] = useState<Event[]>([])

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent: Event = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
    }
    setEvents((prevEvents) => [...prevEvents, newEvent])
  }

  const removeEvent = (id: string) => {
    setEvents((prevEvents) => prevEvents.filter((event) => event.id !== id))
  }

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        selectedDate,
        events,
        setCurrentDate,
        setSelectedDate,
        addEvent,
        removeEvent,
      }}
    >
      {children}
    </CalendarContext.Provider>
  )
} 