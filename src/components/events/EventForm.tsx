import React from 'react'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

interface EventFormProps {
  selectedDate: Date
  onSubmit: (event: { title: string; date: Date }) => void
  onCancel: () => void
}

export const EventForm: React.FC<EventFormProps> = ({
  selectedDate,
  onSubmit,
  onCancel,
}) => {
  const [title, setTitle] = React.useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ title, date: selectedDate })
    setTitle('')
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium">
          Event Title
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required
        />
      </div>
      <div className="text-sm text-muted-foreground">
        Selected Date: {format(selectedDate, 'PPP')}
      </div>
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">Add Event</Button>
      </div>
    </form>
  )
} 