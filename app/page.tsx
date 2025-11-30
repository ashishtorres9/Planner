import { ChatPlanner } from "@/components/chat-planner"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <main className="h-screen flex flex-col bg-gradient-to-b from-background via-background to-accent-light/10">
      <Header />
      <ChatPlanner />
    </main>
  )
}
