
import React, { useState } from 'react';
import { Button, Input, ToolLayout, TabNavigation, ResultCard } from '../components/SharedUI';
import { Fuel, Lightbulb } from 'lucide-react';

const PersonalTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('fuel');
  
  const tabs = [
    { id: 'fuel', label: 'Trip Cost', icon: Fuel },
    { id: 'bill', label: 'Electricity Bill', icon: Lightbulb },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
       {activeTab === 'fuel' && <FuelCalculator />}
       {activeTab === 'bill' && <ElectricityBill />}
    </div>
  );
};

const FuelCalculator = () => {
  const [distance, setDistance] = useState(100);
  const [mileage, setMileage] = useState(15);
  const [price, setPrice] = useState(100);
  
  const cost = (distance / mileage) * price;

  return (
    <ToolLayout id="fuel-calc" name="Trip Fuel Cost" description="Estimate fuel expenses for your journey." icon={Fuel} result={cost.toFixed(0)}>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-4">
             <Input label="Distance (km)" type="number" value={distance} onChange={e => setDistance(Number(e.target.value))} />
             <Input label="Vehicle Mileage (km/l)" type="number" value={mileage} onChange={e => setMileage(Number(e.target.value))} />
             <Input label="Fuel Price" type="number" value={price} onChange={e => setPrice(Number(e.target.value))} />
          </div>
          <div className="space-y-4">
             <ResultCard label="Estimated Cost" value={cost.toFixed(0)} />
             <ResultCard label="Fuel Needed (Liters)" value={(distance/mileage).toFixed(1)} />
          </div>
       </div>
    </ToolLayout>
  )
};

const ElectricityBill = () => {
  const [units, setUnits] = useState(250);
  // Simple slab logic simulation
  const bill = units <= 100 ? 0 : (units - 100) * 5; 

  return (
    <ToolLayout id="elec-bill" name="Electricity Estimator" description="Estimate bill based on units (Generic Slab)." icon={Lightbulb} result={bill}>
       <div className="max-w-md mx-auto space-y-4">
          <Input label="Units Consumed" type="number" value={units} onChange={e => setUnits(Number(e.target.value))} />
          <p className="text-xs text-gray-500">Note: Calculated based on generic slab (First 100 units free, rest ₹5/unit).</p>
          <ResultCard label="Estimated Bill" value={bill} />
       </div>
    </ToolLayout>
  )
};

export default PersonalTools;
