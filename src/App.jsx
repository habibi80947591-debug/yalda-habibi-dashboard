import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

const currencies = [
  { code: "USD", name: "US Dollar", flag: "🇺🇸", rate: 1, change: 0.42 },
  { code: "EUR", name: "Euro", flag: "🇪🇺", rate: 0.92, change: -0.18 },
  { code: "GBP", name: "British Pound", flag: "🇬🇧", rate: 0.78, change: 0.31 },
  { code: "JPY", name: "Japanese Yen", flag: "🇯🇵", rate: 149.52, change: -0.65 },
  { code: "AFN", name: "Afghan Afghani", flag: "🇦🇫", rate: 68.4, change: 0.24 },
  { code: "CAD", name: "Canadian Dollar", flag: "🇨🇦", rate: 1.37, change: 0.12 },
  { code: "AUD", name: "Australian Dollar", flag: "🇦🇺", rate: 1.51, change: -0.22 },
  { code: "CHF", name: "Swiss Franc", flag: "🇨🇭", rate: 0.86, change: 0.16 },
];

const initialTransactions = [
  { id: "TX-1024", pair: "USD → EUR", amount: "$1,250.00", result: "€1,150.00", status: "Completed", date: "Oct 13, 2026" },
  { id: "TX-1023", pair: "GBP → USD", amount: "£840.00", result: "$1,076.92", status: "Completed", date: "Oct 12, 2026" },
  { id: "TX-1022", pair: "USD → AFN", amount: "$500.00", result: "؋34,200.00", status: "Pending", date: "Oct 12, 2026" },
  { id: "TX-1021", pair: "EUR → USD", amount: "€2,000.00", result: "$2,173.91", status: "Completed", date: "Oct 11, 2026" },
];

const news = [
  { icon: "🌍", category: "MARKETS", title: "Global currency markets and the latest exchange-rate trends", time: "2 hours ago" },
  { icon: "📊", category: "ANALYSIS", title: "Understanding the movement of major currency pairs", time: "5 hours ago" },
  { icon: "🏦", category: "ECONOMY", title: "How central bank decisions can influence currencies", time: "Yesterday" },
];

const chartValues = [42, 48, 45, 57, 51, 62, 58, 70, 65, 76, 69, 83, 78, 91];

const navigation = [
  { label: "Dashboard", icon: "▦" },
  { label: "Rates", icon: "↗" },
  { label: "Convert", icon: "⇄" },
  { label: "Charts", icon: "▥" },
  { label: "Favorites", icon: "☆" },
  { label: "Transactions", icon: "▤" },
  { label: "News", icon: "◉" },
  { label: "Settings", icon: "⚙" },
];

const money = (value) =>
  Number(value || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

function Panel({ children, darkMode, className = "", ...props }) {
  return (
    <motion.section
      layout
      whileHover={{ y: -2 }}
      transition={{ duration: 0.22 }}
      className={`min-w-0 rounded-2xl border p-5 transition-colors duration-300 sm:p-6 ${
        darkMode
          ? "border-white/[0.09] bg-[#15171c] text-white"
          : "border-slate-200 bg-white text-slate-900 shadow-sm"
      } ${className}`}
      {...props}
    >
      {children}
    </motion.section>
  );
}

function SectionTitle({ title, subtitle, darkMode, action }) {
  return (
    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
      <div>
        <h2 className="text-base font-semibold tracking-tight">{title}</h2>
        {subtitle && (
          <p className={`mt-1 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {subtitle}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatCard({ item, darkMode }) {
  return (
    <Panel darkMode={darkMode}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            {item.label}
          </p>
          <p className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
            {item.value}
          </p>
        </div>
        <span className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
          darkMode ? "bg-lime-300/10 text-lime-300" : "bg-lime-100 text-lime-800"
        }`}>
          {item.icon}
        </span>
      </div>
      <p className={`mt-4 text-xs ${item.positive ? "text-emerald-500" : "text-rose-500"}`}>
        {item.trend}{" "}
        <span className={darkMode ? "text-slate-400" : "text-slate-500"}>
          {item.note}
        </span>
      </p>
    </Panel>
  );
}

function RateChart({ darkMode, range }) {
  const width = 600;
  const height = 220;
  const values = chartValues;
  const min = Math.min(...values) - 8;
  const max = Math.max(...values) + 8;

  const points = values.map((value, index) => {
    const x = 12 + (index / (values.length - 1)) * (width - 24);
    const y = 12 + ((max - value) / (max - min)) * (height - 42);
    return `${x},${y}`;
  }).join(" ");

  const first = points.split(" ")[0].split(",");
  const last = points.split(" ").at(-1).split(",");
  const area = `${points} ${last[0]},${height - 30} ${first[0]},${height - 30}`;
  const grid = darkMode ? "#30343c" : "#e2e8f0";
  const label = darkMode ? "#8b92a0" : "#64748b";

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            USD / EUR
          </p>
          <p className="mt-1 text-3xl font-semibold">0.9200</p>
          <p className="mt-1 text-sm text-emerald-500">↗ +0.42% today</p>
        </div>
        <span className={`text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
          Selected period: {range}
        </span>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="h-auto w-full"
        role="img"
        aria-label="Illustrative USD to EUR exchange-rate chart"
      >
        <defs>
          <linearGradient id="currencyWaveFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#a3e635" stopOpacity=".3" />
            <stop offset="100%" stopColor="#a3e635" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[35, 75, 115, 155, 190].map((y) => (
          <line key={y} x1="0" x2={width} y1={y} y2={y} stroke={grid} strokeDasharray="4 5" />
        ))}

        <polygon points={area} fill="url(#currencyWaveFill)" />
        <polyline
          points={points}
          fill="none"
          stroke="#a3e635"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle
          cx={last[0]}
          cy={last[1]}
          r="5"
          fill="#a3e635"
          stroke={darkMode ? "#15171c" : "#ffffff"}
          strokeWidth="3"
        />

        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, index) => (
          <text
            key={day}
            x={index * (width / 6)}
            y={height - 5}
            fontSize="11"
            fill={label}
            textAnchor={index === 0 ? "start" : index === 6 ? "end" : "middle"}
          >
            {day}
          </text>
        ))}
      </svg>
      <p className={`mt-3 text-xs ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
        Illustrative chart data for this dashboard demo.
      </p>
    </div>
  );
}

function CurrencyTable({ darkMode, items, favorites, onFavorite }) {
  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const border = darkMode ? "border-white/[0.08]" : "border-slate-200";

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className={`border-b text-xs ${border} ${muted}`}>
            <th className="pb-3 font-medium">Currency</th>
            <th className="pb-3 font-medium">Rate per USD</th>
            <th className="pb-3 font-medium">24h change</th>
            <th className="pb-3 text-right font-medium">Favorite</th>
          </tr>
        </thead>
        <tbody>
          {items.map((currency) => (
            <tr
              key={currency.code}
              className={`border-b last:border-0 ${border} ${
                darkMode ? "hover:bg-white/[0.025]" : "hover:bg-slate-50"
              }`}
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{currency.flag}</span>
                  <div>
                    <p className="font-semibold">{currency.code}</p>
                    <p className={`mt-1 text-xs ${muted}`}>{currency.name}</p>
                  </div>
                </div>
              </td>
              <td className="py-4 font-medium">
                {currency.rate.toLocaleString("en-US", { maximumFractionDigits: 4 })}
              </td>
              <td className={`py-4 font-medium ${currency.change >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                {currency.change > 0 ? "+" : ""}{currency.change.toFixed(2)}%
              </td>
              <td className="py-4 text-right">
                <button
                  onClick={() => onFavorite(currency.code)}
                  aria-label={`Toggle ${currency.code} favorite`}
                  className={`rounded-lg px-3 py-1 text-xl ${
                    favorites.includes(currency.code)
                      ? "text-amber-400"
                      : muted
                  }`}
                >
                  {favorites.includes(currency.code) ? "★" : "☆"}
                </button>
              </td>
            </tr>
          ))}
          {items.length === 0 && (
            <tr>
              <td colSpan="4" className={`py-8 text-center ${muted}`}>
                No currencies found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function TransactionList({ darkMode, transactions }) {
  const muted = darkMode ? "text-slate-400" : "text-slate-500";

  return (
    <div className="space-y-2">
      {transactions.map((transaction, index) => (
        <motion.div
          key={transaction.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.06 }}
          className={`flex flex-wrap items-center justify-between gap-3 rounded-xl p-3 ${
            darkMode ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${
              darkMode ? "bg-white/5" : "bg-slate-100"
            }`}>
              ⇄
            </span>
            <div>
              <p className="text-sm font-semibold">{transaction.pair}</p>
              <p className={`mt-1 text-xs ${muted}`}>
                {transaction.id} · {transaction.date}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold">{transaction.result}</p>
            <p className={`mt-1 text-xs ${
              transaction.status === "Completed" ? "text-emerald-500" : "text-amber-500"
            }`}>
              {transaction.status}
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

export default function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [activePage, setActivePage] = useState("Dashboard");
  const [menuOpen, setMenuOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [from, setFrom] = useState("USD");
  const [to, setTo] = useState("EUR");
  const [amount, setAmount] = useState("1000");
  const [range, setRange] = useState("1W");
  const [favorites, setFavorites] = useState(["USD", "EUR", "AFN"]);
  const [transactions] = useState(initialTransactions);
  const [showAllTransactions, setShowAllTransactions] = useState(false);
  const [settings, setSettings] = useState({
    notifications: true,
    marketUpdates: true,
    compactView: false,
  });
  const [savedMessage, setSavedMessage] = useState("");

  const muted = darkMode ? "text-slate-400" : "text-slate-500";
  const border = darkMode ? "border-white/[0.09]" : "border-slate-200";
  const field = darkMode
    ? "border-white/10 bg-[#101216] text-white"
    : "border-slate-200 bg-white text-slate-900";

  const fromCurrency = currencies.find((c) => c.code === from) || currencies[0];
  const toCurrency = currencies.find((c) => c.code === to) || currencies[1];

  const convertedAmount = useMemo(() => {
    const number = Number(amount);
    if (!Number.isFinite(number) || number < 0) return "0.00";
    return money((number / fromCurrency.rate) * toCurrency.rate);
  }, [amount, fromCurrency, toCurrency]);

  const filteredCurrencies = useMemo(
    () => currencies.filter((currency) =>
      `${currency.code} ${currency.name}`.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  const favoriteCurrencies = currencies.filter((currency) =>
    favorites.includes(currency.code)
  );

  function toggleFavorite(code) {
    setFavorites((previous) =>
      previous.includes(code)
        ? previous.filter((item) => item !== code)
        : [...previous, code]
    );
  }

  function navigate(page) {
    setActivePage(page);
    setMenuOpen(false);
    setSearch("");
    setSavedMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const pageTitles = {
    Dashboard: "Your financial overview",
    Rates: "Explore currency rates",
    Convert: "Currency converter",
    Charts: "Market charts",
    Favorites: "Your favorite currencies",
    Transactions: "Transaction history",
    News: "News & insights",
    Settings: "Personalize your workspace",
  };

  function PageHeading({ eyebrow = "CURRENCYWAVE" }) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <p className={`mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] ${muted}`}>
            {eyebrow}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {activePage === "Dashboard" ? "Good morning" : pageTitles[activePage]}
            <span className="text-lime-500">.</span>
          </h2>
          <p className={`mt-2 text-sm ${muted}`}>
            {activePage === "Dashboard"
              ? "Your currency overview at a glance."
              : `Manage and explore your ${activePage.toLowerCase()} workspace.`}
          </p>
        </div>
        <span className={`w-fit rounded-xl border px-3 py-2 text-xs ${border} ${muted}`}>
          Demo workspace · 2026
        </span>
      </motion.div>
    );
  }

  function ConverterPanel() {
    return (
      <Panel darkMode={darkMode}>
        <SectionTitle
          title="Quick converter"
          subtitle="Change the amount or currencies to calculate a conversion"
          darkMode={darkMode}
        />

        <div className={`rounded-xl border p-4 ${border} ${
          darkMode ? "bg-black/15" : "bg-slate-50"
        }`}>
          <label htmlFor="amount" className={`mb-2 block text-xs ${muted}`}>
            You send
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <input
              id="amount"
              type="number"
              min="0"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="min-w-0 flex-1 bg-transparent text-2xl font-semibold outline-none sm:text-3xl"
              placeholder="Enter amount"
            />
            <select
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className={`rounded-lg border px-2 py-2 text-sm outline-none ${field}`}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative z-10 -my-2 flex justify-center">
          <motion.button
            whileHover={{ rotate: 180, scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => {
              setFrom(to);
              setTo(from);
            }}
            aria-label="Swap currencies"
            className={`flex h-10 w-10 items-center justify-center rounded-xl border text-xl ${border} ${
              darkMode ? "bg-[#20232a]" : "bg-white"
            }`}
          >
            ⇅
          </motion.button>
        </div>

        <div className={`rounded-xl border p-4 ${border} ${
          darkMode ? "bg-black/15" : "bg-slate-50"
        }`}>
          <label htmlFor="targetCurrency" className={`mb-2 block text-xs ${muted}`}>
            You receive
          </label>
          <div className="flex flex-wrap items-center gap-3">
            <AnimatePresence mode="wait">
              <motion.p
                key={`${convertedAmount}-${to}`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="min-w-0 flex-1 break-all text-2xl font-semibold sm:text-3xl"
              >
                {convertedAmount}
              </motion.p>
            </AnimatePresence>
            <select
              id="targetCurrency"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className={`rounded-lg border px-2 py-2 text-sm outline-none ${field}`}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
              ))}
            </select>
          </div>
        </div>

        <div className={`mt-4 flex flex-wrap items-center justify-between gap-2 text-xs ${muted}`}>
          <span>Indicative exchange rate</span>
          <span className="font-semibold">1 {from} = {(toCurrency.rate / fromCurrency.rate).toFixed(4)} {to}</span>
        </div>

        <button
          onClick={() => {
            setSavedMessage("Conversion calculated successfully. This is a demo, not a real transaction.");
          }}
          className="mt-5 w-full rounded-xl bg-lime-300 py-3 text-sm font-semibold text-slate-950 transition hover:bg-lime-200"
        >
          Calculate conversion →
        </button>

        {savedMessage && (
          <p role="status" className={`mt-3 text-xs ${
            darkMode ? "text-lime-300" : "text-lime-700"
          }`}>
            {savedMessage}
          </p>
        )}
        <p className={`mt-3 text-center text-[11px] ${muted}`}>
          Demo rates only. No real money is exchanged.
        </p>
      </Panel>
    );
  }

  function DashboardPage() {
    const stats = [
      { label: "Total balance", value: "$24,680.50", icon: "$", trend: "↗ 12.8%", note: "vs last month", positive: true },
      { label: "Exchange volume", value: "$8,420.00", icon: "⇄", trend: "↗ 8.2%", note: "this week", positive: true },
      { label: "Transactions", value: "148", icon: "▤", trend: "↗ 6.4%", note: "vs last week", positive: true },
      { label: "Average rate", value: "0.9200", icon: "◈", trend: "↘ 0.3%", note: "vs yesterday", positive: false },
    ];

    return (
      <>
        <PageHeading eyebrow="TUESDAY, OCTOBER 13, 2026" />

        <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.07, duration: 0.35 }}
            >
              <StatCard item={item} darkMode={darkMode} />
            </motion.div>
          ))}
        </div>

        <div className="mb-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.45fr_1fr]">
          <Panel darkMode={darkMode}>
            <SectionTitle title="Exchange rate overview" subtitle="USD / EUR sample trend" darkMode={darkMode}
              action={
                <div className={`flex gap-1 rounded-xl p-1 ${darkMode ? "bg-black/30" : "bg-slate-100"}`}>
                  {["1D", "1W", "1M", "1Y"].map((r) => (
                    <button
                      key={r}
                      onClick={() => setRange(r)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs ${
                        range === r ? "bg-lime-300 text-slate-950" : muted
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              }
            />
            <RateChart darkMode={darkMode} range={range} />
          </Panel>
          <ConverterPanel />
        </div>

        <Panel darkMode={darkMode} className="mb-5">
          <SectionTitle title="Popular currencies" subtitle="Your market at a glance" darkMode={darkMode}
            action={<button onClick={() => navigate("Rates")} className="text-xs font-semibold text-lime-600 dark:text-lime-300">View all →</button>}
          />
          <CurrencyTable
            darkMode={darkMode}
            items={currencies.slice(0, 5)}
            favorites={favorites}
            onFavorite={toggleFavorite}
          />
        </Panel>

        <Panel darkMode={darkMode}>
          <SectionTitle title="Recent transactions" subtitle="Your latest sample activity" darkMode={darkMode}
            action={<button onClick={() => navigate("Transactions")} className="text-xs font-semibold text-lime-600 dark:text-lime-300">View all →</button>}
          />
          <TransactionList darkMode={darkMode} transactions={transactions.slice(0, 3)} />
        </Panel>
      </>
    );
  }

  function RatesPage() {
    return (
      <>
        <PageHeading />
        <Panel darkMode={darkMode} className="mb-5">
          <SectionTitle title="Currency rate explorer" subtitle="Search currencies and save your favorites" darkMode={darkMode} />
          <label className={`mb-5 flex items-center gap-3 rounded-xl border px-4 py-3 ${border} ${
            darkMode ? "bg-black/15" : "bg-slate-50"
          }`}>
            <span className={muted}>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by code or currency name..."
              className="w-full bg-transparent text-sm outline-none"
            />
          </label>
          <CurrencyTable darkMode={darkMode} items={filteredCurrencies} favorites={favorites} onFavorite={toggleFavorite} />
        </Panel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { label: "Available currencies", value: currencies.length, icon: "🌍" },
            { label: "Saved favorites", value: favorites.length, icon: "★" },
            { label: "Positive changes", value: currencies.filter((c) => c.change > 0).length, icon: "↗" },
          ].map((item) => (
            <Panel key={item.label} darkMode={darkMode}>
              <p className={`text-sm ${muted}`}>{item.icon} {item.label}</p>
              <p className="mt-3 text-3xl font-semibold">{item.value}</p>
            </Panel>
          ))}
        </div>
      </>
    );
  }

  function ChartsPage() {
    return (
      <>
        <PageHeading />
        <Panel darkMode={darkMode} className="mb-5">
          <SectionTitle title="Exchange rate performance" subtitle="Switch between time ranges to explore the sample chart" darkMode={darkMode}
            action={
              <div className={`flex gap-1 rounded-xl p-1 ${darkMode ? "bg-black/30" : "bg-slate-100"}`}>
                {["1D", "1W", "1M", "1Y"].map((r) => (
                  <button key={r} onClick={() => setRange(r)} className={`rounded-lg px-3 py-2 text-xs ${
                    range === r ? "bg-lime-300 text-slate-950" : muted
                  }`}>{r}</button>
                ))}
              </div>
            }
          />
          <RateChart darkMode={darkMode} range={range} />
        </Panel>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {currencies.slice(1, 5).map((currency, index) => (
            <Panel key={currency.code} darkMode={darkMode}>
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{currency.flag}</span>
                  <div>
                    <p className="font-semibold">USD / {currency.code}</p>
                    <p className={`text-xs ${muted}`}>{currency.name}</p>
                  </div>
                </div>
                <span className={currency.change >= 0 ? "text-emerald-500" : "text-rose-500"}>
                  {currency.change > 0 ? "+" : ""}{currency.change}%
                </span>
              </div>
              <div className="flex h-16 items-end gap-1">
                {chartValues.slice(index, index + 10).map((value, i) => (
                  <motion.div
                    key={`${currency.code}-${i}`}
                    initial={{ height: 0 }}
                    animate={{ height: `${value}%` }}
                    transition={{ duration: 0.5, delay: i * 0.025 }}
                    className="flex-1 rounded-t-sm bg-lime-400/80"
                  />
                ))}
              </div>
              <p className={`mt-3 text-xs ${muted}`}>Illustrative trend · not live market data</p>
            </Panel>
          ))}
        </div>
      </>
    );
  }

  function FavoritesPage() {
    return (
      <>
        <PageHeading />
        <Panel darkMode={darkMode} className="mb-5">
          <SectionTitle title="Your watchlist" subtitle="Quickly access currencies you have starred" darkMode={darkMode} />
          <CurrencyTable darkMode={darkMode} items={favoriteCurrencies} favorites={favorites} onFavorite={toggleFavorite} />
        </Panel>
        <Panel darkMode={darkMode}>
          <SectionTitle title="Manage favorites" subtitle="Add or remove currencies from your watchlist" darkMode={darkMode} />
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {currencies.map((currency) => {
              const isFavorite = favorites.includes(currency.code);
              return (
                <motion.button
                  key={currency.code}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleFavorite(currency.code)}
                  className={`flex items-center gap-3 rounded-xl border p-4 text-left ${border} ${
                    darkMode ? "hover:bg-white/[0.04]" : "hover:bg-slate-50"
                  }`}
                >
                  <span className="text-2xl">{currency.flag}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-semibold">{currency.code}</span>
                    <span className={`block truncate text-xs ${muted}`}>{currency.name}</span>
                  </span>
                  <span className={isFavorite ? "text-amber-400" : muted}>{isFavorite ? "★" : "☆"}</span>
                </motion.button>
              );
            })}
          </div>
        </Panel>
      </>
    );
  }

  function TransactionsPage() {
    return (
      <>
        <PageHeading />
        <Panel darkMode={darkMode}>
          <SectionTitle title="Transaction history" subtitle="Sample conversion records for this dashboard" darkMode={darkMode}
            action={<button onClick={() => setShowAllTransactions((previous) => !previous)} className="text-xs font-semibold text-lime-600 dark:text-lime-300">{showAllTransactions ? "Show fewer" : "Show all"}</button>}
          />
          <TransactionList darkMode={darkMode} transactions={showAllTransactions ? transactions : transactions.slice(0, 3)} />
          <p className={`mt-4 border-t pt-4 text-xs ${border} ${muted}`}>
            These are example records. This demo does not process real transactions.
          </p>
        </Panel>
      </>
    );
  }

  function NewsPage() {
    return (
      <>
        <PageHeading />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {news.map((item, index) => (
            <motion.div key={item.title} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08 }}>
              <Panel darkMode={darkMode} className="h-full">
                <div className="mb-5 flex items-center justify-between">
                  <span className={`rounded-lg px-2 py-1 text-[10px] font-semibold ${
                    darkMode ? "bg-lime-300/10 text-lime-300" : "bg-lime-100 text-lime-800"
                  }`}>{item.category}</span>
                  <span className="text-3xl">{item.icon}</span>
                </div>
                <h3 className="text-base font-semibold leading-6">{item.title}</h3>
                <p className={`mt-5 text-xs ${muted}`}>{item.time}</p>
              </Panel>
            </motion.div>
          ))}
        </div>
        <p className={`mt-4 text-xs ${muted}`}>Sample editorial content only; live news is not connected.</p>
      </>
    );
  }

  function SettingsPage() {
    const options = [
      { key: "notifications", title: "Notifications", description: "Show account and conversion notifications." },
      { key: "marketUpdates", title: "Market updates", description: "Keep market summaries visible in your workspace." },
      { key: "compactView", title: "Compact layout", description: "Use a more compact arrangement for dashboard content." },
    ];

    return (
      <>
        <PageHeading />
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Panel darkMode={darkMode}>
            <SectionTitle title="Appearance" subtitle="Customize the look of CurrencyWave" darkMode={darkMode} />
            <p className="mb-3 text-sm font-medium">Color theme</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDarkMode(false)}
                className={`rounded-xl border p-4 text-left transition ${!darkMode ? "border-lime-500 ring-2 ring-lime-500/20" : border}`}
              >
                <div className="mb-3 flex h-16 items-center gap-2 rounded-lg border border-slate-200 bg-slate-100 p-3">
                  <span className="h-full w-1/4 rounded bg-white" />
                  <span className="h-8 flex-1 rounded bg-white" />
                </div>
                <p className="text-sm font-semibold">☀️ Light mode</p>
                <p className={`mt-1 text-xs ${muted}`}>Bright and clean</p>
              </button>
              <button
                onClick={() => setDarkMode(true)}
                className={`rounded-xl border p-4 text-left transition ${darkMode ? "border-lime-400 ring-2 ring-lime-400/20" : border}`}
              >
                <div className="mb-3 flex h-16 items-center gap-2 rounded-lg border border-slate-700 bg-[#0d0f12] p-3">
                  <span className="h-full w-1/4 rounded bg-[#252830]" />
                  <span className="h-8 flex-1 rounded bg-[#252830]" />
                </div>
                <p className="text-sm font-semibold">🌙 Dark mode</p>
                <p className={`mt-1 text-xs ${muted}`}>Comfortable low-light UI</p>
              </button>
            </div>

            <div className={`my-6 border-t ${border}`} />

            <SectionTitle title="Preferences" subtitle="These options update the current interface" darkMode={darkMode} />
            <div className="space-y-1">
              {options.map((option) => (
                <label key={option.key} className={`flex cursor-pointer items-center justify-between gap-4 rounded-xl p-3 ${
                  darkMode ? "hover:bg-white/[0.03]" : "hover:bg-slate-50"
                }`}>
                  <span>
                    <span className="block text-sm font-medium">{option.title}</span>
                    <span className={`mt-1 block text-xs ${muted}`}>{option.description}</span>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings[option.key]}
                    onChange={(event) => setSettings((previous) => ({
                      ...previous,
                      [option.key]: event.target.checked,
                    }))}
                    className="h-4 w-4 accent-lime-500"
                  />
                </label>
              ))}
            </div>
            <button
              onClick={() => setSavedMessage("Your preferences have been applied to this session.")}
              className="mt-5 rounded-xl bg-lime-300 px-5 py-3 text-sm font-semibold text-slate-950 hover:bg-lime-200"
            >
              Save preferences
            </button>
            {savedMessage && <p role="status" className={`mt-3 text-xs ${muted}`}>{savedMessage}</p>}
          </Panel>

          <div className="space-y-5">
            <Panel darkMode={darkMode}>
              <SectionTitle title="Profile" subtitle="Your workspace identity" darkMode={darkMode} />
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-300 text-sm font-bold text-slate-950">
                  Habibi
                </div>
                <div>
                  <p className="font-semibold">Yalda Habibi</p>
                  <p className={`mt-1 text-xs ${muted}`}>CurrencyWave user</p>
                </div>
              </div>
              <div className={`mt-5 border-t pt-4 ${border}`}>
                <p className={`text-xs ${muted}`}>Workspace</p>
                <p className="mt-1 text-sm font-medium">Personal dashboard</p>
              </div>
            </Panel>
            <Panel darkMode={darkMode}>
              <SectionTitle title="About this dashboard" subtitle="Project information" darkMode={darkMode} />
              <div className="space-y-3 text-sm">
                <div className="flex justify-between gap-3">
                  <span className={muted}>Application</span><span>CurrencyWave</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className={muted}>Interface</span><span>React + Tailwind CSS</span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className={muted}>Animations</span><span>Motion</span>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </>
    );
  }

  const pageComponents = {
    Dashboard: <DashboardPage />,
    Rates: <RatesPage />,
    Convert: <><PageHeading /><ConverterPanel /></>,
    Charts: <ChartsPage />,
    Favorites: <FavoritesPage />,
    Transactions: <TransactionsPage />,
    News: <NewsPage />,
    Settings: <SettingsPage />,
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-[#0d0f12] text-white" : "bg-[#f5f7fa] text-slate-900"
    }`}>
      <div className="flex min-h-screen">
        <AnimatePresence>
          {menuOpen && (
            <motion.button
              type="button"
              aria-label="Close navigation"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside
          initial={false}
          animate={{ x: menuOpen ? 0 : undefined }}
          transition={{ type: "spring", stiffness: 320, damping: 32 }}
          className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r transition-colors duration-300 md:sticky md:top-0 md:z-20 md:h-screen md:translate-x-0 ${
            darkMode ? "border-white/[0.08] bg-[#111317]" : "border-slate-200 bg-white"
          } ${menuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
        >
          <div className={`flex h-[76px] items-center justify-between border-b px-5 ${border}`}>
            <button onClick={() => navigate("Dashboard")} className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-300 text-xl font-black text-slate-950">C</span>
              <span className="text-lg font-bold tracking-tight">
                Currency<span className="text-lime-500">Wave</span>
              </span>
            </button>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu" className={`md:hidden ${muted}`}>✕</button>
          </div>

          <div className="px-4 pt-7">
            <p className={`mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] ${muted}`}>
              Workspace
            </p>
            <nav className="space-y-1">
              {navigation.map((item) => {
                const active = activePage === item.label;
                return (
                  <motion.button
                    key={item.label}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => navigate(item.label)}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm transition-colors ${
                      active
                        ? "bg-lime-300 font-semibold text-slate-950"
                        : darkMode
                          ? "text-slate-400 hover:bg-white/5 hover:text-white"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                    }`}
                  >
                    <span className="w-5 text-center text-base">{item.icon}</span>
                    {item.label}
                    {active && <motion.span layoutId="activeNav" className="ml-auto h-1.5 w-1.5 rounded-full bg-current" />}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          <div className="mt-auto p-4">
            <div className={`rounded-2xl border p-4 ${border} ${
              darkMode ? "bg-[#171a20]" : "bg-slate-50"
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">Market status</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
              </div>
              <p className={`mt-2 text-xs ${muted}`}>Demo dashboard is ready.</p>
              <p className="mt-3 text-xs text-emerald-500">● Sample data</p>
            </div>

            <div className={`mt-4 flex items-center gap-3 rounded-xl p-2 ${
              darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
            }`}>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-200 px-1 text-[10px] font-bold text-violet-900">
                Habibi
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">Yalda Habibi</p>
                <p className={`text-xs ${muted}`}>Personal workspace</p>
              </div>
            </div>
          </div>
        </motion.aside>

        {/* Main content */}
        <main className="min-w-0 flex-1">
          <header className={`sticky top-0 z-30 flex h-[76px] items-center justify-between gap-3 border-b px-4 backdrop-blur-xl transition-colors duration-300 sm:px-6 lg:px-8 ${
            darkMode ? "border-white/[0.08] bg-[#0d0f12]/90" : "border-slate-200 bg-white/90"
          }`}>
            <div className="flex min-w-0 items-center gap-3">
              <button onClick={() => setMenuOpen(true)} aria-label="Open navigation" className={`rounded-xl border p-2.5 md:hidden ${border}`}>
                ☰
              </button>
              <div className="min-w-0">
                <h1 className="truncate text-base font-semibold sm:text-lg">{activePage}</h1>
                <p className={`hidden text-xs sm:block ${muted}`}>{pageTitles[activePage]}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <label className={`hidden items-center gap-2 rounded-xl border px-3 py-2 sm:flex ${border} ${
                darkMode ? "bg-[#15171c]" : "bg-white"
              }`}>
                <span className={muted}>⌕</span>
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    if (activePage !== "Rates") setActivePage("Rates");
                  }}
                  placeholder="Search rates..."
                  className="w-28 bg-transparent text-xs outline-none lg:w-40"
                />
              </label>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => setDarkMode((previous) => !previous)}
                aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
                className={`flex h-10 items-center gap-2 rounded-xl border px-3 transition-colors ${border} ${
                  darkMode ? "hover:bg-white/10" : "hover:bg-slate-100"
                }`}
              >
                <AnimatePresence mode="wait">
                  <motion.span
                    key={darkMode ? "sun" : "moon"}
                    initial={{ opacity: 0, rotate: -45, scale: 0.7 }}
                    animate={{ opacity: 1, rotate: 0, scale: 1 }}
                    exit={{ opacity: 0, rotate: 45, scale: 0.7 }}
                    className="text-lg"
                  >
                    {darkMode ? "☀️" : "🌙"}
                  </motion.span>
                </AnimatePresence>
                <span className="hidden text-xs font-medium sm:inline">
                  {darkMode ? "Light" : "Dark"}
                </span>
              </motion.button>

              <button
                onClick={() => navigate("Settings")}
                aria-label="Open settings"
                className={`flex h-10 w-10 items-center justify-center rounded-xl border ${border} ${
                  darkMode ? "hover:bg-white/5" : "hover:bg-slate-100"
                }`}
              >
                ⚙
              </button>
            </div>
          </header>

          <div className={`mx-auto max-w-[1600px] p-4 transition-all duration-300 sm:p-6 lg:p-8 ${
            settings.compactView ? "space-y-4" : "space-y-7"
          }`}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activePage}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.22 }}
                className="space-y-5"
              >
                {pageComponents[activePage] || <DashboardPage />}
              </motion.div>
            </AnimatePresence>

            {settings.marketUpdates && activePage === "Dashboard" && (
              <Panel darkMode={darkMode}>
                <SectionTitle title="News & insights" subtitle="Market topics worth following" darkMode={darkMode}
                  action={<button onClick={() => navigate("News")} className="text-xs font-semibold text-lime-600 dark:text-lime-300">Explore news →</button>}
                />
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {news.map((item) => (
                    <div key={item.title} className={`rounded-xl border p-4 ${border} ${
                      darkMode ? "bg-white/[0.02]" : "bg-slate-50"
                    }`}>
                      <span className="text-2xl">{item.icon}</span>
                      <p className={`mt-3 text-[10px] font-semibold tracking-wider ${muted}`}>{item.category}</p>
                      <h3 className="mt-2 text-sm font-semibold leading-5">{item.title}</h3>
                      <p className={`mt-3 text-xs ${muted}`}>{item.time}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            )}

            <footer className={`flex flex-col justify-between gap-3 border-t pt-5 text-xs sm:flex-row sm:items-center ${border} ${muted}`}>
              <p>© 2026 <span className="font-semibold">Yalda Habibi</span>. CurrencyWave dashboard.</p>
              <p>Built with React, Tailwind CSS & Motion.</p>
            </footer>
          </div>
        </main>
      </div>
    </div>
  );
}