import Account from "@/components/Account";

export const metadata = { title: "Account — Lust Photography" };

export default function AccountPage() {
  return (
    <div className="gutter flex min-h-screen items-center justify-center pb-20 pt-32">
      <Account />
    </div>
  );
}
