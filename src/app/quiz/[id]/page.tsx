import QuizViewer from "@/features/quiz/QuizViewer";
import NavBar from "@/app/components/Navbar";

export default function QuizPage({ params }: { params: { id: string } }) {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto py-8">
        <QuizViewer quizId={params.id} />
      </main>
    </div>
  );
}