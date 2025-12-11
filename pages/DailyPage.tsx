
import React, { useState } from 'react';
import { Input, ToolLayout, TabNavigation, ResultCard } from '../components/SharedUI';
import { User, Activity, Users, Hourglass, Calendar, Percent, Tag } from 'lucide-react';

const DailyPage = () => {
  const [activeTab, setActiveTab] = useState('age');
  
  const tabs = [
    { id: 'age', label: 'Age Calculator', icon: User },
    { id: 'date', label: 'Date Calc', icon: Calendar },
    { id: 'percent', label: 'Percentage', icon: Percent },
    { id: 'discount', label: 'Discount', icon: Tag },
    { id: 'bmi', label: 'BMI Calculator', icon: Activity },
    { id: 'bill', label: 'Split Bill', icon: Users },
    { id: 'life', label: 'Life Progress', icon: Hourglass },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation 
         tabs={tabs} 
         activeTab={activeTab} 
         onTabChange={setActiveTab} 
       />

      <div className="max-w-4xl mx-auto">
        {activeTab === 'age' && <AgeCalculator />}
        {activeTab === 'date' && <DateCalculator />}
        {activeTab === 'percent' && <PercentageCalculator />}
        {activeTab === 'discount' && <DiscountCalculator />}
        {activeTab === 'bmi' && <BMICalculator />}
        {activeTab === 'bill' && <BillSplitter />}
        {activeTab === 'life' && <LifeProgress />}
      </div>
    </div>
  );
};

const DateCalculator = () => {
  const [d1, setD1] = useState('');
  const [d2, setD2] = useState('');
  
  const diffTime = Math.abs(new Date(d2).getTime() - new Date(d1).getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 0;

  return (
    <ToolLayout id="date-calc" name="Date Difference" description="Calculate days between two dates." icon={Calendar} result={diffDays + ' days'}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
             <Input type="date" label="Start Date" value={d1} onChange={e => setD1(e.target.value)} />
             <Input type="date" label="End Date" value={d2} onChange={e => setD2(e.target.value)} />
          </div>
          <ResultCard label="Difference" value={`${diffDays} Days`} />
       </div>
    </ToolLayout>
  )
}

const PercentageCalculator = () => {
  const [a, setA] = useState(50);
  const [b, setB] = useState(100);
  const res1 = (a / 100) * b;
  const res2 = (a / b) * 100;

  return (
    <ToolLayout id="percent-calc" name="Percentage Calculator" description="Simple percentage calculations." icon={Percent}>
       <div className="space-y-8">
          <div className="glass-panel p-6 rounded-xl space-y-4">
             <h3 className="font-bold">What is {a}% of {b}?</h3>
             <div className="flex gap-4 items-center">
                <Input type="number" value={a} onChange={e => setA(Number(e.target.value))} />
                <span>% of</span>
                <Input type="number" value={b} onChange={e => setB(Number(e.target.value))} />
             </div>
             <p className="text-2xl font-bold text-cyan-400">= {res1.toFixed(2)}</p>
          </div>
          <div className="glass-panel p-6 rounded-xl space-y-4">
             <h3 className="font-bold">{a} is what % of {b}?</h3>
             <p className="text-2xl font-bold text-cyan-400">= {res2.toFixed(2)}%</p>
          </div>
       </div>
    </ToolLayout>
  )
}

const DiscountCalculator = () => {
  const [price, setPrice] = useState(1000);
  const [disc, setDisc] = useState(20);
  const final = price - (price * disc / 100);
  const saved = price - final;

  return (
    <ToolLayout id="discount-calc" name="Discount Calculator" description="Calculate sale price." icon={Tag} result={final}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Input label="Original Price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
             <Input label="Discount (%)" type="number" value={disc} onChange={e => setDisc(Number(e.target.value))} />
          </div>
          <div className="space-y-4">
             <ResultCard label="Final Price" value={final.toFixed(2)} />
             <ResultCard label="You Save" value={saved.toFixed(2)} color="green" />
          </div>
       </div>
    </ToolLayout>
  )
}

const AgeCalculator = () => {
  const [birthDate, setBirthDate] = useState('');
  const [age, setAge] = useState<any>(null);

  React.useEffect(() => {
    if(!birthDate) return;
    const birth = new Date(birthDate);
    const now = new Date();
    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (months < 0 || (months === 0 && days < 0)) {
      years--;
      months += 12;
    }
    if (days < 0) {
      const prevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 0);
      days += prevMonth.getDate();
      months--;
    }
    setAge({ years, months, days });
  }, [birthDate]);

  const reset = () => setBirthDate('');

  return (
    <ToolLayout id="age-calc" name="Age Calculator" description="Calculate your exact age in years, months, and days." icon={User} result={age ? `${age.years} yrs` : ''} onReset={reset}>
      <div className="max-w-md mx-auto space-y-6">
        <Input type="date" label="Date of Birth" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
        {age ? (
          <div className="glass-panel p-6 rounded-xl text-center border-t-4 border-cyan-500">
             <p className="text-5xl font-bold text-white mb-2">{age.years}</p>
             <p className="text-cyan-400 uppercase tracking-widest text-sm mb-4">Years Old</p>
             <div className="flex justify-center gap-6 text-gray-400 text-sm border-t border-white/10 pt-4">
               <span>{age.months} Months</span>
               <span>{age.days} Days</span>
             </div>
          </div>
        ) : (
          <div className="text-center text-gray-500 py-8">Select a date to see the magic.</div>
        )}
      </div>
    </ToolLayout>
  );
};

const BMICalculator = () => {
  const [weight, setWeight] = useState(70); // kg
  const [height, setHeight] = useState(170); // cm
  const bmi = weight / ((height/100) ** 2);
  
  const getStatus = (b: number) => {
    if(b < 18.5) return { t: 'Underweight', c: 'text-yellow-400', w: '20%' };
    if(b < 25) return { t: 'Normal', c: 'text-green-400', w: '50%' };
    if(b < 30) return { t: 'Overweight', c: 'text-orange-400', w: '75%' };
    return { t: 'Obese', c: 'text-red-400', w: '100%' };
  };
  const status = getStatus(bmi);
  const reset = () => { setWeight(70); setHeight(170); };

  return (
    <ToolLayout id="bmi-calc" name="BMI Calculator" description="Check your Body Mass Index health status." icon={Activity} result={bmi.toFixed(1)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="space-y-4">
          <Input label="Weight (kg)" type="number" value={weight} onChange={e => setWeight(Number(e.target.value))} />
          <Input label="Height (cm)" type="number" value={height} onChange={e => setHeight(Number(e.target.value))} />
        </div>
        
        <div className="glass-panel p-6 rounded-xl text-center">
          <p className="text-gray-400 mb-2">Your BMI Score</p>
          <h2 className={`text-5xl font-bold ${status.c}`}>{bmi.toFixed(1)}</h2>
          <p className={`text-lg font-medium mt-2 ${status.c}`}>{status.t}</p>
          
          <div className="w-full bg-gray-700 h-2 rounded-full mt-6 overflow-hidden relative">
            <div className="absolute left-0 top-0 h-full bg-gradient-to-r from-yellow-400 via-green-400 to-red-500 w-full opacity-30"></div>
            <div className="absolute top-0 h-full w-1 bg-white shadow-[0_0_10px_white]" style={{ left: `${Math.min(Math.max((bmi / 40) * 100, 0), 100)}%` }}></div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
};

const BillSplitter = () => {
  const [amount, setAmount] = useState(100);
  const [people, setPeople] = useState(2);
  const [tip, setTip] = useState(10);
  
  const total = amount + (amount * tip / 100);
  const perPerson = total / people;
  const reset = () => { setAmount(100); setPeople(2); setTip(10); };

  return (
    <ToolLayout id="split-bill" name="Split Bill" description="Easily split expenses with friends." icon={Users} result={perPerson.toFixed(2)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Input label="Total Amount" type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} />
          <div className="grid grid-cols-2 gap-4">
             <Input label="People" type="number" value={people} onChange={e => setPeople(Number(e.target.value))} />
             <Input label="Tip %" type="number" value={tip} onChange={e => setTip(Number(e.target.value))} />
          </div>
        </div>
        <div className="glass-panel p-6 rounded-xl flex flex-col justify-center text-center">
          <p className="text-gray-400">Each Person Pays</p>
          <p className="text-4xl font-bold text-cyan-400 mt-2">${perPerson.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-2">Total Bill including tip: ${total.toFixed(2)}</p>
        </div>
      </div>
    </ToolLayout>
  );
};

const LifeProgress = () => {
  const [birthDate, setBirthDate] = useState('2000-01-01');
  const [expectancy, setExpectancy] = useState(80);

  const birth = new Date(birthDate).getTime();
  const now = new Date().getTime();
  const end = new Date(new Date(birthDate).setFullYear(new Date(birthDate).getFullYear() + expectancy)).getTime();
  
  const progress = Math.min(100, Math.max(0, ((now - birth) / (end - birth)) * 100));
  const yearProgress = (new Date().getMonth() / 12) * 100;

  const reset = () => { setBirthDate('2000-01-01'); setExpectancy(80); };

  return (
    <ToolLayout id="life-progress" name="Life Progress" description="Visualize time passing (Memento Mori)." icon={Hourglass} onReset={reset}>
       <div className="space-y-8 max-w-lg mx-auto">
          <div className="flex gap-4">
            <Input type="date" label="Birthday" value={birthDate} onChange={e => setBirthDate(e.target.value)} />
            <Input type="number" label="Expectancy" value={expectancy} onChange={e => setExpectancy(Number(e.target.value))} />
          </div>

          <div className="space-y-6">
             <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-white">Life Completed</span><span className="text-cyan-400">{progress.toFixed(2)}%</span></div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                   <div style={{ width: `${progress}%` }} className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full shadow-[0_0_10px_#3b82f6]"></div>
                </div>
             </div>
             
             <div>
                <div className="flex justify-between text-sm mb-2"><span className="text-white">Year Completed</span><span className="text-green-400">{yearProgress.toFixed(1)}%</span></div>
                <div className="h-4 bg-gray-800 rounded-full overflow-hidden">
                   <div style={{ width: `${yearProgress}%` }} className="h-full bg-gradient-to-r from-green-500 to-emerald-600 rounded-full"></div>
                </div>
             </div>
          </div>
       </div>
    </ToolLayout>
  )
}

export default DailyPage;
