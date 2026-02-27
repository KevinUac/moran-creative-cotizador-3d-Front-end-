import { useState, useEffect } from 'react';
import { LuPackage, LuX, LuCheck } from 'react-icons/lu';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function OrderHistory() {
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { language } = useLanguage();
  const t = translations[language];

  useEffect(() => {
    if (showOrderModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showOrderModal]);

  const mockOrders = [
    {
      id: 'MC-0042',
      name: 'Soporte mecánico',
      material: 'PETG Negro',
      status: 'in-progress',
      statusLabel: t.enProduccion,
      progress: [
        { step: t.cotizado },
        { step: t.aprobado },
        { step: t.enProduccion },
        { step: t.listo },
        { step: t.entregado }
      ],
      currentStep: 3,
      price: '$320 MXN',
      date: '24 Feb 2026'
    },
    {
      id: 'MC-0041',
      name: 'Figura decorativa',
      material: 'PLA Blanco',
      status: 'completed',
      statusLabel: t.listo,
      progress: [
        { step: t.cotizado },
        { step: t.aprobado },
        { step: t.enProduccion },
        { step: t.listo },
        { step: t.entregado }
      ],
      currentStep: 4,
      price: '$85 MXN',
      date: '20 Feb 2026'
    },
    {
      id: 'MC-0040',
      name: 'Piezas industriales',
      material: 'ABS Gris',
      status: 'pending',
      statusLabel: t.cotizado,
      progress: [
        { step: t.cotizado },
        { step: t.aprobado },
        { step: t.enProduccion },
        { step: t.listo },
        { step: t.entregado }
      ],
      currentStep: 1,
      price: '$1450 MXN',
      date: '18 Feb 2026'
    }
  ];

  return (
    <>
      <button
        onClick={() => setShowOrderModal(true)}
        className="relative flex items-center gap-2 px-4 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-gray-700 font-semibold text-sm"
      >
        <LuPackage size={18} className="text-blue-600" />
        {t.pedidos}
        <span className="bg-gradient-to-br from-blue-600 to-cyan-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center -ml-1">
          {mockOrders.length}
        </span>
      </button>

      {showOrderModal && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] flex flex-col relative animate-slideUp">

            {/* Header matches mockup */}
            <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-xl shrink-0">
              <h2 className="text-xl font-bold text-gray-800 tracking-tight">{t.misPedidos}</h2>
              <div className="flex items-center gap-4">
                <button className="px-5 py-2.5 bg-[#de5c21] hover:bg-[#c24b17] text-white rounded-lg font-medium shadow-sm transition-all hover:shadow text-sm flex items-center gap-1.5 focus:ring-2 focus:ring-[#de5c21]/50 focus:outline-none">
                  <span className="text-lg leading-none mb-[2px]">+</span> {t.solicitarImpresion}
                </button>
                <button
                  onClick={() => setShowOrderModal(false)}
                  className="bg-gray-50 hover:bg-gray-100 p-2 rounded-lg text-gray-500 hover:text-gray-800 transition-colors border border-gray-200"
                  aria-label={t.cerrar}
                >
                  <LuX size={18} />
                </button>
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-white rounded-b-xl hide-scrollbar">
              <div className="flex flex-col">
                {mockOrders.map((order) => (
                  <div key={order.id} className="pt-8 pb-10 px-8 border-b border-gray-100 last:border-b-0 hover:bg-slate-50/50 transition-colors group">

                    {/* Top Info */}
                    <div className="flex justify-between items-start mb-10 w-full pl-2">
                      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 max-w-3xl">
                        <span className="text-gray-500 font-medium whitespace-nowrap">{order.id}</span>
                        <h3 className="text-lg font-bold text-gray-800 truncate">{order.name}</h3>
                        <span className="text-gray-400 font-medium whitespace-nowrap hidden md:inline">— {order.material}</span>

                        <span className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 w-fit ${order.status === 'completed'
                            ? 'bg-green-50 text-green-600 border border-green-100'
                            : order.status === 'in-progress'
                              ? 'bg-purple-50 text-purple-600 border border-purple-100'
                              : 'bg-yellow-50 text-yellow-600 border border-yellow-100'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'completed' ? 'bg-green-500' : order.status === 'in-progress' ? 'bg-purple-500' : 'bg-yellow-500'
                            }`}></span>
                          {order.statusLabel}
                        </span>
                      </div>

                      <div className="text-xl font-bold text-gray-900 shrink-0 select-none">
                        {order.price}
                      </div>
                    </div>

                    {/* Timeline Tracker */}
                    <div className="w-full max-w-4xl px-2 mb-2">
                      <div className="flex items-center justify-between w-full">
                        {order.progress.map((step, idx) => {
                          const isCompleted = idx < order.currentStep - 1;
                          const isCurrent = idx === order.currentStep - 1;
                          const isLast = idx === order.progress.length - 1;
                          const isLineActive = idx < order.currentStep - 1;

                          return (
                            <div key={idx} className={`flex items-center ${isLast ? '' : 'flex-1'}`}>
                              <div className="flex flex-col items-center relative">
                                {/* Circle */}
                                <div className={`w-[34px] h-[34px] rounded-full flex items-center justify-center text-sm font-bold transition-all border-[2px] z-10 ${isCompleted
                                    ? 'bg-[#de5c21] border-[#de5c21] text-white shadow-sm'
                                    : isCurrent
                                      ? 'bg-white border-[#de5c21] text-[#de5c21] ring-4 ring-[#de5c21]/10'
                                      : 'bg-white border-gray-200 text-gray-400'
                                  }`}>
                                  {isCompleted ? <LuCheck size={18} strokeWidth={3} /> : idx + 1}
                                </div>
                                {/* Label */}
                                <p className={`text-[13px] mt-4 font-semibold absolute top-[40px] whitespace-nowrap text-center ${isCompleted ? 'text-gray-500' : isCurrent ? 'text-[#de5c21]' : 'text-gray-400'
                                  }`}>
                                  {step.step}
                                </p>
                              </div>
                              {/* Connector Line */}
                              {!isLast && (
                                <div className={`h-[2px] flex-1 -mx-1 z-0 rounded-full transition-all duration-300 ${isLineActive ? 'bg-[#de5c21]' : 'bg-gray-200'
                                  }`}></div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

