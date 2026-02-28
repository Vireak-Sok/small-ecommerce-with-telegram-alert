import React from 'react';
import { ShoppingCart, CheckCircle, Package, User, MapPin, Send, ArrowLeft, CreditCard, Banknote, Truck, Wind, Droplets, Scissors, Eraser, Briefcase, Star, Gift, Layers, LayoutGrid, Sparkles, X, Trash2, Info, CloudDownload, ImageUp, AlertCircle, Loader2, CircleX } from 'lucide-react';
import ClientShell from '@/components/ClientShell';
import { getProducts } from '@/lib/getProducts';

// const MAIN_PRODUCTS = [
//   { 
//     id: 1, 
//     name: "ស្ព្រាយបាញ់បំបាត់ក្លិនស្បែកជើង", 
//     price: 1.50, 
//     desc: "កម្ចាត់ក្លិនមិនល្អភ្លាមៗ",
//     icon: <Wind className="text-blue-500" size={24} />
//   },
//   { 
//     id: 2, 
//     name: "ហ្វូមលាងសម្អាតស្បែកជើង", 
//     price: 2.50, 
//     desc: "សម្អាតបានជ្រៅសម្រាប់គ្រប់ប្រភេទស្បែក",
//     icon: <Droplets className="text-cyan-500" size={24} />
//   }
// ];

// const ADDITIONAL_PRODUCTS = [
//   { 
//     id: 3, 
//     name: "ច្រាសដុសស្បែកជើង", 
//     price: 0.25, 
//     desc: "សរសៃច្រាសរឹងមាំសម្រាប់កម្ចាត់ដីជាប់ស្វិត",
//     icon: <Eraser className="text-amber-600" size={24} />
//   },
//   { 
//     id: 4, 
//     name: "កន្សែងជូត", 
//     price: 0.25, 
//     desc: "សាច់ក្រណាត់ទន់សម្រាប់ខាត់ឱ្យរលោង",
//     icon: <Scissors className="text-slate-500" size={24} />
//   },
//   { 
//     id: 5, 
//     name: "ថង់ដាក់ស្បែកជើង", 
//     price: 0.50, 
//     desc: "សម្រាប់ការពារពេលធ្វើដំណើរ និងទុកដាក់",
//     icon: <Briefcase className="text-indigo-500" size={24} />
//   },
// ];

// const COMBOS = [
//   {
//     id: 101,
//     name: "ឈុត A: សម្អាតខ្លាំង",
//     price: 5.00,
//     desc: "ស្ព្រាយ ២ + ហ្វូម ១",
//     free: "ថែម ច្រាសដុស ១ (ឥតគិតថ្លៃ)",
//     icon: <Star className="text-yellow-500" size={24} />
//   },
//   {
//     id: 102,
//     name: "ឈុត B: ស្រស់ស្រាយទ្វេដង",
//     price: 4.00,
//     desc: "ស្ព្រាយបាញ់បំបាត់ក្លិន ៣",
//     free: "ថែម ថង់ដាក់ស្បែកជើង ១ (ឥតគិតថ្លៃ)",
//     icon: <Star className="text-yellow-500" size={24} />
//   },
//   {
//     id: 103,
//     name: "ឈុត C: ថែទាំពិសេស",
//     price: 7.00,
//     desc: "ហ្វូមលាងសម្អាត ៣",
//     free: "ថែម កន្សែងជូត ១ + ច្រាស ១ (ឥតគិតថ្លៃ)",
//     icon: <Star className="text-yellow-500" size={24} />
//   }
// ];

// const ALL_PRODUCTS = [...MAIN_PRODUCTS, ...ADDITIONAL_PRODUCTS];

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

export default async function App() {
  const products = await getProducts(); // This runs on the server (Safe)
  const types = [...new Set(products.map(p => p.type))];

  const MAIN_PRODUCTS = products.filter(p => p.type === 'base');
  const ADDITIONAL_PRODUCTS = products.filter(p => p.type === 'add-on');
  const COMBOS = products.filter(p => p.type === 'combo');
  const ALL_PRODUCTS = [...MAIN_PRODUCTS, ...ADDITIONAL_PRODUCTS];

  return (
    <ClientShell MAIN_PRODUCTS={MAIN_PRODUCTS} ADDITIONAL_PRODUCTS={ADDITIONAL_PRODUCTS} ALL_PRODUCTS={ALL_PRODUCTS} COMBOS={COMBOS} PROVINCES={PROVINCES} BUSINESS_PHONE={BUSINESS_PHONE} STORE_NAME={STORE_NAME} CURRENCY={CURRENCY}/>
  )
}
