import QuizGenerator from "@/features/quiz/QuizGenerator";

export default function Home() {
  return (
    <div className="min-h-screen">
      <main className="container mx-auto py-8">
        <QuizGenerator />
      </main>
    </div>
  );
}