export default function Notice({ message, retry }: { message: string; retry?: () => void }) {
  return (
    <div role="alert" className="mx-auto my-6 max-w-4xl rounded-xl border bg-white p-5 text-slate-800">
      {message}
      {retry && <button className="ml-3 text-blue-700 underline" onClick={retry}>Try again</button>}
    </div>
  );
}
