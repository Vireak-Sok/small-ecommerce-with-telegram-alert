"use client";

import React, { useState, useEffect, useRef } from 'react';
import { ShoppingCart, CheckCircle, Package, User, MapPin, ArrowLeft, CreditCard, Banknote, Truck, Gift, Sparkles, X, CloudDownload, ImageUp, Loader2, CircleX, MessageSquare, Trash2 } from 'lucide-react';
import qrImage from '../assets/image.png';
import logo from '../assets/logo.png';
import Image from 'next/image'; 
import FloatingInfo from './FloatingInfo';

export default function ClientShell({ MAIN_PRODUCTS, ADDITIONAL_PRODUCTS, ALL_PRODUCTS, COMBOS, PROVINCES, BUSINESS_PHONE, STORE_NAME, CURRENCY }) {
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
    shippingFee = (customer.province === "ភ្នំពេញ" || customer.province === "Phnom Penh") ? 6000 : 8000;
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
    return sum + (item.priceKHR * qty);
  }, 0);

  const total = subtotal + shippingFee;

  const handleNext = () => {
    setStatus(null);
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
        <p className="text-[10px] text-slate-500 line-clamp-1">{item.description}</p>
        {item.freeItems && <p className="text-[10px] font-bold text-green-600 mt-0.5">🎁 {item.freeItems}</p>}
        <p className="font-bold text-blue-600 mt-1">{item.priceKHR.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span></p>
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
      <div className="fixed h-full inset-0 z-[100] flex items-center justify-center bg-black/50">
      {/* Modal Box */}
      <div className="bg-white p-8 rounded-lg shadow-xl flex flex-col items-center gap-2">
        {status === 'success' ? (
          <div className="text-center">
            <CheckCircle className="text-green-600 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-center text-green-600">ការបញ្ជាទិញបានជោគជ័យ!</h2>
            <p className="text-slate-600">🙏 អរគុណសម្រាប់ការគាំទ្រ 🙏</p>
            <p className="text-slate-400 text-sm">ត្រលប់ទៅទំព័រដើមវិញក្នុងរយៈពេល {timeLeft}វិនាទី</p>
          </div>
        ) : (
          <>
            <CircleX className="text-red-600 mx-auto" size={48} />
            <h2 className="text-xl font-bold text-center text-red-600">ការបញ្ជាទិញមិនបានជោគជ័យ!</h2>
            <p className="text-slate-600">សូមព្យាយាមម្តងទៀតពេលក្រោយ</p>
            <p className="text-slate-400 text-sm">ត្រលប់ទៅទំព័រដើមវិញក្នុងរយៈពេល {timeLeft}វិនាទី</p>
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

const recordOrder = async () => {
  const timestamp = new Date().toLocaleString();

  try {
    const res = await fetch("/api/recordOrder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: timestamp,
        ...customer,
        items: Object.entries(cart).map(([id, qty]) => `${getItemData(id)?.name} x${qty}`).join(', '),
        total: total,
        paymentMethod: paymentMethod,
      }),
    });

    const data = await res.json();

    if (data.success) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};

  const sendToTelegram = async () => {
    const timestamp = new Date().toLocaleString();
    
    // formattedText for telegram message with HTML formatting
    const formattedText =
    `<b>🚨 NEW ORDER</b>
    
    <b>Date: ${timestamp}</b>
    <b>Customer Name: ${customer.name}</b>
    <b>Phone Number: ${customer.phone}</b>
    <b>Province: ${customer.province}</b>
    <b>Address: ${customer.address}</b>

    <b>Product: ${Object.entries(cart).map(([id, qty]) => `${getItemData(id)?.name} x${qty}`).join(', ')}</b>
    <b>Remark: ${customer.remark || 'None'}</b>

    <b>Total amount: ៛${subtotal.toLocaleString()}</b>
    <b>Shipping fee: ៛${shippingFee.toLocaleString()}</b>
    <b>Payment Method: ${paymentMethod}</b>`;

    const formData = new FormData();
    formData.append("message", formattedText);

    if (file) {
    formData.append("file", file);
    }

    const response = await fetch("/api/order", {
    method: "POST",
    body: formData,
    });

    if (!response.ok) {
    throw new Error("Failed to send order");
    }
  };

  const handleManualSubmit = async () => {

    setIsSubmitting(true);

    try {
      await recordOrder();
      await sendToTelegram();
      setStatus('success');
    } catch (err) {
      setStatus('error');
    } finally {
      setIsSubmitting(false);
      await new Promise((resolve) => setTimeout(resolve, 5000));
      setStep(1)
      setCart({});
      setCustomer({ name: '', phone: '', province: '', address: '', remark: '' });
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
      <header className="sticky top-0 z-40 border-b bg-white/95 px-4 py-2 backdrop-blur-md shadow-sm">
        <div className="mx-auto flex max-w-md items-center justify-between">
          <button onClick={() => setStep(step - 1)} className={`p-1 hover:bg-slate-100 rounded-full transition-colors ${step > 1 ? '' : 'invisible'}`}>
            <ArrowLeft size={24}/>
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black tracking-tighter text-blue-600">{STORE_NAME}</h1>
            <Image src={logo} alt="Logo" className="h-10 w-10 rounded-full"/>
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
                          <p className="text-[10px] font-bold text-blue-600">{item.priceKHR.toLocaleString()}<span className="font-normal">{CURRENCY}</span> </p>
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
                 <span className="text-xl font-bold text-blue-600">{subtotal.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span></span>
              </div>
              <div className="flex justify-between items-center gap-2">
              <button
                onClick={() => {
                  setCart({});
                  setSubtotal(0);
                }}
                className={`py-2 px-3 text-red-600 rounded-xl font-black shadow-lg border border-red-600 transition-all hover:bg-red-100 active:scale-95 ${subtotal === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={subtotal === 0}
              >
                <Trash2 size={20} className="inline-block" />
              </button>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-full py-2 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-100 active:scale-95 transition-all"
              >
                បិទវិញ
              </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <main className="mx-auto max-w-md p-4 pt-6">
        {/* Stepper */}
        <div className="mb-4 flex items-center justify-center gap-2">
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
            {/* <ProductDisplay initialProducts={products} types={types} /> */}
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
                        <p className="text-[10px] opacity-90 mt-0.5">{isFreeDelivery ? '' : 'កម្ម៉ង់ 2 ឈុតឡើងទៅ ដើម្បីទទួលបានការដឹកជញ្ជូនឥតគិតថ្លៃ!'}</p>
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
    {/* Recipient Name */}
    <div className="space-y-4">
      <label className="text-sm font-bold text-slate-700 ml-1">ឈ្មោះអ្នកទទួល <span className="text-red-500 ml-0.5" aria-hidden="true"> *</span></label>
      <input 
        type="text" 
        placeholder="បញ្ចូលឈ្មោះរបស់អ្នក" 
        className="w-full rounded-xl border border-slate-200 py-2 px-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm transition-all" 
        value={customer.name} 
        onChange={e => setCustomer({...customer, name: e.target.value})} 
      />
    </div>

    {/* Phone Number */}
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1">លេខទូរសព្ទ <span className="text-red-500 ml-0.5" aria-hidden="true"> *</span></label>
      <input 
        type="tel" 
        placeholder="ឧទាហរណ៍៖ 012 345 678" 
        className="w-full rounded-xl border border-slate-200 py-2 px-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm transition-all" 
        value={customer.phone} 
        onChange={e => setCustomer({...customer, phone: e.target.value})} 
      />
    </div>
    
    {/* Province Selection */}
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1">ខេត្ត/ក្រុង <span className="text-red-500 ml-0.5" aria-hidden="true"> *</span></label>
      <div className="relative">
        <MapPin className="absolute left-4 top-3 text-slate-400" size={18} />
        <select 
          className="w-full rounded-xl border border-slate-200 bg-white py-2 pl-12 pr-4 outline-none ring-blue-600 focus:ring-2 appearance-none shadow-sm font-medium" 
          value={customer.province} 
          onChange={e => setCustomer({...customer, province: e.target.value})}
        >
          <option value="">ជ្រើសរើស ខេត្ត/ក្រុង</option>
          {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      
      {/* Shipping Fee Display */}
      {customer.province && (
        <div className={`mt-2 flex items-center justify-between p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isFreeDelivery ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'}`}>
          <div className="flex items-center gap-2">
            <Truck size={16} className={isFreeDelivery ? 'text-green-600' : 'text-blue-600'} />
            <span className="text-xs font-bold text-slate-600">សេវាដឹកជញ្ជូន:</span>
          </div>
          <span className={`text-sm font-bold ${isFreeDelivery ? 'text-green-600' : 'text-blue-600'}`}>
            {isFreeDelivery ? (
              <>ឥតគិតថ្លៃ (FREE)</>
            ) : (
            <>{shippingFee.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span></>)
            }
          </span>
        </div>
      )}
    </div>

    {/* Detailed Address */}
    <div className="space-y-2">
      <label className="text-sm font-bold text-slate-700 ml-1">អាសយដ្ឋានលម្អិត <span className="text-red-500 ml-0.5" aria-hidden="true"> *</span></label>
      <textarea 
        placeholder="លេខផ្ទះ, ផ្លូវ, ភូមិ..." 
        rows="2" 
        className="w-full rounded-xl border border-slate-200 py-2 px-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm transition-all" 
        value={customer.address} 
        onChange={e => setCustomer({...customer, address: e.target.value})} 
      />
    </div>

    {/* Remark for Combo Sets */}
    <div className="space-y-1.5 pt-2">
      <div className="flex items-center gap-1.5 ml-1">
        <MessageSquare size={16} className="text-blue-600" />
        <label className="text-sm font-bold text-slate-700">កំណត់ចំណាំសម្រាប់ទំនិញឈុត (មិនចាំបាច់)</label>
      </div>
      <p className="text-[11px] text-blue-400 leading-tight ml-1 italic">
        សូមផ្តល់កំណត់ចំណាំសម្រាប់ទំនិញឈុត ពុំដូចនេះពួកយើងនឹងរៀបចំតាមជាក់ស្តែង។
      </p>
      <textarea 
        placeholder="ឧទាហរណ៍៖ យកក្លិនផ្កាទាំងអស់ ឬយកក្លិនផ្កា 1 ក្លិនដើម 2" 
        rows="2" 
        className="w-full rounded-xl border border-slate-200 py-2 px-4 outline-none ring-blue-600 focus:ring-2 bg-white shadow-sm transition-all text-sm" 
        value={customer.remark || ''} 
        onChange={e => setCustomer({...customer, remark: e.target.value})} 
      />
    </div>
  </div>
</div>

        {step === 3 && (
          <div className="space-y-6 animate-in zoom-in-95 duration-500 pb-10">
            {status != null && <ShowOrderResult status={status} />}
            <h2 className="text-2xl font-extrabold tracking-tight text-center">របៀបបង់ប្រាក់</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setPaymentMethod('QR')} className={`flex flex-col items-center justify-center rounded-2xl border-2 p-2 transition-all ${paymentMethod === 'QR' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105' : 'border-slate-100 bg-white text-slate-500'}`}><CreditCard size={28} /><span className="text-[11px] font-black uppercase">បង់តាម QR</span></button>
              {(customer.province === "ភ្នំពេញ" || customer.province === "Phnom Penh") ? (
                <button onClick={() => setPaymentMethod('COD')} className={`flex flex-col items-center justify-center rounded-2xl border-2 p-2 transition-all ${paymentMethod === 'COD' ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md scale-105' : 'border-slate-100 bg-white text-slate-500'}`}><Banknote size={28} /><span className="text-[11px] font-black uppercase">បង់ពេលទំនិញមកដល់</span></button>
              ) : (
                <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-2 text-slate-300"><Banknote size={28} /><span className="text-[9px] font-bold uppercase text-center leading-tight">មិនមានសេវា COD <br/> សម្រាប់ខេត្ត</span></div>
              )}
            </div>

            <div className="rounded-2xl bg-white border border-slate-100 p-5 space-y-3 shadow-sm">
               <div className="flex justify-between text-md text-slate-500 font-medium">
                <span>សរុបទំនិញ</span>
                <span className="flex items-center justify-center gap-2">
                  <button 
                     onClick={() => setIsCartOpen(true)}
                     className="bg-blue-50 text-blue-600 text-sm font-black px-4 py-1 rounded-full flex items-center gap-2 border border-blue-100 active:scale-90 transition-transform"
                   >
                      <ShoppingCart size={16} />
                  </button>
                  <p>{subtotal.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span></p>
                </span>
                </div>
               <div className="flex justify-between text-md text-slate-500 font-medium">
                <span>ថ្លៃដឹកជញ្ជូន ({customer.province})</span>
                <span className={isFreeDelivery ? "text-green-600 font-black" : ""}>
                  {isFreeDelivery ? (
                      <>
                      ឥតគិតថ្លៃ
                      </>
                    ) : (
                      <>
                      {shippingFee.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span>
                      </>
                    )}
                  </span>
              </div>
               <div className="flex justify-between font-bold text-xl border-t border-dashed pt-3 mt-3">
                <span>ទឹកប្រាក់ត្រូវបង់</span>
                <span className="text-blue-600 ">
                  {total.toLocaleString()}
                  <span className="text-sm font-normal">
                    {CURRENCY}
                  </span>
                  <span className="text-sm font-italic font-light text-slate-400 flex flex-col items-end">
                    ≈ {(total/4000).toFixed(2)} USD
                  </span>
                </span>
              </div>
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
      <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom-10 duration-500 bg-white">
        
        <div className="mx-auto w-full border-t border-slate-100 shadow-[0_-10px_25px_-5px_rgba(0,0,0,0.1)] py-4 px-4">
           <div className="max-w-md mx-auto space-y-4">
             {/* Dynamic Total/Shipping Breakdown */}
             {step !== 3 && (
             <div className="flex items-center justify-between px-1">
              <FloatingInfo/>
                <div className="flex flex-col">
                   <div className="flex items-center gap-2 mb-0.5">
                     <span className="text-sm font-black text-slate-400 uppercase tracking-widest leading-none">សរុបបណ្ដោះអាសន្ន</span>
                   </div>
                   <span className="text-2xl font-bold text-blue-600 tracking-tight">
                    {subtotal > 0 ? (
                      <>
                      {subtotal.toLocaleString()}<span className="text-sm font-normal">{CURRENCY}</span>
                      </>
                    ):(
                      <>
                      0 <span className="text-sm font-normal">{CURRENCY}</span>
                      </>
                    )
                  }
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
                 <button onClick={handleNext} disabled={step === 1 || subtotal == 0 ? subtotal === 0 : (!customer.name || !customer.phone || !customer.province || !customer.address)} className="flex w-full items-center justify-center gap-3 rounded-xl bg-blue-600 py-2 text-lg font-black text-white shadow-xl shadow-blue-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all">
                   {step === 1 ? "បន្តទៅកាន់ការដឹកជញ្ជូន" : "បន្តទៅកាន់ការបង់ប្រាក់"}
                 </button>
               ) : (
                <button 
                  onClick={handleManualSubmit}
                  disabled={subtotal == 0 || isSubmitting || file == null && paymentMethod != 'COD' ? true: false}
                  className="flex w-full items-center justify-center gap-3 rounded-xl bg-green-500 py-2 text-lg font-black text-white shadow-xl shadow-green-200 active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none transition-all"
                >
                  {isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      បញ្ជាក់ការកម្ម៉ង់
                    </>
                  )}
                </button>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
