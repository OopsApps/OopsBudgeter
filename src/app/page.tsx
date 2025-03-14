import BalanceCard from "@/components/cards/BalanceCard";
import Expense from "@/components/categories/Expense";
import Income from "@/components/categories/Income";
import DateRangePicker from "@/components/common/DatePicker";
import NewTransaction from "@/components/transactions/NewTransaction";
import TransactionsList from "@/components/transactions/TransactionsList";
import { generateMetadata } from "@/lib/head";

export const metadata = generateMetadata({
  title: "Dashboard",
});

export default function Home() {
  return (
    <main className="flex flex-col gap-2 min-w-full items-center">
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
