import React from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/calendar/Calendar'
import { EventForm } from '@/components/events/EventForm'
import { CalendarProvider, useCalendar } from '@/contexts/CalendarContext'

const CalendarSection = () => {
  const { currentDate, selectedDate, setSelectedDate, addEvent } = useCalendar()
  const [showEventForm, setShowEventForm] = React.useState(false)

  const handleAddEvent = () => {
    if (selectedDate) {
      setShowEventForm(true)
    }
  }

  const handleSubmitEvent = (event: { title: string; date: Date }) => {
    addEvent(event)
    setShowEventForm(false)
    setSelectedDate(null)
  }

  return (
    <div className="flex flex-col items-center space-y-4">
      <Calendar
        currentDate={currentDate}
        onDateSelect={setSelectedDate}
      />
      {selectedDate && !showEventForm && (
        <Button onClick={handleAddEvent}>Add Event</Button>
      )}
      {showEventForm && selectedDate && (
        <div className="w-full max-w-md rounded-lg border bg-card p-4 shadow-sm">
          <EventForm
            selectedDate={selectedDate}
            onSubmit={handleSubmitEvent}
            onCancel={() => {
              setShowEventForm(false)
              setSelectedDate(null)
            }}
          />
        </div>
      )}
    </div>
  )
}

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8">
      <h1 className="text-4xl font-bold">Welcome to Semester Planeraren</h1>
      <p className="text-xl text-muted-foreground">
        Plan your semester with ease and efficiency
      </p>
      <CalendarProvider>
        <CalendarSection />
      </CalendarProvider>
    </div>
  )
} 