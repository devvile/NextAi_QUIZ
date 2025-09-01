import QuizGenerator from "@/features/quiz/QuizGenerator";
import NavBar from "./components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen">
      <NavBar />
      <main className="container mx-auto py-8">
        <QuizGenerator />
      </main>
    </div>
  );
}