import BalanceCard from "@/components/cards/BalanceCard";
import DateRangePicker from "@/components/common/DatePicker";
import Expense from "@/components/categories/Expense";
import Income from "@/components/categories/Income";
import Logo from "@/components/common/Logo";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import NewTransaction from "@/components/transactions/NewTransaction";
import TransactionsList from "@/components/transactions/TransactionsList";

export default function Home() {
  return (
    <main className="relative flex flex-col justify-center items-center gap-4 bg-secondary p-6 max-w-2xl w-full rounded-lg">
      <Logo />
      <ThemeToggle />
      <div className="flex flex-col gap-2 w-full relative">
        <BalanceCard />
        <div className="flex flex-col md:flex-row gap-2">
          <Income />
          <Expense />
        </div>
      </div>
      <NewTransaction />
      <DateRangePicker />
      <TransactionsList />
    </main>
  );
}
