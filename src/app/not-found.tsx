import Link from "next/link";

export default function NotFound() {
  return (
    <div className="gutter flex min-h-[80vh] flex-col items-center justify-center text-center">
      <p className="label">404</p>
      <h1 className="mt-4 font-display text-6xl font-light italic">Questa stanza è chiusa.</h1>
      <p className="mt-3 text-parchment/70">This room is locked.</p>
      <Link href="/" className="btn btn-brass mt-10">Back to the villa</Link>
    </div>
  );
}
