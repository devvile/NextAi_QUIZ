import Image from "next/image";
import QuizGenerator from "./features/chat/QuizGenerator";

export default function Home() {

  return (
    <div className="min-h-screen p-8">
      <main className="container mx-auto py-8">
        <QuizGenerator />
      </main>
    </div>
  );
}
