import MainPage from '@/pages/Main'
import { createFileRoute } from '@tanstack/react-router'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'

const indexSearchSchema = z.object({
  todo_id: z.string().optional(),
})

export const Route = createFileRoute('/')({
  validateSearch: zodValidator(indexSearchSchema),
  component: () => <MainPage />,
})
