import { componentTagger } from 'lovable-tagger'

export function initializeLovable() {
  if (import.meta.env.DEV) {
    componentTagger()
  }
} 