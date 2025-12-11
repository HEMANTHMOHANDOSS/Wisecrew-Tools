import React, { useState, useEffect } from 'react';
import { Button, Input, Select, ToolLayout, ResultCard, useCurrency, CurrencySelector, TabNavigation, useTheme } from '../components/SharedUI';
import { 
  Calculator, DollarSign, TrendingUp, Users, Calendar, 
  RefreshCw, PieChart, Briefcase, AlertCircle, Target, 
  Clock, Layers, Percent, Download, Trash2, Filter,
  FileText, ArrowRightLeft, Coins
} from 'lucide-react';
import { 
  LineChart, Line, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { Expense } from '../types';
import jsPDF from 'jspdf';

const FinancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('expense');
  const { currency, setCurrency, formatAmount, supportedCurrencies } = useCurrency();

  const tabs = [
    { id: 'expense', label: 'Expense Tracker', icon: DollarSign },
    { id: 'sip', label: 'SIP Calculator', icon: TrendingUp },
    { id: 'lumpsum', label: 'Lumpsum', icon: Coins },
    { id: 'emi', label: 'EMI Calculator', icon: Calculator },
    { id: 'compare-loan', label: 'Loan Compare', icon: ArrowRightLeft },
    { id: 'invoice', label: 'GST Invoice', icon: FileText },
    { id: 'salary-slip', label: 'Salary Slip', icon: FileText },
    { id: 'emi-split', label: 'EMI Splitter', icon: Users },
    { id: 'simple-interest', label: 'Simple Interest', icon: Percent },
    { id: 'compound-interest', label: 'Compound Interest', icon: Layers },
    { id: 'savings-day', label: 'Day Savings', icon: Calendar },
    { id: 'gst', label: 'GST', icon: PieChart },
    { id: 'currency', label: 'Converter', icon: RefreshCw },
    { id: 'tax', label: 'Tax Estimator', icon: Briefcase },
    { id: 'foreclosure', label: 'Foreclosure', icon: AlertCircle },
    { id: 'savings-goal', label: 'Savings Goal', icon: Target },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative">
      
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        rightAction={
          <div className="flex items-center gap-2 my-2">
             <CurrencySelector current={currency} onChange={setCurrency} options={supportedCurrencies} />
          </div>
        }
      />
      
      {/* Currency Info Toast */}
      <div className="flex items-center justify-end mt-4 mb-6 opacity-80">
        <p className="text-[11px] font-medium text-gray-400 light:text-slate-500 flex items-center gap-1.5 bg-white/5 light:bg-white px-3 py-1.5 rounded-full border border-white/5 light:border-slate-200">
          <RefreshCw className="w-3 h-3" /> Currency auto-detected. Change anytime.
        </p>
      </div>

      <div className="min-h-[500px]">
        {activeTab === 'expense' && <ExpenseTracker currency={currency} format={formatAmount} />}
        {activeTab === 'lumpsum' && <LumpsumCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'sip' && <SIPCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'emi' && <EMICalculatorSection format={formatAmount} currency={currency} />}
        {activeTab === 'compare-loan' && <LoanComparison format={formatAmount} />}
        {activeTab === 'invoice' && <GSTInvoiceGenerator currency={currency} />}
        {activeTab === 'salary-slip' && <SalarySlipGenerator currency={currency} format={formatAmount} />}
        {activeTab === 'emi-split' && <EMISplitter format={formatAmount} currency={currency} />}
        {activeTab === 'simple-interest' && <SimpleInterestCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'compound-interest' && <CompoundInterestCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'savings-day' && <DayWiseSavings format={formatAmount} currency={currency} />}
        {activeTab === 'gst' && <GSTCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'currency' && <CurrencyConverter defaultFrom={currency} format={formatAmount} />}
        {activeTab === 'tax' && <TaxEstimator format={formatAmount} currency={currency} />}
        {activeTab === 'foreclosure' && <ForeclosureCalculator format={formatAmount} currency={currency} />}
        {activeTab === 'savings-goal' && <SavingsGoalCalculator format={formatAmount} currency={currency} />}
      </div>
    </div>
  );
};

// --- Components ---

interface ToolProps {
  format: (n: number) => string;
  currency?: string;
}

const LumpsumCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [investment, setInvestment] = useState(100000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(5);
  
  const total = investment * Math.pow((1 + rate/100), years);
  const returns = total - investment;

  return (
    <ToolLayout id="lumpsum" name="Lumpsum Calculator" description="Calculate returns for one-time investments." icon={Coins} result={format(total)}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Input label="Investment Amount" type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
             <Input label="Expected Return (%)" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} />
             <Input label="Time Period (Years)" type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
          </div>
          <div className="space-y-4">
             <ResultCard label="Estimated Returns" value={format(returns)} color="green" />
             <ResultCard label="Total Value" value={format(total)} />
          </div>
       </div>
    </ToolLayout>
  )
}

const SalarySlipGenerator: React.FC<{currency: string, format: any}> = ({ currency, format }) => {
  const [basic, setBasic] = useState(50000);
  const [hra, setHra] = useState(20000);
  const [da, setDa] = useState(5000);
  const [pf, setPf] = useState(3000);
  const [tax, setTax] = useState(2000);

  const earnings = basic + hra + da;
  const deductions = pf + tax;
  const net = earnings - deductions;

  const download = () => {
     const doc = new jsPDF();
     doc.setFontSize(20);
     doc.text("Salary Slip", 105, 20, { align: 'center' });
     doc.setFontSize(12);
     doc.text(`Basic: ${basic}`, 20, 40);
     doc.text(`HRA: ${hra}`, 20, 50);
     doc.text(`DA: ${da}`, 20, 60);
     doc.text(`Gross Earnings: ${earnings}`, 20, 75);
     
     doc.text(`PF: ${pf}`, 120, 40);
     doc.text(`Tax: ${tax}`, 120, 50);
     doc.text(`Total Deductions: ${deductions}`, 120, 75);
     
     doc.line(20, 85, 190, 85);
     doc.setFontSize(16);
     doc.text(`Net Salary: ${net}`, 20, 100);
     doc.save("salary_slip.pdf");
  }

  return (
    <ToolLayout id="salary-slip" name="Salary Slip Generator" description="Generate simple salary slips." icon={FileText}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <h4 className="font-bold text-green-400">Earnings</h4>
             <Input label="Basic Salary" type="number" value={basic} onChange={e => setBasic(Number(e.target.value))} />
             <Input label="HRA" type="number" value={hra} onChange={e => setHra(Number(e.target.value))} />
             <Input label="Allowances" type="number" value={da} onChange={e => setDa(Number(e.target.value))} />
             
             <h4 className="font-bold text-red-400 pt-4">Deductions</h4>
             <Input label="PF/Provident Fund" type="number" value={pf} onChange={e => setPf(Number(e.target.value))} />
             <Input label="Professional Tax" type="number" value={tax} onChange={e => setTax(Number(e.target.value))} />
             
             <Button onClick={download} className="w-full">Download PDF</Button>
          </div>
          <div className="glass-panel p-6 rounded-xl space-y-4">
             <ResultCard label="Gross Earnings" value={format(earnings)} color="green" />
             <ResultCard label="Total Deductions" value={format(deductions)} color="red" />
             <div className="p-4 bg-white/10 rounded-xl border border-white/20 text-center">
                <p>Net Salary</p>
                <p className="text-3xl font-bold">{format(net)}</p>
             </div>
          </div>
       </div>
    </ToolLayout>
  )
}

const LoanComparison: React.FC<ToolProps> = ({ format }) => {
  const [loan1, setLoan1] = useState({ p: 1000000, r: 8.5, n: 5 });
  const [loan2, setLoan2] = useState({ p: 1000000, r: 9.0, n: 5 });

  const calculate = (l: any) => {
    const r = l.r / 12 / 100;
    const n = l.n * 12;
    const emi = (l.p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || 0;
    const total = emi * n;
    return { emi, total };
  };

  const res1 = calculate(loan1);
  const res2 = calculate(loan2);
  const diff = Math.abs(res1.total - res2.total);

  return (
    <ToolLayout id="loan-compare" name="Loan Comparison" description="Compare two loan offers side-by-side." icon={ArrowRightLeft}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-6 rounded-xl border-l-4 border-blue-500">
             <h3 className="text-xl font-bold mb-4 text-blue-400">Loan Offer A</h3>
             <div className="space-y-2">
                <Input label="Principal" type="number" value={loan1.p} onChange={e => setLoan1({...loan1, p: Number(e.target.value)})} />
                <Input label="Rate (%)" type="number" value={loan1.r} onChange={e => setLoan1({...loan1, r: Number(e.target.value)})} />
                <Input label="Years" type="number" value={loan1.n} onChange={e => setLoan1({...loan1, n: Number(e.target.value)})} />
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p>EMI: <span className="font-bold text-white">{format(res1.emi)}</span></p>
                   <p>Total: <span className="font-bold text-white">{format(res1.total)}</span></p>
                </div>
             </div>
          </div>
          <div className="glass-panel p-6 rounded-xl border-l-4 border-purple-500">
             <h3 className="text-xl font-bold mb-4 text-purple-400">Loan Offer B</h3>
             <div className="space-y-2">
                <Input label="Principal" type="number" value={loan2.p} onChange={e => setLoan2({...loan2, p: Number(e.target.value)})} />
                <Input label="Rate (%)" type="number" value={loan2.r} onChange={e => setLoan2({...loan2, r: Number(e.target.value)})} />
                <Input label="Years" type="number" value={loan2.n} onChange={e => setLoan2({...loan2, n: Number(e.target.value)})} />
                <div className="mt-4 pt-4 border-t border-white/10">
                   <p>EMI: <span className="font-bold text-white">{format(res2.emi)}</span></p>
                   <p>Total: <span className="font-bold text-white">{format(res2.total)}</span></p>
                </div>
             </div>
          </div>
       </div>
       <div className="text-center p-4 bg-green-500/10 rounded-xl mt-4 border border-green-500/20">
          <p className="text-green-400 font-bold">Savings: {format(diff)} by choosing the better option.</p>
       </div>
    </ToolLayout>
  )
};

const GSTInvoiceGenerator: React.FC<{currency: string}> = ({ currency }) => {
  const [client, setClient] = useState('');
  const [amount, setAmount] = useState(1000);
  const [gst, setGst] = useState(18);

  const tax = amount * (gst/100);
  const total = amount + tax;

  const download = () => {
    const doc = new jsPDF();
    doc.text("INVOICE", 10, 20);
    doc.text(`Client: ${client}`, 10, 40);
    doc.text(`Amount: ${amount}`, 10, 50);
    doc.text(`GST (${gst}%): ${tax}`, 10, 60);
    doc.text(`Total: ${total}`, 10, 70);
    doc.save("invoice.pdf");
  };

  return (
    <ToolLayout id="invoice" name="GST Invoice Generator" description="Create simple invoices." icon={FileText}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Input label="Client Name" value={client} onChange={e => setClient(e.target.value)} />
             <Input label="Taxable Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
             <Input label="GST Rate (%)" type="number" value={gst} onChange={e => setGst(Number(e.target.value))} />
             <Button onClick={download} className="w-full">Download PDF</Button>
          </div>
          <div className="glass-panel p-8 bg-white text-black rounded-sm font-mono text-sm">
             <h2 className="text-2xl font-bold mb-4">INVOICE</h2>
             <p>Billed To: {client || 'Client Name'}</p>
             <hr className="border-black my-4" />
             <div className="flex justify-between"><span>Subtotal:</span><span>{amount}</span></div>
             <div className="flex justify-between"><span>GST ({gst}%):</span><span>{tax.toFixed(2)}</span></div>
             <div className="flex justify-between font-bold text-lg mt-2 border-t border-black pt-2"><span>Total:</span><span>{total.toFixed(2)} {currency}</span></div>
          </div>
       </div>
    </ToolLayout>
  )
}

const SIPCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [investment, setInvestment] = useState(5000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(10);
  const i = rate / 100 / 12;
  const n = years * 12;
  const invested = investment * n;
  const totalValue = investment * ((Math.pow(1 + i, n) - 1) / i) * (1 + i);
  const returns = totalValue - invested;
  const reset = () => { setInvestment(5000); setRate(12); setYears(10); };
  return (
    <ToolLayout id="sip" name="SIP Calculator" description="Estimate returns on your Systematic Investment Plan." icon={TrendingUp} result={format(totalValue)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input label={`Monthly Investment (${currency})`} type="number" value={investment} onChange={e => setInvestment(Number(e.target.value))} />
          <Input label="Expected Return Rate (%)" type="number" value={rate} onChange={e => setRate(Number(e.target.value))} />
          <Input label="Time Period (Years)" type="number" value={years} onChange={e => setYears(Number(e.target.value))} />
        </div>
        <div className="space-y-4">
          <ResultCard label="Invested Amount" value={format(invested)} />
          <ResultCard label="Estimated Returns" value={format(returns)} color="green" />
          <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 bg-cyan-900/10 text-center">
             <p className="text-cyan-400 text-sm uppercase mb-1">Total Maturity Value</p>
             <h2 className="text-4xl font-bold text-white">{format(totalValue)}</h2>
          </div>
        </div>
      </div>
    </ToolLayout>
  )
}

const ExpenseTracker: React.FC<{ currency: string; format: (n: number) => string }> = ({ currency, format }) => {
  const [expenses, setExpenses] = useState<Expense[]>(() => {
    const saved = localStorage.getItem('expenses');
    return saved ? JSON.parse(saved) : [];
  });
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [filter, setFilter] = useState('All');
  const [isRecurring, setIsRecurring] = useState(false);
  
  const { theme } = useTheme();

  useEffect(() => localStorage.setItem('expenses', JSON.stringify(expenses)), [expenses]);
  const addExpense = () => {
    if (!title || !amount) return;
    const newExp: Expense = { id: Date.now().toString(), title, amount: Number(amount), category, type, date: new Date().toLocaleDateString(), isRecurring };
    setExpenses([newExp, ...expenses]);
    setTitle(''); setAmount(''); setIsRecurring(false);
  };
  const removeExpense = (id: string) => { setExpenses(expenses.filter(e => e.id !== id)); };
  const reset = () => { if(window.confirm("Clear all expenses?")) setExpenses([]); };
  const exportCSV = () => {
    const csvContent = "data:text/csv;charset=utf-8," + `Title,Amount (${currency}),Type,Category,Date\n` + expenses.map(e => `${e.title},${e.amount},${e.type},${e.category},${e.date}`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `expenses_${currency}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link);
  };
  const totalBalance = expenses.reduce((acc, curr) => curr.type === 'income' ? acc + curr.amount : acc - curr.amount, 0);
  const filteredExpenses = filter === 'All' ? expenses : expenses.filter(e => e.category === filter);
  
  const chartTooltipStyle = theme === 'light' 
    ? { backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', color: '#1E293B', borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }
    : { backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff' };

  return (
    <ToolLayout id="expense-tracker" name="Expense Tracker" description="Manage your daily finances." icon={DollarSign} onReset={reset}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <div className="glass-panel p-6 rounded-xl text-center mb-6 bg-gradient-to-br from-cyan-900/40 to-blue-900/40">
              <p className="text-gray-400 text-sm uppercase tracking-wide">Total Balance</p>
              <h2 className={`text-4xl font-bold mt-2 ${totalBalance >= 0 ? 'text-cyan-400' : 'text-red-400'}`}>{format(totalBalance)}</h2>
           </div>
           <div className="space-y-3">
             <div className="flex gap-2">
               <Button 
                  className={`flex-1 expense-type-btn income ${type === 'income' ? 'active ring-2 ring-cyan-400' : 'opacity-60'}`} 
                  onClick={() => setType('income')}
               >
                 Income
               </Button>
               <Button 
                  className={`flex-1 expense-type-btn expense ${type === 'expense' ? 'active ring-2 ring-red-400' : 'opacity-60'}`} 
                  variant="danger" 
                  onClick={() => setType('expense')}
               >
                 Expense
               </Button>
             </div>
             <Input placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
             <Input placeholder={`Amount (${currency})`} type="number" value={amount} onChange={e => setAmount(e.target.value)} />
             <div className="flex gap-2">
               <div className="flex-1">
                 <Select value={category} onChange={e => setCategory(e.target.value)}>{['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Salary', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}</Select>
               </div>
               <button onClick={() => setIsRecurring(!isRecurring)} className={`px-3 rounded-xl border ${isRecurring ? 'bg-cyan-600 border-cyan-400 text-white' : 'border-white/10 text-gray-400'}`} title="Mark as Recurring Monthly"><RefreshCw className="w-4 h-4" /></button>
             </div>
             <Button onClick={addExpense} className="w-full">Add Transaction</Button>
             <Button onClick={exportCSV} variant="secondary" className="w-full text-sm"><Download className="w-4 h-4" /> Export CSV</Button>
           </div>
        </div>
        <div className="lg:col-span-2">
           <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white">Analytics</h3>
             <div className="flex items-center gap-2">
               <Filter className="w-4 h-4 text-gray-400" />
               <select className="bg-transparent text-sm text-gray-300 outline-none cursor-pointer" value={filter} onChange={e => setFilter(e.target.value)}><option value="All">All Categories</option>{['Food', 'Transport', 'Utilities', 'Entertainment', 'Health', 'Salary', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}</select>
             </div>
           </div>
           <div className="h-[250px] w-full mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={expenses.slice().reverse()}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={10} tickFormatter={(val) => val.slice(0,5)} />
                  <YAxis stroke="#9ca3af" fontSize={10} tickFormatter={(val) => `${val}`} />
                  <RechartsTooltip formatter={(value: number) => [format(value), 'Amount']} contentStyle={chartTooltipStyle} />
                  <Line type="monotone" dataKey="amount" stroke="#38bdf8" strokeWidth={2} dot={{r: 3, fill:'#38bdf8'}} />
                </LineChart>
              </ResponsiveContainer>
           </div>
           <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-2">
             {filteredExpenses.length === 0 && <p className="text-center text-gray-500 py-8">No transactions yet.</p>}
             {filteredExpenses.map(expense => (
               <div key={expense.id} className="glass-panel p-4 rounded-xl flex justify-between items-center group hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                     <div className={`p-2 rounded-lg ${expense.type === 'income' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                        {expense.type === 'income' ? <TrendingUp className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                     </div>
                     <div>
                        <p className="font-bold text-white flex items-center gap-2">{expense.title}{expense.isRecurring && <RefreshCw className="w-3 h-3 text-cyan-400" />}</p>
                        <p className="text-xs text-gray-500">{expense.category} • {expense.date}</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className={`font-bold ${expense.type === 'income' ? 'text-green-400' : 'text-red-400'}`}>{expense.type === 'income' ? '+' : '-'}{format(expense.amount)}</span>
                     <button onClick={() => removeExpense(expense.id)} className="text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
                  </div>
               </div>
             ))}
           </div>
        </div>
      </div>
    </ToolLayout>
  )
}

const EMICalculatorSection: React.FC<ToolProps> = ({ format, currency }) => {
  const [loanAmount, setLoanAmount] = useState(1000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(5);
  const r = interestRate / 12 / 100;
  const n = tenure * 12;
  const emi = (loanAmount * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) || 0;
  const totalPayment = emi * n;
  const totalInterest = totalPayment - loanAmount;
  const reset = () => { setLoanAmount(1000000); setInterestRate(8.5); setTenure(5); };
  return (
    <ToolLayout id="emi" name="EMI Calculator" description="Calculate monthly loan repayments." icon={Calculator} result={format(emi)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <Input label={`Loan Amount (${currency})`} type="number" value={loanAmount} onChange={e => setLoanAmount(Number(e.target.value))} />
            <Input label="Interest Rate (%)" type="number" value={interestRate} onChange={e => setInterestRate(Number(e.target.value))} />
            <Input label="Tenure (Years)" type="number" value={tenure} onChange={e => setTenure(Number(e.target.value))} />
         </div>
         <div className="space-y-4">
            <div className="glass-panel p-8 rounded-xl flex flex-col items-center justify-center text-center border border-cyan-500/30 bg-cyan-900/10">
               <p className="text-gray-400 mb-2 uppercase text-xs tracking-widest">Monthly EMI</p>
               <h2 className="text-5xl font-bold text-cyan-400 mb-4">{format(emi)}</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
               <ResultCard label="Total Interest" value={format(totalInterest)} color="orange" />
               <ResultCard label="Total Amount" value={format(totalPayment)} color="blue" />
            </div>
         </div>
      </div>
    </ToolLayout>
  );
};

const EMISplitter: React.FC<ToolProps> = ({ format, currency }) => {
  const [amount, setAmount] = useState(10000);
  const [people, setPeople] = useState(2);
  const share = amount / people;
  const reset = () => { setAmount(10000); setPeople(2); };
  return (
    <ToolLayout id="emi-split" name="EMI Splitter" description="Split payments equally among friends." icon={Users} result={format(share)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
           <Input label={`Total Amount (${currency})`} type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
           <Input label="Number of People" type="number" value={people} onChange={e => setPeople(Number(e.target.value))} />
        </div>
        <div className="glass-panel p-6 rounded-xl flex items-center justify-center text-center">
           <div><p className="text-gray-400">Each Person Pays</p><p className="text-5xl font-bold text-cyan-400 mt-2">{format(share)}</p></div>
        </div>
      </div>
    </ToolLayout>
  );
};

const SimpleInterestCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [p, setP] = useState(10000);
  const [r, setR] = useState(5);
  const [t, setT] = useState(2);
  const si = (p * r * t) / 100;
  const total = p + si;
  const reset = () => { setP(10000); setR(5); setT(2); };
  return (
    <ToolLayout id="simple-interest" name="Simple Interest" description="Calculate simple interest." icon={Percent} result={format(si)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <Input label={`Principal (${currency})`} type="number" value={p} onChange={e => setP(Number(e.target.value))} />
            <Input label="Rate (%)" type="number" value={r} onChange={e => setR(Number(e.target.value))} />
            <Input label="Time (Years)" type="number" value={t} onChange={e => setT(Number(e.target.value))} />
         </div>
         <div className="space-y-4">
            <ResultCard label="Total Interest" value={format(si)} color="green" />
            <ResultCard label="Final Amount" value={format(total)} />
         </div>
      </div>
    </ToolLayout>
  )
};

const CompoundInterestCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [p, setP] = useState(10000);
  const [r, setR] = useState(5);
  const [t, setT] = useState(5);
  const [n, setN] = useState(12);
  const amount = p * Math.pow((1 + (r / (100 * n))), n * t);
  const interest = amount - p;
  const reset = () => { setP(10000); setR(5); setT(5); setN(12); };
  return (
    <ToolLayout id="compound-interest" name="Compound Interest" description="Calculate compound interest with frequency." icon={Layers} result={format(interest)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <div className="space-y-4">
            <Input label={`Principal (${currency})`} type="number" value={p} onChange={e => setP(Number(e.target.value))} />
            <Input label="Rate (%)" type="number" value={r} onChange={e => setR(Number(e.target.value))} />
            <Input label="Time (Years)" type="number" value={t} onChange={e => setT(Number(e.target.value))} />
            <Select label="Frequency" value={n} onChange={e => setN(Number(e.target.value))}><option value={1}>Annually</option><option value={2}>Semi-Annually</option><option value={4}>Quarterly</option><option value={12}>Monthly</option></Select>
         </div>
         <div className="space-y-4">
            <ResultCard label="Total Interest" value={format(interest)} color="green" />
            <ResultCard label="Maturity Value" value={format(amount)} />
         </div>
       </div>
    </ToolLayout>
  )
};

const DayWiseSavings: React.FC<ToolProps> = ({ format, currency }) => {
  const [savings, setSavings] = useState<{date: string, amount: number}[]>(() => {
    const s = localStorage.getItem('daySavings'); return s ? JSON.parse(s) : [];
  });
  const [amount, setAmount] = useState('');
  useEffect(() => localStorage.setItem('daySavings', JSON.stringify(savings)), [savings]);
  const addSaving = () => { if(!amount) return; setSavings([...savings, { date: new Date().toISOString().split('T')[0], amount: Number(amount) }]); setAmount(''); };
  const total = savings.reduce((acc, curr) => acc + curr.amount, 0);
  const reset = () => { if(confirm('Reset all savings history?')) setSavings([]); };
  return (
    <ToolLayout id="day-savings" name="Day Wise Savings" description="Track your daily savings streak." icon={Calendar} result={format(total)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <div className="flex gap-2">
                <Input type="number" placeholder={`Amount saved today (${currency})`} value={amount} onChange={e => setAmount(e.target.value)} />
                <Button onClick={addSaving}>Log</Button>
             </div>
             <div className="max-h-60 overflow-y-auto custom-scrollbar space-y-2">
               {savings.slice().reverse().map((s, i) => (
                 <div key={i} className="flex justify-between p-3 glass-panel rounded-lg"><span className="text-gray-400">{s.date}</span><span className="text-green-400 font-bold">+{format(s.amount)}</span></div>
               ))}
             </div>
          </div>
          <div className="glass-panel p-6 rounded-xl flex flex-col justify-center text-center"><p className="text-gray-400">Total Saved</p><h2 className="text-4xl font-bold text-cyan-400 mt-2">{format(total)}</h2></div>
       </div>
    </ToolLayout>
  )
};

const GSTCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [amount, setAmount] = useState(1000);
  const [rate, setRate] = useState(18);
  const [type, setType] = useState('exclusive');
  const gstAmt = type === 'exclusive' ? (amount * rate) / 100 : amount - (amount * (100 / (100 + rate)));
  const total = type === 'exclusive' ? amount + gstAmt : amount;
  const net = type === 'exclusive' ? amount : amount - gstAmt;
  const reset = () => { setAmount(1000); setRate(18); };
  return (
    <ToolLayout id="gst" name="GST Calculator" description="Calculate tax inclusive/exclusive amounts." icon={PieChart} result={format(gstAmt)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Input label={`Amount (${currency})`} type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
             <div className="space-y-2">
               <label className="text-sm text-gray-300">GST Rate</label>
               <div className="flex gap-2">{[5, 12, 18, 28].map(r => (<button key={r} onClick={() => setRate(r)} className={`tab-btn flex-1 py-2 rounded-lg border ${rate === r ? 'active-tab bg-cyan-600 border-cyan-400' : 'border-white/10 hover:bg-white/5'}`}>{r}%</button>))}</div>
             </div>
             <div className="flex gap-2"><button onClick={() => setType('exclusive')} className={`tab-btn flex-1 py-2 rounded-lg ${type === 'exclusive' ? 'active-tab bg-cyan-600' : 'glass-panel'}`}>Exclusive</button><button onClick={() => setType('inclusive')} className={`tab-btn flex-1 py-2 rounded-lg ${type === 'inclusive' ? 'active-tab bg-cyan-600' : 'glass-panel'}`}>Inclusive</button></div>
          </div>
          <div className="space-y-4"><ResultCard label="Net Amount" value={format(net)} /><ResultCard label={`GST (${rate}%)`} value={format(gstAmt)} color="red" /><ResultCard label="Total" value={format(total)} color="green" /></div>
       </div>
    </ToolLayout>
  )
};

const CurrencyConverter: React.FC<{ defaultFrom: string; format: (n: number) => string }> = ({ defaultFrom, format }) => {
  const [amount, setAmount] = useState(1);
  const [from, setFrom] = useState('USD'); 
  const [to, setTo] = useState('EUR');
  useEffect(() => { if(defaultFrom) setFrom(defaultFrom); }, [defaultFrom]);
  const rates: any = { USD: 1, EUR: 0.92, GBP: 0.79, INR: 83.5, JPY: 150.2, AUD: 1.52, CAD: 1.35, AED: 3.67, SGD: 1.34 };
  const result = (amount / rates[from]) * rates[to];
  const reset = () => { setAmount(1); setFrom(defaultFrom); setTo('EUR'); };
  return (
    <ToolLayout id="currency" name="Currency Converter" description="Convert between major world currencies." icon={RefreshCw} result={result.toFixed(2)} onReset={reset}>
       <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center">
          <Input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          <div className="text-center text-gray-400">in</div>
          <div className="grid grid-cols-3 gap-4 col-span-1 md:col-span-3">
             <Select value={from} onChange={e => setFrom(e.target.value)} label="From">{Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}</Select>
             <div className="flex items-end justify-center pb-3 text-cyan-400 font-bold text-2xl">→</div>
             <Select value={to} onChange={e => setTo(e.target.value)} label="To">{Object.keys(rates).map(c => <option key={c} value={c}>{c}</option>)}</Select>
          </div>
       </div>
       <div className="text-center mt-6 p-8 glass-panel rounded-xl"><p className="text-5xl font-bold text-white mb-2">{new Intl.NumberFormat('en-US', { style: 'currency', currency: to }).format(result)}</p><p className="text-sm text-gray-400">1 {from} = {(rates[to] / rates[from]).toFixed(4)} {to}</p></div>
    </ToolLayout>
  )
}

const TaxEstimator: React.FC<ToolProps> = ({ format, currency }) => {
  const [income, setIncome] = useState(500000);
  const tax = income > 250000 ? (income - 250000) * 0.05 : 0; 
  const reset = () => setIncome(500000);
  return (
    <ToolLayout id="tax" name="Tax Estimator" description="Simple tax liability estimation." icon={Briefcase} result={format(tax)} onReset={reset}>
       <div className="space-y-4 max-w-lg mx-auto"><Input label={`Annual Income (${currency})`} type="number" value={income} onChange={e => setIncome(Number(e.target.value))} /><ResultCard label="Estimated Tax Liability" value={format(tax)} color="red" /></div>
    </ToolLayout>
  )
}

const ForeclosureCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [outstanding, setOutstanding] = useState(500000);
  const [penalty, setPenalty] = useState(2); 
  const total = outstanding + (outstanding * penalty / 100);
  const reset = () => { setOutstanding(500000); setPenalty(2); };
  return (
    <ToolLayout id="foreclosure" name="Foreclosure Calculator" description="Calculate amount needed to close loan early." icon={AlertCircle} result={format(total)} onReset={reset}>
       <div className="space-y-4 max-w-lg mx-auto"><Input label={`Outstanding Principal (${currency})`} type="number" value={outstanding} onChange={e => setOutstanding(Number(e.target.value))} /><Input label="Foreclosure Penalty (%)" type="number" value={penalty} onChange={e => setPenalty(Number(e.target.value))} /><div className="glass-panel p-6 rounded-xl text-center"><p className="text-gray-400">Total Payable Amount</p><h2 className="text-3xl font-bold text-cyan-400 mt-2">{format(total)}</h2></div></div>
    </ToolLayout>
  )
}

const SavingsGoalCalculator: React.FC<ToolProps> = ({ format, currency }) => {
  const [goal, setGoal] = useState(100000);
  const [months, setMonths] = useState(12);
  const monthly = goal / months;
  const reset = () => { setGoal(100000); setMonths(12); };
  return (
    <ToolLayout id="savings-goal" name="Savings Goal" description="How much to save monthly to reach your target?" icon={Target} result={format(monthly)} onReset={reset}>
       <div className="space-y-4 max-w-lg mx-auto"><Input label={`Target Amount (${currency})`} type="number" value={goal} onChange={e => setGoal(Number(e.target.value))} /><Input label="Months to achieve" type="number" value={months} onChange={e => setMonths(Number(e.target.value))} /><div className="glass-panel p-6 rounded-xl text-center border-b-4 border-green-500"><p className="text-gray-400">Save Monthly</p><h2 className="text-3xl font-bold text-green-400 mt-2">{format(monthly)}</h2></div></div>
    </ToolLayout>
  )
}

export default FinancePage;