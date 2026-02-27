import { FiArrowRight, FiZap, FiClock, FiTarget, FiTrendingUp, FiX } from 'react-icons/fi';
import { LuLayers, LuPalette, LuBox } from 'react-icons/lu';
import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

export default function MainMenu({ onNavigate }) {
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const { language } = useLanguage();
  const t = translations[language];
  
  const features = [
    {
      icon: <FiZap size={24} />,
      title: t.rapido,
      description: t.cotizacionRapida
    },
    {
      icon: <FiTarget size={24} />,
      title: t.preciso,
      description: t.tolerancias
    },
    {
      icon: <FiTrendingUp size={24} />,
      title: t.escalable,
      description: t.desdePrototipos
    },
    {
      icon: <FiClock size={24} />,
      title: t.soporteContinuo,
      description: t.soporteContinuoDesc
    }
  ];

  const materials = [
    {
      icon: <LuLayers size={32} />,
      name: t.pla,
      desc: t.plaDesc,
      price: t.precioGramo,
      details: {
        title: t.impresionPLA,
        description: t.descPLA,
        features: [
          t.caracteristicasPLA1,
          t.caracteristicasPLA2,
          t.caracteristicasPLA3,
          t.caracteristicasPLA4,
          t.caracteristicasPLA5,
          t.caracteristicasPLA6
        ],
        bestFor: t.mejorParaPLA,
        quality: t.calidadPLA
      }
    },
    {
      icon: <LuBox size={32} />,
      name: t.abs,
      desc: t.absDesc,
      price: t.precioAbsGramo,
      details: {
        title: t.impresionABS,
        description: t.descABS,
        features: [
          t.caracteristicasABS1,
          t.caracteristicasABS2,
          t.caracteristicasABS3,
          t.caracteristicasABS4,
          t.caracteristicasABS5,
          t.caracteristicasABS6
        ],
        bestFor: t.mejorParaABS,
        quality: t.calidadABS
      }
    },
    {
      icon: <LuPalette size={32} />,
      name: t.resina,
      desc: t.resinaDesc,
      price: t.precioResinaGramo,
      details: {
        title: t.impresionResina,
        description: t.descResina,
        features: [
          t.caracteristicasResina1,
          t.caracteristicasResina2,
          t.caracteristicasResina3,
          t.caracteristicasResina4,
          t.caracteristicasResina5,
          t.caracteristicasResina6
        ],
        bestFor: t.mejorParaResina,
        quality: t.calidadResina
      }
    }
  ];

  const steps = [
    { num: '1', title: t.pasoUno, desc: t.pasoUnoDesc },
    { num: '2', title: t.pasoDos, desc: t.pasoDosDesc },
    { num: '3', title: t.pasoTres, desc: t.pasoTresDesc },
    { num: '4', title: t.pasoCuatro, desc: t.pasoCuatroDesc }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header onNavigate={onNavigate} currentPage="mainmenu" />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute -left-4 top-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="inline-block mb-6 px-4 py-2 bg-blue-500/20 border border-blue-400/30 rounded-full">
            <span className="text-sm font-semibold text-blue-300">{t.impresionProfesional}</span>
          </div>
          
          <h1 className="text-6xl font-bold mb-6 leading-tight">
            {t.convierteIdeas}
          </h1>
          
          <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
            {t.descripcionPrincipal}
          </p>
          
          <button 
            onClick={() => onNavigate('upload')} 
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105 shadow-lg"
          >
            {t.comenzar} <FiArrowRight size={20} />
          </button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">{t.porQueElegirnos}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, idx) => (
              <div key={idx} className="group p-6 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all duration-300">
                <div className="text-blue-600 mb-4 group-hover:scale-110 transition-transform">{feature.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Section */}
      <section className="py-20 px-6 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-gray-900">{t.materialesDisponibles}</h2>
          <p className="text-center text-gray-600 mb-16 max-w-2xl mx-auto">{t.detallesMateriales}</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {materials.map((material, idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedMaterial(material)}
                className="bg-white p-8 rounded-2xl border border-slate-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 cursor-pointer transform hover:scale-105"
              >
                <div className="text-blue-600 mb-4">{material.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{material.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{material.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="text-2xl font-bold text-blue-600">{material.price}</div>
                  <span className="text-xs font-semibold text-blue-500 bg-blue-50 px-3 py-1 rounded-full">{t.verMas}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Material Details Modal */}
      {selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-white text-4xl">{selectedMaterial.icon}</div>
                <h2 className="text-3xl font-bold">{selectedMaterial.details.title}</h2>
              </div>
              <button 
                onClick={() => setSelectedMaterial(null)}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition"
              >
                <FiX size={24} />
              </button>
            </div>
            
            <div className="p-8">
              <p className="text-lg text-gray-700 mb-6">{selectedMaterial.details.description}</p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-2">📍 {t.mejorPara}</h3>
                  <p className="text-sm text-gray-700">{selectedMaterial.details.bestFor}</p>
                </div>
                <div className="bg-cyan-50 p-6 rounded-xl border border-cyan-200">
                  <h3 className="font-semibold text-gray-900 mb-2">⭐ {t.calidad}</h3>
                  <p className="text-sm text-gray-700">{selectedMaterial.details.quality}</p>
                </div>
              </div>
              
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{t.caracteristicasPrincipales}</h3>
                <ul className="space-y-2">
                  {selectedMaterial.details.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-gray-700">
                      <span className="text-blue-500 font-bold mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-6 mb-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{t.precioPorGramo}</p>
                    <p className="text-3xl font-bold text-blue-600">{selectedMaterial.price}</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedMaterial(null);
                      onNavigate('upload');
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold rounded-xl transition-all transform hover:scale-105"
                  >
                    {t.subirDisenoBtnModal}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Process Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-900">{t.nuestro}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-2xl mb-4 shadow-lg">
                    {step.num}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 text-center">{step.title}</h3>
                  <p className="text-sm text-gray-600 text-center">{step.desc}</p>
                </div>
                {idx < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-1 bg-gradient-to-r from-blue-500 to-transparent"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
