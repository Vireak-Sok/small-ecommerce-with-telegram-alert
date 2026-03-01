'use client';

import { useState } from 'react';
import { Headset, X, Send } from 'lucide-react';

export default function FloatingSupport() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleModal = () => setIsOpen(!isOpen);

  return (
    <>
      {/* 1. Floating Support Button */}
      <div className="fixed max-w-md bottom-40 z-50">
        {/* The Pulse Effect (Animated Ring) */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
        
        <button
          onClick={toggleModal}
          className="relative flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 hover:bg-blue-700 focus:outline-none animate-bounce-slow"
          aria-label="Customer Support"
        >
          <Headset size={30} strokeWidth={2} />
        </button>
      </div>

      {/* 2. Modal Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 transition-opacity duration-300" 
          onClick={toggleModal}
        >
          {/* 3. Modal Card with Entry Animation */}
          <div 
            className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative transform transition-all duration-300 scale-100 opacity-100 animate-in zoom-in-95 fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={toggleModal}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 rounded-full bg-blue-50 p-4 dark:bg-blue-900/30 animate-pulse">
                <Headset size={36} className="text-blue-600 dark:text-blue-400" />
              </div>

              <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                តើអ្នកមានបញ្ហាមែនទេ?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                ប្រសិនបើលោកអ្នកជួបបញ្ហាបច្ចេកទេស ឬមានចម្ងល់ផ្សេងៗ សូមទាក់ទងមកកាន់យើងខ្ញុំតាមរយៈក្រុមតេឡេក្រាម (Telegram Group) ដើម្បីទទួលបានការដោះស្រាយភ្លាមៗ។
              </p>

              <div className="flex flex-col w-full gap-3">
                <a
                  href="https://t.me/+8zoN6oLp58ZmOWZl" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] py-3 font-semibold text-white transition-all hover:bg-[#0077b5] hover:shadow-lg active:scale-[0.98]"
                >
                  <Send size={18} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                  <span>ចូលទៅកាន់ក្រុម Telegram</span>
                </a>
                
                <button
                  onClick={toggleModal}
                  className="rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 transition-colors dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                >
                  បិទវិញ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Custom CSS for the slow bounce */}
      <style jsx global>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s infinite ease-in-out;
        }
      `}</style>
    </>
  );
}
// 'use client';

// import { useState } from 'react';
// import { Headset, X, Send } from 'lucide-react'; // Importing clean Lucide icons

// export default function FloatingSupport() {
//   const [isOpen, setIsOpen] = useState(false);

//   const toggleModal = () => setIsOpen(!isOpen);

//   return (
//     <>
//       {/* Support Button - Bottom Left */}
//       <button
//         onClick={toggleModal}
//         className="fixed bottom-40 left-4 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 active:scale-95 hover:bg-blue-700 focus:outline-none"
//         aria-label="Customer Support"
//       >
//         <Headset size={32} strokeWidth={2} />
//       </button>

//       {/* Modal Overlay */}
//       {isOpen && (
//         <div 
//           className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
//           onClick={toggleModal}
//         >
//           {/* Modal Card */}
//           <div 
//             className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl dark:bg-slate-900 border border-slate-100 dark:border-slate-800 relative animate-in fade-in zoom-in duration-200"
//             onClick={(e) => e.stopPropagation()}
//           >
//             {/* Close button in top right corner of modal */}
//             <button 
//               onClick={toggleModal}
//               className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white"
//             >
//               <X size={20} />
//             </button>

//             <div className="flex flex-col items-center text-center">
//               <div className="mb-4 rounded-full bg-blue-50 p-3 dark:bg-blue-900/30">
//                 <Headset size={32} className="text-blue-600 dark:text-blue-400" />
//               </div>

//               <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
//                 តើអ្នកមានបញ្ហាមែនទេ?
//               </h2>
//               <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
//                 ប្រសិនបើលោកអ្នកជួបបញ្ហាបច្ចេកទេស ឬមានចម្ងល់ផ្សេងៗ សូមទាក់ទងមកកាន់យើងខ្ញុំតាមរយៈក្រុមតេឡេក្រាម (Telegram Group) ដើម្បីទទួលបានការដោះស្រាយភ្លាមៗ។
//               </p>

//               <div className="flex flex-col w-full gap-3">
//                 <a
//                   href="https://t.me/+8zoN6oLp58ZmOWZl" 
//                   target="_blank"
//                   rel="noopener noreferrer"
//                   className="flex items-center justify-center gap-2 rounded-xl bg-[#0088cc] py-3 font-semibold text-white transition-all hover:bg-[#0077b5] hover:shadow-md"
//                 >
//                   <Send size={18} />
//                   <span>ចូលទៅកាន់ក្រុម Telegram</span>
//                 </a>
                
//                 <button
//                   onClick={toggleModal}
//                   className="rounded-xl border border-slate-200 py-2 text-sm font-medium text-slate-500 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
//                 >
//                   បិទវិញ
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }