import { redirect } from 'next/navigation';

// Redirect to the new vocabulary practice page
export default function PracticeVocabularyPage() {
  redirect('/vocabulary/practice');
}
