import ChatWidget from "../components/ChatWidget";

export default function Page() {
  return (
    <main>
      <h1 style={{ fontSize: 28, marginBottom: 8 }}>
        Hi, I’m Sumedh!
      </h1>
      <p className="muted" style={{ marginBottom: 20 }}>
        I wrangle code, clouds, and caffeine to build rock-solid software.
        Curious about my projects, skills, or secret debugging rituals?
        Ask my AI sidekick anything below. No small talk required 😄.
      </p>
      <ChatWidget />
    </main>
  );
}
