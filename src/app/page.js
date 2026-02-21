"use client"

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, CheckCircle, Package, User, MapPin, Send, ArrowLeft, CreditCard, Banknote, Truck, Wind, Droplets, Scissors, Eraser, Briefcase, Star, Gift, Layers, LayoutGrid, Sparkles, X, Trash2, Info, CloudDownload, ImageUp, AlertCircle, Loader2, CircleX } from 'lucide-react';
import qrImage from '../assets/image.png';
import Image from 'next/image';

const MAIN_PRODUCTS = [
  { 
    id: 1, 
    name: "ស្ព្រាយបាញ់បំបាត់ក្លិនស្បែកជើង", 
    price: 1.50, 
    desc: "កម្ចាត់ក្លិនមិនល្អភ្លាមៗ",
    icon: <Wind className="text-blue-500" size={24} />
  },
  { 
    id: 2, 
    name: "ហ្វូមលាងសម្អាតស្បែកជើង", 
    price: 2.50, 
    desc: "សម្អាតបានជ្រៅសម្រាប់គ្រប់ប្រភេទស្បែក",
    icon: <Droplets className="text-cyan-500" size={24} />
  }
];

const ADDITIONAL_PRODUCTS = [
  { 
    id: 3, 
    name: "ច្រាសដុសស្បែកជើង", 
    price: 0.25, 
    desc: "សរសៃច្រាសរឹងមាំសម្រាប់កម្ចាត់ដីជាប់ស្វិត",
    icon: <Eraser className="text-amber-600" size={24} />
  },
  { 
    id: 4, 
    name: "កន្សែងជូត", 
    price: 0.25, 
    desc: "សាច់ក្រណាត់ទន់សម្រាប់ខាត់ឱ្យរលោង",
    icon: <Scissors className="text-slate-500" size={24} />
  },
  { 
    id: 5, 
    name: "ថង់ដាក់ស្បែកជើង", 
    price: 0.50, 
    desc: "សម្រាប់ការពារពេលធ្វើដំណើរ និងទុកដាក់",
    icon: <Briefcase className="text-indigo-500" size={24} />
  },
];

const COMBOS = [
  {
    id: 101,
    name: "ឈុត A: សម្អាតខ្លាំង",
    price: 5.00,
    desc: "ស្ព្រាយ ២ + ហ្វូម ១",
    free: "ថែម ច្រាសដុស ១ (ឥតគិតថ្លៃ)",
    icon: <Star className="text-yellow-500" size={24} />
  },
  {
    id: 102,
    name: "ឈុត B: ស្រស់ស្រាយទ្វេដង",
    price: 4.00,
    desc: "ស្ព្រាយបាញ់បំបាត់ក្លិន ៣",
    free: "ថែម ថង់ដាក់ស្បែកជើង ១ (ឥតគិតថ្លៃ)",
    icon: <Star className="text-yellow-500" size={24} />
  },
  {
    id: 103,
    name: "ឈុត C: ថែទាំពិសេស",
    price: 7.00,
    desc: "ហ្វូមលាងសម្អាត ៣",
    free: "ថែម កន្សែងជូត ១ + ច្រាស ១ (ឥតគិតថ្លៃ)",
    icon: <Star className="text-yellow-500" size={24} />
  }
];

const ALL_PRODUCTS = [...MAIN_PRODUCTS, ...ADDITIONAL_PRODUCTS];

const PROVINCES = [
  "ភ្នំពេញ", "បន្ទាយមានជ័យ", "បាត់ដំបង", "កំពង់ចាម", "កំពង់ឆ្នាំង", 
  "កំពង់ស្ពឺ", "កំពង់ធំ", "កំពត", "កណ្តាល", "កែប", "កោះកុង", "ក្រចេះ", 
  "មណ្ឌលគិរី", "ឧត្តរមានជ័យ", "ប៉ៃលិន", "ព្រះសីហនុ", "ព្រះវិហារ", 
  "ព្រៃវែង", "ពោធិ៍សាត់", "រតនគិរី", "សៀមរាប", "ស្ទឹងត្រែង", "ស្វាយរៀង", 
  "តាកែវ", "ត្បូងឃ្មុំ"
];

const BUSINESS_PHONE = "1234567890";
const STORE_NAME = "72 SHOES";
const CURRENCY = "$";

export default function App() {
  const [cart, setCart] = useState({});
  const [step, setStep] = useState(1); 
  const [activeTab, setActiveTab] = useState('combos'); 
  const [customer, setCustomer] = useState({ name: '', phone: '', province: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('QR');
  const [isCartOpen, setIsCartOpen] = useState(false);

  const comboCount = Object.entries(cart).reduce((sum, [id, qty]) => {
    return parseInt(id) >= 100 ? sum + qty : sum;
  }, 0);

  const isFreeDelivery = comboCount >= 2;

  let shippingFee = 0;
  if (customer.province !== "" && !isFreeDelivery) {
    shippingFee = (customer.province === "ភ្នំពេញ" || customer.province === "Phnom Penh") ? 1.50 : 2.00;
  }

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [timeLeft, setTimeLeft] = useState(5);
 
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setStatus({ type: 'error', text: 'Please select an image file only.' });
        e.target.value = '';
        return;
      }
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onload = (event) => setPreview(event.target.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  const removeFile = () => {
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    if (customer.province !== "ភ្នំពេញ" && customer.province !== "Phnom Penh" && customer.province !== "") {
      setPaymentMethod('QR');
    }
  }, [customer.province]);

  const updateQty = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const newState = { ...prev };
        delete newState[id];
        return newState;
      }
      return { ...prev, [id]: next };
    });
  };

  const getItemData = (id) => {
    const productId = parseInt(id);
    return productId >= 100 
      ? COMBOS.find(c => c.id === productId)
      : ALL_PRODUCTS.find(p => p.id === productId);
  };

  const subtotal = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = getItemData(id);
    return sum + (item.price * qty);
  }, 0);

  const total = subtotal + shippingFee;

  const handleNext = () => {
    if (step === 1 && subtotal === 0) return;
    if (step === 2 && (!customer.name || !customer.phone || !customer.province || !customer.address)) return;
    setStep(step + 1);
  };

  const ProductCard = ({ item, isCombo = false }) => (
    <div className={`group flex items-center gap-4 rounded-2xl border ${isCombo ? 'border-yellow-200 bg-yellow-50/30' : 'border-slate-100 bg-white'} p-3 shadow-sm hover:border-blue-200 transition-all`}>
      <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl ${isCombo ? 'bg-yellow-100' : 'bg-slate-50'} group-hover:bg-blue-50 transition-colors`}>
        {item.icon}
      </div>
      <div className="flex-1">
        <h3 className="font-bold text-slate-800 leading-tight text-sm">{item.name}</h3>
        <p className="text-[10px] text-slate-500 line-clamp-1">{item.desc}</p>
        {item.free && <p className="text-[10px] font-bold text-green-600 mt-0.5">🎁 {item.free}</p>}
        <p className="font-black text-blue-600 mt-1">{CURRENCY}{item.price.toFixed(2)}</p>
      </div>
      <div className="flex items-center gap-2 rounded-xl bg-white/50 border border-slate-100 p-1 shadow-inner">
        <button onClick={() => updateQty(item.id, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm font-bold active:scale-90">-</button>
        <span className="w-4 text-center font-bold text-sm">{cart[item.id] || 0}</span>
        <button onClick={() => updateQty(item.id, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-bold active:scale-90">+</button>
      </div>
    </div>
  );

  const ShowOrderResult = ({ status }) => {
    return(
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50">
      {/* Modal Box */}
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-2">
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="text-green-600 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-center text-green-600">Order was successfully placed!</h2>
            <p className="text-slate-600">🙏 Thank you for your order 🙏</p>
            <p className="text-slate-400 text-sm">Back to product page in {timeLeft}s</p>
          </div>
        ) : (
          <>
            <CircleX className="text-red-600 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-center text-red-600">Order was not placed!</h2>
            <p className="text-slate-600">Please try again in a few minutes.</p>
            <p className="text-slate-400 text-sm">Back to product page in {timeLeft}s</p>
          </>
        )}
      </div>
    </div>
  )
};


  const DownloadImage = ({ imageUrl, imageName }) => {
  return (
    <div>
      <a
        href={imageUrl.src}
        download={imageName} // Suggests a filename
        target="_blank"
        rel="noopener noreferrer"
        className="mx-auto bg-blue-50 text-blue-600 text-[14px] px-4 py-2 rounded-full flex justify-center items-center gap-2 border border-blue-100 w-fit"
      >
        <CloudDownload size={16}/>
        ទាញយកជារូបភាព
      </a>
    </div>
  );
};

  const sendToTelegram = async () => {
    const endpoint = file ? 'sendPhoto' : 'sendMessage';
    const url = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_BOT_TOKEN}/${endpoint}`;
    const timestamp = new Date().toLocaleString();
    
    // const formattedText = `<b>🚨 NEW ORDER</b>\n\n<b>Subject:</b> ${subject}\n<b>Time:</b> ${timestamp}\n\n<b>Message:</b>\n${message}`;
    const formattedText =
    `<b>🚨 NEW ORDER</b>
    
    <b>Date: ${timestamp}</b>
    <b>Customer Name: ${customer.name}</b>
    <b>Phone Number: ${customer.phone}</b>
    <b>Province: ${customer.province}</b>
    <b>Address: ${customer.address}</b>

    <b>Product: ${Object.entries(cart).map(([id, qty]) => `${getItemData(id)?.name} x${qty}`).join(', ')}</b>
    <b>Total amount: $${total.toFixed(2)}</b>
    <b>Shipping fee: $${shippingFee.toFixed(2)}</b>
    <b>Payment Method: ${paymentMethod}</b>`;

    let body;
    let headers = {};

    if (file) {
      body = new FormData();
      body.append('chat_id', process.env.NEXT_PUBLIC_CHAT_ID);
      body.append('photo', file);
      body.append('caption', formattedText);
      body.append('parse_mode', 'HTML');
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify({
        chat_id: process.env.NEXT_PUBLIC_CHAT_ID,
        text: formattedText,
        parse_mode: 'HTML'
      });
    }

    const response = await fetch(url, { method: 'POST', headers, body });
    if (!response.ok) {
      const res = await response.json();
      throw new Error(res.description || "Telegram API Error");
    }
  };

  const handleManualSubmit = async () => {

    setIsSubmitting(true);

    try {
      await sendToTelegram();
      setStatus('success');
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setStep(1)
      setCart({});
      setCustomer({ name: '', phone: '', province: '', address: '' })
      setIsSubmitting(false)
      setActiveTab('combos');
      setPaymentMethod('QR');
      removeFile();
      setStatus(null);
    }
  };

useEffect(() => {

  setTimeLeft(5); // reset every time modal opens

  const timer = setInterval(() => {
    setTimeLeft((prev) => {
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [status]);

  return (
    <div className="min-h-screen bg-slate-50 pb-56 font-sans text-slate-900 leading-relaxed">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-white/95 p-4 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button onClick={() => setStep(step - 1)} className={`p-1 hover:bg-slate-100 rounded-full transition-colors ${step > 1 ? '' : 'invisible'}`}>
            <ArrowLeft size={24}/>
          </button>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-black tracking-tighter text-blue-600">{STORE_NAME}</h1>
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-100">
              <Sparkles className="text-white" size={20} />
            </div>
          </div>
        </div>
      </header>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200 px-4 pb-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 duration-300">
            <div className="p-5 border-b flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingCart className="text-blue-600" size={20} />
                <h2 className="font-black text-lg">កន្រ្តកទំនិញ</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-4 space-y-3">
              {Object.entries(cart).length === 0 ? (
                <div className="py-10 text-center space-y-3">
                  <Package className="mx-auto text-slate-300" size={48} />
                  <p className="text-slate-400 font-bold">មិនទាន់មានទំនិញនៅឡើយ</p>
                </div>
              ) : (
                Object.entries(cart).map(([id, qty]) => {
                  const item = getItemData(id);
                  return (
                    <div key={id} className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center shadow-sm text-blue-500">
                          {item.icon}
                        </div>
                        <div>
                          <p className="text-xs font-black text-slate-800 leading-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-blue-600">{CURRENCY}{item.price.toFixed(2)} x {qty}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                         <button onClick={() => updateQty(id, -1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-white shadow-sm font-bold active:scale-90">-</button>
                         <span className="text-xs font-black w-4 text-center">{qty}</span>
                         <button onClick={() => updateQty(id, 1)} className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm font-bold active:scale-90">+</button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
            <div className="p-5 bg-slate-50 border-t space-y-4">
              <div className="flex justify-between items-center">
                 <span className="font-bold text-slate-500">សរុបបណ្ដោះអាសន្ន</span>
                 <span className="text-xl font-black text-blue-600">{CURRENCY}{subtotal.toFixed(2)}</span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                បិទវិញ
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-md p-4 pt-6">
        {/* Stepper */}
        <div className="mb-8 flex items-center justify-center gap-2">
          {[1, 2, 3].map(i => (
            <React.Fragment key={i}>
              <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${step >= i ? 'bg-blue-600 text-white scale-110 shadow-lg shadow-blue-100' : 'bg-slate-200 text-slate-500'}`}>
                {i === 1 ? <Package size={14}/> : i === 2 ? <User size={14}/> : <CheckCircle size={14}/>}
              </div>
              {i < 3 && <div className={`h-1 w-8 rounded-full transition-colors duration-500 ${step > i ? 'bg-blue-600' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Tab Navigation */}
            <div className="flex p-1 bg-slate-200/50 rounded-2xl gap-1">
               <button onClick={() => setActiveTab('combos')} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${activeTab === 'combos' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>ទំនិញជាឈុត</button>
               <button onClick={() => setActiveTab('main')} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${activeTab === 'main' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-500'}`}>ទំនិញរាយ</button>
               <button onClick={() => setActiveTab('additional')} className={`flex-1 py-3 rounded-xl text-[11px] font-black transition-all ${activeTab === 'additional' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}>ទំនិញបន្ទាប់បន្សំ</button>
            </div>

            <div className="mt-4">
               {activeTab === 'combos' && (
                 <div className="space-y-3">
                    <div className={`rounded-2xl p-4 flex items-center gap-3 border mb-4 transition-all duration-500 ${isFreeDelivery ? 'bg-emerald-600 text-white border-emerald-500 shadow-lg' : 'bg-blue-600 text-white border-blue-500 shadow-md'}`}>
                      <Gift className={isFreeDelivery ? 'animate-bounce' : ''} size={24} />
                      <div>
                        <p className="font-bold text-sm leading-tight">{isFreeDelivery ? 'ទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!' : 'ប្រូម៉ូសិនពិសេស!'}</p>
                        <p className="text-[10px] opacity-90 mt-0.5">{isFreeDelivery ? 'អ្នកបានកម្ម៉ង់ ២ឈុត ឬលើសពីនេះ។ យើងដឹកឱ្យហ្វ្រី!' : 'កម្ម៉ង់ឈុតប្រូម៉ូសិនណាក៏បាន ២ឈុត នឹងទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!'}</p>
                      </div>
                    </div>
                    {COMBOS.map(combo => <ProductCard key={combo.id} item={combo} isCombo={true} />)}
                 </div>
               )}
               {activeTab === 'main' && (
                 <div className="space-y-3">
                    {MAIN_PRODUCTS.map(product => <ProductCard key={product.id} item={product} />)}
                 </div>
               )}
               {activeTab === 'additional' && (
                 <div className="space-y-3">
                    {ADDITIONAL_PRODUCTS.map(product => <ProductCard key={product.id} item={product} />)}
                 </div>
               )}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-2xl font-extrabold tracking-tight text-center">ព័ត៌មានដឹកជញ្ជូន</h2>
            <div className="space-y-4">
              <input type="text" placeholder="ឈ្មោះអ្នកទទួល" className="w-full rounded-xl border border-slate-200 p-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm" value={customer.name} onChange={e => setCustomer({...customer, name: e.target.value})} />
              <input type="tel" placeholder="លេខទូរស័ព្ទ" className="w-full rounded-xl border border-slate-200 p-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm" value={customer.phone} onChange={e => setCustomer({...customer, phone: e.target.value})} />
              
              <div className="space-y-3">
                <div className="relative">
                  <MapPin className="absolute left-4 top-4 text-slate-400" size={20} />
                  <select className="w-full rounded-xl border border-slate-200 bg-white py-4 pl-12 pr-4 outline-none ring-blue-600 focus:ring-2 appearance-none shadow-sm font-medium" value={customer.province} onChange={e => setCustomer({...customer, province: e.target.value})}>
                    <option value="">ជ្រើសរើស ខេត្ត/ក្រុង</option>
                    {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                
                {/* NEW: Shipping Fee Display under dropdown */}
                {customer.province && (
                  <div className={`flex items-center justify-between p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isFreeDelivery ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
                    <div className="flex items-center gap-2">
                      <Truck size={16} className={isFreeDelivery ? 'text-green-600' : 'text-blue-600'} />
                      <span className="text-xs font-bold text-slate-600">សេវាដឹកជញ្ជូន:</span>
                    </div>
                    <span className={`text-sm font-black ${isFreeDelivery ? 'text-green-600' : 'text-blue-600'}`}>
                      {isFreeDelivery ? 'ឥតគិតថ្លៃ (FREE)' : `${CURRENCY}${shippingFee.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>

              <textarea placeholder="អាសយដ្ឋានលម្អិត (លេខផ្ទះ, ផ្លូវ, ភូមិ...)" rows="3" className="w-full rounded-xl border border-slate-200 p-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm" value={customer.address} onChange={e => setCustomer({...customer, address: e.target.value})} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-10">
            {status != null && <ShowOrderResult status={status} />}
            <h2 className="text-2xl font-extrabold tracking-tight text-center">របៀបបង់ប្រាក់</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPaymentMethod('QR')} className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'QR' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105' : 'border-slate-100 bg-white text-slate-500'}`}><CreditCard size={28} /><span className="text-[11px] font-black uppercase">បង់តាម QR</span></button>
              {(customer.province === "ភ្នំពេញ" || customer.province === "Phnom Penh") ? (
                <button onClick={() => setPaymentMethod('COD')} className={`flex flex-col items-center justify-center gap-2 rounded-2xl border-2 p-5 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105' : 'border-slate-100 bg-white text-slate-500'}`}><Banknote size={28} /><span className="text-[11px] font-black uppercase">បង់ពេលទំនិញមកដល់</span></button>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 p-5 text-slate-300"><Banknote size={28} /><span className="text-[9px] font-bold uppercase text-center leading-tight">មិនមានសេវា COD <br/> សម្រាប់ខេត្ត</span></div>
              )}
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3 shadow-sm">
               <div className="flex justify-between text-md text-slate-500 font-medium">
                <span>សរុបទំនិញ</span>
                <span className="flex items-center justify-center gap-2">
                  <button 
                     onClick={() => setIsCartOpen(true)}
                     className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 border border-blue-100 active:scale-90 transition-transform"
                   >
                      មើលមុខទំនិញ
                  </button>
                  {CURRENCY}{subtotal.toFixed(2)}
                </span>
                </div>
               <div className="flex justify-between text-md text-slate-500 font-medium"><span>ថ្លៃដឹកជញ្ជូន ({customer.province})</span><span className={isFreeDelivery ? "text-green-600 font-black" : ""}>{isFreeDelivery ? "ឥតគិតថ្លៃ" : `${CURRENCY}${shippingFee.toFixed(2)}`}</span></div>
               <div className="flex justify-between font-black text-xl border-t border-dashed pt-3 mt-3"><span>ទឹកប្រាក់ត្រូវបង់</span><span className="text-blue-600">{CURRENCY}{total.toFixed(2)}</span></div>
            </div>

            {paymentMethod === 'QR' && (
              <div className="space-y-6 text-center animate-in fade-in duration-300">
                <div className="mx-auto aspect-[9/16] w-64 overflow-hidden rounded-3xl bg-white shadow-2xl">
                  <Image src={qrImage} alt="Payment QR" className="h-full w-full object-cover"/>
                </div>
                <DownloadImage imageUrl={qrImage} imageName="72Shoes_KHQR.png" />

            <div>
              <label className="flex text-[16px] font-bold text-neutral-600 uppercase tracking-wider mb-2 ml-1">
                ភស្តុតាងនៃការទូទាត់​
                <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <input 
                  type="file" 
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                />
                <label 
                  htmlFor="file-upload"
                  className="flex items-center justify-center gap-3 w-full px-4 py-3.5 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 hover:bg-neutral-100 hover:border-sky-300 cursor-pointer transition-all"
                >
                  <ImageUp className="w-5 h-5 text-neutral-400" />
                  <span className="text-sm font-medium text-neutral-600">
                    {file ? file.name : 'ភ្ជាប់វិក្កយប័ត្រ'}
                  </span>
                </label>
              </div>

              {preview && (
                <div className="mt-4 relative animate-in fade-in zoom-in duration-300">
                  <button 
                    type="button"
                    onClick={removeFile}
                    className="absolute -top-2 -right-2 bg-neutral-900 text-white rounded-full p-1.5 shadow-lg z-10 hover:scale-110 transition-transform"
                  >
                    <X className="w-3 h-3" />
                  </button>
                  <div className="rounded-2xl overflow-hidden border border-neutral-200 shadow-sm bg-neutral-50 p-2">
                    <img src={preview} alt="Preview" className="max-h-48 w-full object-contain rounded-xl" />
                  </div>
                </div>
              )}
            </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-10 duration-500">
        <div className="mx-auto w-full bg-white border-t border-slate-100 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] pt-5 pb-8 px-4 sm:px-6">
           <div className="max-w-md mx-auto space-y-4">
             {/* Dynamic Total/Shipping Breakdown */}
             {step !== 3 && (
             <div className="flex items-center justify-between px-1">
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-0.5">
                     <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">សរុបបណ្ដោះអាសន្ន</span>
                     {/* {customer.province && subtotal > 0 && (
                       <span className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${isFreeDelivery ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                         {isFreeDelivery ? 'ដឹកហ្វ្រី' : `ដឹក: ${CURRENCY}${shippingFee.toFixed(2)}`}
                       </span>
                     )} */}
                   </div>
                   <span className="text-3xl font-black text-blue-600 tracking-tight">
                    {subtotal > 0 ? `${CURRENCY}${subtotal.toFixed(2)}`: `${CURRENCY}0.00`}
                    </span>
                </div>
                {subtotal > 0 && (
                   <button 
                     onClick={() => setIsCartOpen(true)}
                     className="bg-blue-50 text-blue-600 text-[10px] font-black px-4 py-2 rounded-full flex items-center gap-2 border border-blue-100 active:scale-90 transition-transform"
                   >
                      <ShoppingCart size={14} />
                      {Object.values(cart).reduce((a, b) => a + b, 0)} មុខទំនិញ
                   </button>
                )}
             </div>
              )}

             <div>
               {step < 3 ? (
                 <button onClick={handleNext} disabled={step === 1 || subtotal == 0 ? subtotal === 0 : (!customer.name || !customer.phone || !customer.province || !customer.address)} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-blue-600 py-5 text-lg font-black text-white shadow-xl shadow-blue-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all">
                   {step === 1 ? 'បន្តទៅកាន់ការដឹកជញ្ជូន' : 'បន្តទៅកាន់ការបង់ប្រាក់'}
                   {step === 1 ? <Package size={20} /> : <User size={20} />}
                 </button>
               ) : (
                <button 
                  onClick={handleManualSubmit}
                  disabled={subtotal == 0 || isSubmitting || file == null && paymentMethod != 'COD' ? true: false}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-5 text-lg font-black text-white shadow-xl shadow-green-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Send size={20}/>បញ្ជាក់ការកម្ម៉ង់
                    </>
                  )}
                </button>
                //  <button onClick={sendToWhatsApp} disabled={subtotal == 0 || isSubmitting ? true: false} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-green-500 py-5 text-lg font-black text-white shadow-xl shadow-green-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"><Send size={20} />បញ្ជាក់ការកម្ម៉ង់</button>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}