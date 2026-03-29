export default function EmailSignInForm({ error }: { error?: string }) {
  return (
    <form action="/api/account/sign-in" method="post" className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-[#1f2a1f]">Email</span>
        <input
          type="email"
          name="email"
          placeholder="mom@example.com"
          className="w-full rounded-2xl border border-[rgba(31,42,31,0.12)] bg-white px-4 py-3 text-sm text-[#1f2a1f]"
        />
      </label>
      <button
        type="submit"
        className="w-full rounded-2xl bg-[#23402b] px-4 py-3 text-sm font-semibold text-[#f7f3ea]"
      >
        Sign In
      </button>
      <p className="text-xs text-[#586857]">
        Demo emails: `mom@example.com`, `brother@example.com`, `sister@example.com`
      </p>
      {error ? <p className="text-sm text-[#9f3a28]">{error}</p> : null}
    </form>
  );
}
