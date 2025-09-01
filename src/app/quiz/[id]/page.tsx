import QuizViewer from "@/features/quiz/QuizViewer";

export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <QuizViewer quizId={params.id} />
      </main>
    </div>
  );
}