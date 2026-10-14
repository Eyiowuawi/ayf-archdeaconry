export default function Scripture({ text, reference }: { text: string; reference: string }) {
  return (
    <blockquote className="mb-4 border-l-[3px] border-primary py-1 pl-4 font-serif text-[1.08rem] italic">
      <p className="mb-1.5">{text}</p>
      <cite className="font-sans text-[0.82rem] font-bold not-italic text-ink-muted">{reference}</cite>
    </blockquote>
  );
}
