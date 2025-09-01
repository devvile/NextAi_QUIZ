import QuizList from "@/features/quiz/QuizList";
import NavBar from "../components/Navbar";

export default function QuizzesPage() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto py-8">
        <QuizList />
      </main>
    </div>
  );
}
