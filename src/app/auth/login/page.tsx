import AuthForm from "@/components/AuthForm";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ registered?: string }> }) {
  const { registered } = await searchParams;
  return <>
    {registered === "1" && <p role="status" className="text-center text-emerald-800">Account created. Sign in to write your first article.</p>}
    <AuthForm />
  </>;
}
