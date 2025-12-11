import React, { useState } from 'react';
import { Input, Select, ToolLayout, TabNavigation } from '../components/SharedUI';
import { ArrowRightLeft, Thermometer, Ruler, Weight, Clock, Gauge, Zap } from 'lucide-react';

const Converters: React.FC = () => {
  const [activeTab, setActiveTab] = useState('length');

  const tabs = [
    { id: 'length', icon: Ruler, label: 'Length' },
    { id: 'weight', icon: Weight, label: 'Weight' },
    { id: 'temp', icon: Thermometer, label: 'Temp' },
    { id: 'speed', icon: Zap, label: 'Speed' },
    { id: 'pressure', icon: Gauge, label: 'Pressure' },
  ];

  return (
    <div className="animate-fade-in space-y-8">
      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <UniversalConverter type={activeTab} />
    </div>
  );
};

const UniversalConverter: React.FC<{ type: string }> = ({ type }) => {
  const [val, setVal] = useState(1);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');

  // Conversion Rates
  const rates: any = {
    length: { m: 1, km: 0.001, cm: 100, mm: 1000, ft: 3.28084, in: 39.3701, mi: 0.000621371 },
    weight: { kg: 1, g: 1000, lb: 2.20462, oz: 35.274 },
    speed: { 'm/s': 1, 'km/h': 3.6, 'mph': 2.23694, 'kt': 1.94384 },
    pressure: { 'Pa': 1, 'bar': 0.00001, 'psi': 0.000145038, 'atm': 0.0000098692 },
    temp: { c: 'c', f: 'f', k: 'k' }
  };

  // Set defaults on type change
  React.useEffect(() => {
    const keys = Object.keys(rates[type]);
    setFromUnit(keys[0]);
    setToUnit(keys[1] || keys[0]);
  }, [type]);

  const convert = () => {
    if (!fromUnit || !toUnit) return 0;
    if (type === 'temp') {
      if(fromUnit === toUnit) return val;
      if(fromUnit === 'c' && toUnit === 'f') return (val * 9/5) + 32;
      if(fromUnit === 'f' && toUnit === 'c') return (val - 32) * 5/9;
      if(fromUnit === 'c' && toUnit === 'k') return val + 273.15;
      if(fromUnit === 'k' && toUnit === 'c') return val - 273.15;
      return val; 
    }
    const inBase = val / rates[type][fromUnit];
    return inBase * rates[type][toUnit];
  };

  const result = convert();
  const reset = () => { setVal(1); };

  return (
    <ToolLayout id={`converter-${type}`} name={`${type.charAt(0).toUpperCase() + type.slice(1)} Converter`} description={`Convert ${type} units instantly.`} icon={ArrowRightLeft} result={result.toFixed(4)} onReset={reset}>
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-center max-w-4xl mx-auto">
        <div className="space-y-2">
          <Input type="number" value={val} onChange={e => setVal(Number(e.target.value))} />
          <Select value={fromUnit} onChange={e => setFromUnit(e.target.value)}>
             {rates[type] && Object.keys(rates[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
          </Select>
        </div>

        <div className="flex justify-center">
          <div className="p-3 rounded-full bg-white/5 text-cyan-400">
             <ArrowRightLeft className="w-6 h-6" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="glass-input px-4 py-3 rounded-xl bg-white/5 border border-white/10 font-bold text-2xl text-cyan-400 overflow-hidden text-ellipsis flex items-center h-[50px]">
             {result.toLocaleString(undefined, { maximumFractionDigits: 4 })}
          </div>
          <Select value={toUnit} onChange={e => setToUnit(e.target.value)}>
             {rates[type] && Object.keys(rates[type]).map(u => <option key={u} value={u}>{u.toUpperCase()}</option>)}
          </Select>
        </div>
      </div>
    </ToolLayout>
  );
};

export default Converters;