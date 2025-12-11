
import React, { useState } from 'react';
import { Button, Input, ToolLayout, TabNavigation } from '../components/SharedUI';
import { FileJson, QrCode, Lock, FileArchive, Code, Palette, Regex, FileText } from 'lucide-react';

const DeveloperTools: React.FC = () => {
  const [activeTab, setActiveTab] = useState('json');
  
  const tabs = [
    { id: 'json', label: 'JSON <> CSV', icon: FileJson },
    { id: 'base64', label: 'Base64', icon: Code },
    { id: 'qr', label: 'QR Generator', icon: QrCode },
    { id: 'pass', label: 'Password', icon: Lock },
    { id: 'color', label: 'Color Picker', icon: Palette },
    { id: 'regex', label: 'Regex Tester', icon: FileText },
    { id: 'compress', label: 'Img Compress', icon: FileArchive },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
       <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />
       {activeTab === 'json' && <JsonCsvConverter />}
       {activeTab === 'base64' && <Base64Converter />}
       {activeTab === 'qr' && <QrGenerator />}
       {activeTab === 'pass' && <PasswordGenerator />}
       {activeTab === 'color' && <ColorPicker />}
       {activeTab === 'regex' && <RegexTester />}
       {activeTab === 'compress' && <ImageCompressor />}
    </div>
  );
};

const Base64Converter = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'encode'|'decode'>('encode');
  
  const output = React.useMemo(() => {
    try {
      return mode === 'encode' ? btoa(input) : atob(input);
    } catch { return "Invalid Input"; }
  }, [input, mode]);

  return (
    <ToolLayout id="base64" name="Base64 Converter" description="Encode or decode strings." icon={Code}>
       <div className="space-y-4">
          <div className="flex justify-center gap-4">
             <Button variant={mode==='encode'?'primary':'secondary'} onClick={()=>setMode('encode')}>Encode</Button>
             <Button variant={mode==='decode'?'primary':'secondary'} onClick={()=>setMode('decode')}>Decode</Button>
          </div>
          <textarea className="w-full glass-input p-4 rounded-xl min-h-[100px]" placeholder="Input" value={input} onChange={e => setInput(e.target.value)} />
          <textarea className="w-full glass-input p-4 rounded-xl min-h-[100px]" readOnly value={output} />
       </div>
    </ToolLayout>
  )
}

const ColorPicker = () => {
  const [color, setColor] = useState('#38bdf8');
  return (
    <ToolLayout id="color" name="Color Picker" description="Pick colors and get codes." icon={Palette}>
       <div className="flex flex-col items-center gap-8">
          <input type="color" value={color} onChange={e => setColor(e.target.value)} className="w-32 h-32 rounded-xl cursor-pointer bg-transparent" />
          <div className="text-center space-y-2">
             <p className="text-2xl font-bold font-mono">{color.toUpperCase()}</p>
             <p className="text-gray-400 font-mono">rgb({parseInt(color.slice(1,3),16)}, {parseInt(color.slice(3,5),16)}, {parseInt(color.slice(5,7),16)})</p>
          </div>
       </div>
    </ToolLayout>
  )
}

const RegexTester = () => {
  const [regex, setRegex] = useState('');
  const [text, setText] = useState('');
  const match = React.useMemo(() => {
    try { return new RegExp(regex).test(text); } catch { return false; }
  }, [regex, text]);

  return (
    <ToolLayout id="regex" name="Regex Tester" description="Test regular expressions." icon={FileText}>
       <div className="space-y-4">
          <Input placeholder="Regex (e.g., ^[a-z]+$)" value={regex} onChange={e => setRegex(e.target.value)} />
          <Input placeholder="Test String" value={text} onChange={e => setText(e.target.value)} />
          <div className={`p-4 rounded-xl text-center font-bold ${match ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
             {match ? "Match Found" : "No Match"}
          </div>
       </div>
    </ToolLayout>
  )
}

const JsonCsvConverter = () => {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<'json2csv' | 'csv2json'>('json2csv');

  const convert = () => {
    try {
      if (mode === 'json2csv') {
        const items = JSON.parse(input);
        const replacer = (key: any, value: any) => value === null ? '' : value;
        const header = Object.keys(items[0]);
        const csv = [
          header.join(','),
          ...items.map((row: any) => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
        ].join('\r\n');
        setOutput(csv);
      } else {
        const lines = input.split('\n');
        const headers = lines[0].split(',');
        const result = lines.slice(1).map(line => {
          const obj: any = {};
          const currentline = line.split(',');
          headers.forEach((header, i) => obj[header.trim()] = currentline[i]?.trim());
          return obj;
        });
        setOutput(JSON.stringify(result, null, 2));
      }
    } catch (e) {
      setOutput("Error parsing input. Please ensure valid format.");
    }
  };

  return (
    <ToolLayout id="json-csv" name="JSON <> CSV Converter" description="Convert data formats instantly." icon={FileJson}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-[500px]">
         <div className="flex flex-col gap-2">
            <div className="flex justify-between">
               <label>Input</label>
               <button onClick={() => setMode(mode === 'json2csv' ? 'csv2json' : 'json2csv')} className="text-xs text-cyan-400">
                 Switch to {mode === 'json2csv' ? 'CSV -> JSON' : 'JSON -> CSV'}
               </button>
            </div>
            <textarea className="flex-1 glass-input p-4 rounded-xl resize-none font-mono text-xs" value={input} onChange={e => setInput(e.target.value)} placeholder={`Paste ${mode === 'json2csv' ? 'JSON' : 'CSV'} here...`} />
         </div>
         <div className="flex flex-col gap-2">
            <label>Output</label>
            <textarea className="flex-1 glass-input p-4 rounded-xl resize-none font-mono text-xs" readOnly value={output} />
         </div>
      </div>
      <div className="mt-4 flex justify-end">
         <Button onClick={convert}>Convert</Button>
      </div>
    </ToolLayout>
  )
};

const QrGenerator = () => {
  const [text, setText] = useState('');
  const [url, setUrl] = useState('');

  const generate = () => {
    if(!text) return;
    setUrl(`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`);
  };

  return (
    <ToolLayout id="qr-gen" name="QR Code Generator" description="Create QR codes for links, text, or wifi." icon={QrCode}>
       <div className="flex flex-col items-center gap-8">
          <div className="w-full max-w-md flex gap-2">
             <Input value={text} onChange={e => setText(e.target.value)} placeholder="Enter URL or Text" className="flex-1" />
             <Button onClick={generate}>Create</Button>
          </div>
          {url && (
            <div className="p-4 bg-white rounded-xl">
               <img src={url} alt="QR Code" className="w-48 h-48" />
            </div>
          )}
       </div>
    </ToolLayout>
  )
};

const PasswordGenerator = () => {
  const [length, setLength] = useState(12);
  const [pass, setPass] = useState('');
  
  const generate = () => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";
    let retVal = "";
    for (let i = 0, n = charset.length; i < length; ++i) {
        retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setPass(retVal);
  };

  return (
    <ToolLayout id="pass-gen" name="Strong Password Generator" description="Create secure passwords locally." icon={Lock} result={pass} onReset={() => setPass('')}>
       <div className="space-y-4 max-w-md mx-auto">
          <Input type="number" label="Length" value={length} onChange={e => setLength(Number(e.target.value))} />
          <Button onClick={generate} className="w-full">Generate Password</Button>
       </div>
    </ToolLayout>
  )
};

const ImageCompressor = () => {
  return (
    <ToolLayout id="img-compress" name="Image Compressor" description="Reduce image size without losing quality." icon={FileArchive}>
       <div className="text-center p-12 border-2 border-dashed border-white/10 rounded-xl">
          <p className="text-gray-400">Drag & Drop Image Here (Simulation)</p>
          <p className="text-xs text-gray-500 mt-2">Max 5MB</p>
       </div>
    </ToolLayout>
  )
}

export default DeveloperTools;
