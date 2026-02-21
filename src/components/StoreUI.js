"use client";
import React, { useState } from 'react';
import { ShoppingCart, X, Upload } from 'lucide-react';

const PROVINCES = ["Phnom Penh", "Siem Reap", "Sihanoukville", "Battambang", "Kampot", "Kandal", "Takeo"]; // Shortened for brevity

export default function StoreUI({ products }) {
  const [cart, setCart] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', province: 'Phnom Penh', address: '', payment: 'COD' });
  const [proof, setProof] = useState(null);
  const [loading, setLoading] = useState(false);

  const total = cart.reduce((acc, item) => acc + item.price, 0);
  const isPP = form.province === "Phnom Penh";

  const submitOrder = async () => {
    setLoading(true);
    const msg = `🛒 ថ្មីពីហាង!\n👤: ${form.name}\n📞: ${form.phone}\n📍: ${form.province}, ${form.address}\n💵: $${total}\n💳: ${form.payment}`;
    
    const body = new FormData();
    body.append('message', msg);
    body.append('photo', proof);

    const res = await fetch('/api/order', { method: 'POST', body });
    if (res.ok) alert("ជោគជ័យ!");
    setLoading(false);
  };

  return (
    <div>
      {/* Product List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map(p => (
          <div key={p.id} className="bg-white p-3 rounded-xl shadow-sm border">
            <Image src={p.image} className="w-full h-40 object-cover rounded-lg mb-2" alt="" />
            <h3 className="font-semibold">{p.name}</h3>
            <p className="text-red-600 font-bold">${p.price}</p>
            <button onClick={() => {setCart([...cart, p]); setIsOpen(true);}} 
                    className="w-full mt-2 bg-blue-600 text-white py-2 rounded-lg text-sm">ទិញឥឡូវ</button>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md p-6 overflow-y-auto">
            <div className="flex justify-between mb-4">
              <h2 className="text-xl font-bold">ការបញ្ជាទិញ</h2>
              <button onClick={() => setIsOpen(false)}><X /></button>
            </div>

            <div className="space-y-4">
              <input placeholder="ឈ្មោះ" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, name: e.target.value})} />
              <input placeholder="លេខទូរស័ព្ទ" className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, phone: e.target.value})} />
              
              <select className="w-full border p-3 rounded-lg" onChange={e => setForm({...form, province: e.target.value, payment: e.target.value === 'Phnom Penh' ? form.payment : 'KHQR'})}>
                {PROVINCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>

              <div className="border p-4 rounded-lg bg-gray-50">
                <p className="font-bold mb-2">វិធីបង់ប្រាក់</p>
                <div className="space-y-2">
                  <label className={`block ${!isPP && 'opacity-30'}`}>
                    <input type="radio" name="pay" checked={form.payment === 'COD'} disabled={!isPP} onChange={() => setForm({...form, payment: 'COD'})} /> COD (ភ្នំពេញប៉ុណ្ណោះ)
                  </label>
                  <label className="block">
                    <input type="radio" name="pay" checked={form.payment === 'KHQR'} onChange={() => setForm({...form, payment: 'KHQR'})} /> KHQR / ផ្ទេរប្រាក់
                  </label>
                </div>
              </div>

              {form.payment === 'KHQR' && (
                <div className="border-2 border-dashed p-4 text-center rounded-lg">
                  <Upload className="mx-auto mb-2 text-gray-400" />
                  <input type="file" onChange={e => setProof(e.target.files[0])} className="text-xs" />
                </div>
              )}

              <button disabled={loading} onClick={submitOrder} className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold">
                {loading ? "កំពុងផ្ញើ..." : `បញ្ជាក់ការទិញ - $${total}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}