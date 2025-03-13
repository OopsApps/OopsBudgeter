import BalanceCard from "@/components/cards/BalanceCard";
import Expense from "@/components/extra/Expense";
import Income from "@/components/extra/Income";
import Logo from "@/components/extra/Logo";
import NewTransaction from "@/components/extra/NewTransaction";
import { ThemeToggle } from "@/components/extra/ThemeToggle";
import TransactionsList from "@/components/extra/TransactionsList";

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center items-center gap-4 bg-secondary p-6 max-w-2xl w-full rounded-lg">
      <Logo />
      <ThemeToggle />
      <div className="flex flex-col gap-2 w-full relative">
        <BalanceCard />
        <div className="flex gap-2">
          <Income />
          <Expense />
        </div>
      </div>
      <NewTransaction />
      <TransactionsList />
    </main>
  );
}
