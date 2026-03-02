import React, { useState, useRef, useEffect } from 'react';
import { FiChevronDown, FiShoppingCart, FiEye, FiX, FiRotateCw, FiCheck, FiArrowLeft, FiClock, FiCreditCard } from 'react-icons/fi';
import { LuCheck, LuCreditCard, LuUser, LuWallet, LuStickyNote, LuLayers } from 'react-icons/lu';
import { SiVisa, SiMastercard } from 'react-icons/si';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import Reviews from '../components/Reviews';
import moranLogo from '../assets/Moran Creative Logo.png';
import oxxoLogo from '../assets/oxxo-pay.png';
import { FiDownload } from 'react-icons/fi';

export default function Designs({ onNavigate }) {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isRotating, setIsRotating] = useState(true);
    const [isCheckingOut, setIsCheckingOut] = useState(false);
    const [showStepForm, setShowStepForm] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [purchaseCode, setPurchaseCode] = useState('');
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
        cp: '',
        material: 'PLA • $0.05/g',
        color: 'Negro',
        cantidad: 1,
        notas: '',
        paymentMethod: 'card',
        cardNumber: '',
        cardExpiryMonth: '01',
        cardExpiryYear: '2024',
        cardCVV: '',
        cardName: ''
    });
    const [formErrors, setFormErrors] = useState({});

    const getCardBrand = (number) => {
        const cleanNumber = number.replace(/\s/g, '');
        if (cleanNumber.startsWith('4')) return 'visa';
        if (cleanNumber.match(/^5[1-5]/) || cleanNumber.match(/^2[2-7]/)) return 'mastercard';
        return 'unknown';
    };

    const isContactComplete = () => {
        return (
            formData.nombre.trim().length > 0 &&
            formData.email.trim().length > 0 &&
            formData.email.includes('@') &&
            formData.telefono.replace(/\s/g, '').length >= 10 &&
            formData.direccion.trim().length > 0
        );
    };

    const isProjectComplete = () => {
        return formData.material !== '' && formData.color !== '' && formData.cantidad > 0;
    };

    const isPaymentComplete = () => {
        if (formData.paymentMethod === 'oxxo') return true;
        if (formData.paymentMethod === 'card') {
            return (
                formData.cardName.trim().length > 0 &&
                formData.cardNumber.replace(/\s/g, '').length >= 15 &&
                formData.cardCVV.length >= 3
            );
        }
        return false;
    };

    const isNotesComplete = () => formData.notas.trim().length > 0;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (formErrors[field]) {
            setFormErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const handleBuyClick = (item) => {
        setSelectedItem(item);
        setIsCheckingOut(true);
        setShowStepForm(false);
    };

    const handleConfirmPurchase = () => {
        const errors = {};
        
        if (!formData.nombre.trim()) {
            errors.nombre = 'Ingresa tu nombre completo';
        }
        if (!formData.email.trim()) {
            errors.email = 'Ingresa tu correo electrónico';
        } else if (!formData.email.includes('@')) {
            errors.email = 'El correo debe incluir un @';
        }
        if (!formData.telefono.trim()) {
            errors.telefono = 'Ingresa tu número de teléfono';
        } else if (formData.telefono.replace(/\s/g, '').length < 10) {
            errors.telefono = 'El teléfono debe tener 10 dígitos';
        }
        if (!formData.direccion.trim()) {
            errors.direccion = 'Ingresa tu dirección completa';
        }
        
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{15,16}$/)) {
                errors.cardNumber = 'Número de tarjeta inválido';
            }
            if (!formData.cardCVV.match(/^\d{3,4}$/)) {
                errors.cardCVV = 'CVV inválido';
            }
            if (!formData.cardName.trim()) {
                errors.cardName = 'Nombre del Titular requerido';
            }
        }

        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        const code = `ORD-${Date.now().toString(36).toUpperCase()}`;
        setPurchaseCode(code);
        setShowSuccess(true);
    };

    const generatePDF = () => {
        const pdf = new jsPDF();
        const pageWidth = pdf.internal.pageSize.getWidth();
        const margin = 15;
        let y = 20;

        // Logo & Header
        try {
            pdf.addImage(moranLogo, 'PNG', margin, y, 25, 25);
            pdf.setFontSize(22);
            pdf.setFont(undefined, 'bold');
            pdf.text('MAKER LAB', margin + 30, y + 15);
            pdf.setFontSize(9);
            pdf.setFont(undefined, 'normal');
            pdf.text('ORDEN DE COMPRA FORMAL', pageWidth - margin - 50, y + 15);
        } catch (e) {
            pdf.text('MAKER LAB', margin, y + 15);
        }

        y += 40;
        pdf.setFontSize(12);
        pdf.setFont(undefined, 'bold');
        pdf.text('Detalles del Pedido', margin, y);
        pdf.setFontSize(10);
        pdf.setFont(undefined, 'normal');
        y += 10;
        pdf.text(`Orden #: ${purchaseCode}`, margin, y);
        pdf.text(`Fecha: ${new Date().toLocaleDateString()}`, pageWidth - margin - 40, y);
        
        y += 15;
        pdf.setFont(undefined, 'bold');
        pdf.text('Producto', margin, y);
        pdf.text('Precio Unit.', pageWidth - 80, y);
        pdf.text('Cant.', pageWidth - 45, y);
        pdf.text('Total', pageWidth - margin - 15, y);
        
        y += 5;
        pdf.setDrawColor(200);
        pdf.line(margin, y, pageWidth - margin, y);
        
        y += 10;
        pdf.setFont(undefined, 'normal');
        pdf.text(selectedItem.title, margin, y);
        pdf.text(`$${selectedItem.price}`, pageWidth - 80, y);
        pdf.text(formData.cantidad.toString(), pageWidth - 45, y);
        pdf.text(`$${(parseFloat(selectedItem.price) * formData.cantidad).toFixed(2)}`, pageWidth - margin - 15, y);

        y += 20;
        pdf.setFont(undefined, 'bold');
        pdf.text('Datos de Envío', margin, y);
        pdf.setFont(undefined, 'normal');
        y += 7;
        pdf.text(`Nombre: ${formData.nombre}`, margin, y);
        pdf.text(`Email: ${formData.email}`, margin, y + 6);
        pdf.text(`Tel: ${formData.telefono}`, margin, y + 12);
        pdf.text(`Dirección: ${formData.direccion}, ${formData.ciudad}, CP ${formData.cp}`, margin, y + 18);

        y += 40;
        pdf.setFontSize(14);
        pdf.setFont(undefined, 'bold');
        pdf.text(`Total Pagado: $${((parseFloat(selectedItem.price) * formData.cantidad) + 65).toFixed(2)}`, pageWidth - margin - 60, y);

        pdf.save(`Orden_${purchaseCode}.pdf`);
    };

    const galleryItems = [
        {
            id: 3,
            title: 'El padrino',
            description: 'Este diseño de el padrino basado en la pelicula aclamada de 1972, totalmente hecho con materiales de calidad.',
            price: '899.00',
            category: 'Pelicula',
            sales: '492 Vendidos',
            image: 'https://studio3dprint.net/3219-large_default/el-padrino-stl-3d-print-files.jpg'
        },
        {
            id: 4,
            title: 'Darth Vader Busto',
            description: 'Busto detallado de Darth Vader de la saga original. Acabado en resina premium para mayor detalle.',
            price: '450.00',
            category: 'Sci-Fi',
            sales: '320 Vendidos',
            image: 'https://cdn.renderhub.com/3dprintmodel91/darth-vader-star-wars/darth-vader-star-wars-01.jpg'
        },
        {
            id: 5,
            title: 'Spider-Man Acción',
            description: 'Figura de Spider-Man en pose dinámica. Impresión multicolor de alta resistencia a caídas.',
            price: '340.00',
            category: 'Comic',
            sales: '410 Vendidos',
            image: 'https://stlbigstudio.com/wp-content/uploads/spiderman-stl-figura-marvel-impresion-3d-2000x2000.webp'
        },
        {
            id: 6,
            title: 'Goku Super Saiyan',
            description: 'Figura épica de Goku en fase Super Saiyan, pintada a mano. Base decorativa incluida.',
            price: '520.00',
            category: 'Anime',
            sales: '680 Vendidos',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQS6NGs-l2_HcbJ516dJkz2gMAK6qEr_vNgnA&s'
        },
        {
            id: 22,
            title: 'Trofeo Copa Pistón',
            description: 'Réplica detallada del trofeo de la Copa Pistón. El regalo perfecto para fanáticos de la velocidad.',
            price: '450.00',
            category: 'Cine',
            sales: '350 Vendidos',
            image: '/src/assets/products/piston-cup-keychains.jpg'
        },
        {
            id: 23,
            title: 'Exhibidor LEGO F1',
            description: 'Soporte vertical elegante para autos de LEGO F1 (McLaren/Red Bull). Ahorra espacio con estilo.',
            price: '280.00',
            category: 'Decoración',
            sales: '85 Vendidos',
            image: '/src/assets/products/lego-f1-cars.jpg'
        },
        {
            id: 24,
            title: 'Llavero Instax Mini',
            description: 'Mini cámara Instax funcional mecánicamente: presiona para revelar una foto personalizada.',
            price: '120.00',
            category: 'Accesorios',
            sales: '540 Vendidos',
            image: '/src/assets/products/instax-keychain.jpg'
        },
        {
            id: 25,
            title: 'Trofeo Chancla de Oro',
            description: 'El máximo reconocimiento: "La Chancla de Oro para la Mejor Mamá". Impresión de alta calidad.',
            price: '190.00',
            category: 'Regalos',
            sales: '210 Vendidos',
            image: '/src/assets/products/golden-chancla-trophy.jpg'
        },
        {
            id: 26,
            title: 'Lámpara Litofanía',
            description: 'Lámpara decorativa tipo linterna que revela fotos familiares detalladas al encenderse.',
            price: '550.00',
            category: 'Iluminación',
            sales: '45 Vendidos',
            image: '/src/assets/products/lithophane-lantern.jpg'
        },
        {
            id: 27,
            title: 'Pareja Llaveros Coronas',
            description: 'Set de llaveros personalizados con nombres (Jorge y Yareli) y coronas 3D de colores.',
            price: '150.00',
            category: 'Personalizados',
            sales: '180 Vendidos',
            image: '/src/assets/products/crown-keychains.jpg'
        },
        {
            id: 28,
            title: 'Kuromi 3D',
            description: 'Figura decorativa de Kuromi con acabados premium y efecto brillante. Ideal para fans de Sanrio.',
            price: '320.00',
            category: 'Anime',
            sales: '95 Vendidos',
            image: '/src/assets/products/kuromi-3d.jpg'
        },
        {
            id: 29,
            title: 'Snorlax Gigante 3D',
            description: 'Snorlax impreso en azul vibrante con pose clásica de bostezo. Gran tamaño y detalle.',
            price: '480.00',
            category: 'Anime',
            sales: '60 Vendidos',
            image: '/src/assets/products/snorlax-3d.jpg'
        },
        {
            id: 30,
            title: 'Lámpara de Mesa Minimalista',
            description: 'Lámpara de diseño contemporáneo con pantalla estriada blanca y base morada elegante.',
            price: '620.00',
            category: 'Iluminación',
            sales: '30 Vendidos',
            image: '/src/assets/products/modern-lamp.jpg'
        },
        {
            id: 31,
            title: 'Portallaves Batimóvil',
            description: 'Organizador de llaves con diseño icónico del Batimóvil. 5 ganchos resistentes.',
            price: '240.00',
            category: 'Hogar',
            sales: '140 Vendidos',
            image: '/src/assets/products/batmobile-key-holder.jpg'
        },
        {
            id: 32,
            title: 'Soporte Gamer Pro',
            description: 'Soporte dual para audífonos y control de consola. Diseño en negro con detalles turquesa.',
            price: '350.00',
            category: 'Gaming',
            sales: '220 Vendidos',
            image: '/src/assets/products/headphone-controller-stand.jpg'
        },
        {
            id: 33,
            title: 'Portallaves Rust-eze',
            description: 'Diseño basado en el parachoques trasero del Rayo McQueen #95. Incluye ganchos duraderos.',
            price: '210.00',
            category: 'Hogar',
            sales: '75 Vendidos',
            image: '/src/assets/products/rusteze-key-holder.jpg'
        },
        {
            id: 34,
            title: 'Portallaves Skyline Nismo',
            description: 'Para los amantes del JDM: Portallaves con diseño trasero de Nissan Skyline GT-R Nismo.',
            price: '230.00',
            category: 'Hogar',
            sales: '110 Vendidos',
            image: '/src/assets/products/nismo-key-holder.jpg'
        }
    ];

    if (isCheckingOut && selectedItem) {
        const itemPrice = parseFloat(selectedItem.price);
        const shippingPrice = 65.0;
        const subtotal = itemPrice * formData.cantidad;
        const total = subtotal + shippingPrice;

        return (
            <>
                <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
                    <Header onNavigate={onNavigate} currentPage="designs" />
                    
                    <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
                        <button 
                            onClick={() => showStepForm ? setShowStepForm(false) : setIsCheckingOut(false)}
                            className="flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors mb-8 font-black text-[10px] uppercase tracking-[0.2em]"
                        >
                            <FiArrowLeft size={16} /> {showStepForm ? 'Volver al Producto' : 'Regresar'}
                        </button>

                        <div className="flex flex-col w-full gap-10 items-start">
                            {/* LEFT: PRODUCT & REVIEWS (Hidden when form is showing) */}
                            {!showStepForm && (
                                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-12 animate-fadeIn bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
                                    {/* Column 1: Image Gallery Preview */}
                                    <div className="lg:col-span-7 space-y-8">
                                        <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 border border-gray-100 group relative">
                                            <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                            <div className="absolute top-6 right-6 flex flex-col gap-3">
                                                <button className="w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors">
                                                    <FiX size={18} className="rotate-45" /> {/* Mock heartbeat icon */}
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Specs & Reviews Tabs (Simplified) */}
                                        <div className="pt-8 border-t border-gray-100">
                                            <Reviews />
                                        </div>
                                    </div>

                                    {/* Column 2: Commercial Info (Mercado Libre Style) */}
                                    <div className="lg:col-span-5 space-y-6">
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                <span>Nuevo</span>
                                                <span className="opacity-30">|</span>
                                                <span>{selectedItem.sales}</span>
                                            </div>
                                            <h1 className="text-3xl font-black text-gray-900 leading-tight">
                                                {selectedItem.title}
                                            </h1>
                                            <div className="flex items-center gap-1">
                                                {[1,2,3,4,5].map(i => <FiCheck key={i} size={14} className="text-blue-500 fill-blue-500" />)}
                                                <span className="text-[10px] text-blue-600 font-black ml-2 uppercase tracking-wide cursor-pointer hover:underline">137 opiniones</span>
                                            </div>
                                        </div>

                                        <div className="space-y-1 py-4">
                                            <div className="flex items-baseline gap-2">
                                                <span className="text-4xl font-black text-gray-900">$ {total.toFixed(2)}</span>
                                            </div>
                                            <div className="text-xs text-gray-900 font-bold">
                                                en <span className="text-green-600">12 meses de $ {(total/12).toFixed(2)}</span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <SiVisa size={24} className="text-[#1A1F71]" />
                                                <SiMastercard size={24} className="text-[#EB001B]" />
                                                <span className="text-[9px] text-blue-600 font-black uppercase tracking-widest cursor-pointer hover:underline">Más Información</span>
                                            </div>
                                        </div>

                                        <div className="space-y-4 py-6 border-y border-gray-50 text-xs">
                                            <div className="flex gap-3">
                                                <div className="text-green-600 mt-1"><LuCheck size={18} /></div>
                                                <div>
                                                    <p className="font-black text-green-600">Envío gratis a todo el país</p>
                                                    <p className="text-gray-400 font-medium">Conoce los tiempos y las formas de envío.</p>
                                                    <button className="text-blue-600 font-black mt-1 uppercase text-[9px] tracking-widest">Calcular cuándo llega</button>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                <div className="text-green-600 mt-1"><FiRotateCw size={18} /></div>
                                                <div>
                                                    <p className="font-black text-green-600">Devolución gratis</p>
                                                    <p className="text-gray-400 font-medium">Tienes 30 días desde que lo recibes.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6 pt-4">
                                            <div className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Cantidad:</span>
                                                <div className="flex items-center gap-4 px-4 py-2 bg-gray-50 border border-gray-100 rounded-xl">
                                                    <button 
                                                        onClick={() => handleInputChange('cantidad', Math.max(1, formData.cantidad - 1))}
                                                        className="w-5 h-5 flex items-center justify-center font-black text-gray-900 hover:text-blue-600 transition-colors"
                                                    >-</button>
                                                    <span className="font-black text-gray-900 w-4 text-center">{formData.cantidad}</span>
                                                    <button 
                                                        onClick={() => handleInputChange('cantidad', formData.cantidad + 1)}
                                                        className="w-5 h-5 flex items-center justify-center font-black text-gray-900 hover:text-blue-600 transition-colors"
                                                    >+</button>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-400">(+10 disponibles)</span>
                                            </div>

                                            <div className="space-y-3">
                                                <button 
                                                    onClick={() => setShowStepForm(true)}
                                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-xl shadow-blue-100 active:scale-95"
                                                >
                                                    Confirmar y Comprar
                                                </button>
                                                <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest text-center opacity-60">
                                                    Revisa las especificaciones antes de continuar
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* MATCHING UPLOAD.JSX UI: TWO COLUMN GRID */}
                            {showStepForm && (
                                <div className="w-full animate-fadeIn pb-20">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                        {/* Contact Section */}
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex items-start gap-3 mb-4">
                                                <div className="bg-blue-50 text-blue-600 p-3 rounded-lg">
                                                    <LuUser size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-semibold">Contacto</h4>
                                                        {isContactComplete() && (
                                                            <div className="bg-green-500 text-white rounded-full p-0.5 animate-bounce-subtle">
                                                                <LuCheck size={12} />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-500">Datos para que te contactemos</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4">
                                                <div className="mb-4">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">nombre completo</label>
                                                    <input
                                                        type="text"
                                                        value={formData.nombre}
                                                        onChange={(e) => handleInputChange('nombre', e.target.value)}
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.nombre ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'} font-medium text-gray-900`}
                                                        placeholder="Juan Pérez"
                                                    />
                                                    {formErrors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.nombre}</p>}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">correo electrónico</label>
                                                    <input
                                                        type="email"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value)}
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'} font-medium text-gray-900`}
                                                        placeholder="correo@ejemplo.com"
                                                    />
                                                    {formErrors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.email}</p>}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">teléfono</label>
                                                    <input
                                                        type="tel"
                                                        value={formData.telefono}
                                                        onChange={(e) => {
                                                            const val = e.target.value.replace(/\D/g, '');
                                                            const formatted = val
                                                                .replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')
                                                                .substring(0, 12);
                                                            handleInputChange('telefono', formatted);
                                                        }}
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.telefono ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'} font-medium text-gray-900`}
                                                        placeholder="981 399 1081"
                                                        maxLength="12"
                                                    />
                                                    {formErrors.telefono && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.telefono}</p>}
                                                </div>
                                                <div className="mb-4">
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">dirección completa</label>
                                                    <input
                                                        type="text"
                                                        value={formData.direccion}
                                                        onChange={(e) => handleInputChange('direccion', e.target.value)}
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.direccion ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'} font-medium text-gray-900`}
                                                        placeholder="Calle 123, Col. Centro, Campeche"
                                                    />
                                                    {formErrors.direccion && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.direccion}</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Printing Config Section (Pre-filled) */}
                                        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                            <div className="flex items-start gap-3 mb-6">
                                                <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                                                    <LuLayers size={20} />
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-lg font-semibold">Configuración de Impresión</h4>
                                                        <div className="bg-green-500 text-white rounded-full p-0.5 animate-bounce-subtle">
                                                            <LuCheck size={12} />
                                                        </div>
                                                    </div>
                                                    <p className="text-sm text-gray-500">Personaliza los acabados de tu pieza</p>
                                                </div>
                                            </div>

                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">material</label>
                                            <select
                                                value={formData.material || "Resina"}
                                                disabled
                                                className="w-full mt-1.5 mb-6 px-4 py-3 bg-gray-50 rounded-xl border border-gray-200 text-gray-500 cursor-not-allowed font-bold"
                                            >
                                                <option value="PLA">PLA</option>
                                                <option value="PLA+">PLA+</option>
                                                <option value="ABS">ABS</option>
                                                <option value="Resina">Resina</option>
                                            </select>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">color</label>
                                                    <select
                                                        value={formData.color || "Negro"}
                                                        onChange={(e) => handleInputChange('color', e.target.value)}
                                                        className="w-full mt-1.5 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hover:border-purple-400 shadow-sm font-bold text-gray-900"
                                                    >
                                                        <option value="Negro">Negro</option>
                                                        <option value="Blanco">Blanco</option>
                                                        <option value="Rojo">Rojo</option>
                                                        <option value="Azul">Azul</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">cantidad</label>
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        value={formData.cantidad}
                                                        onChange={(e) => handleInputChange('cantidad', parseInt(e.target.value) || 1)}
                                                        className="w-full mt-1.5 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all hover:border-purple-400 shadow-sm font-bold text-gray-900"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Payment Methods Section (Standardized with Upload.jsx) */}
                                    <div className="bg-white rounded-xl p-6 shadow-sm mb-8 border border-gray-100">
                                        <div className="flex items-start gap-3 mb-6">
                                            <div className="bg-green-50 text-green-600 p-3 rounded-lg">
                                                <LuWallet size={20} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="text-lg font-semibold">Método de Pago</h4>
                                                    {isPaymentComplete() && (
                                                        <div className="bg-green-500 text-white rounded-full p-0.5 animate-bounce-subtle">
                                                            <LuCheck size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                                <p className="text-sm text-gray-500">Selecciona cómo deseas realizar tu pago</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <button
                                                onClick={() => handleInputChange('paymentMethod', 'card')}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.paymentMethod === 'card' ? 'border-blue-500 bg-blue-50/30' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                            >
                                                <div className={`p-3 rounded-xl shadow-sm ${formData.paymentMethod === 'card' ? 'bg-blue-600 text-white' : 'bg-white text-gray-400'}`}>
                                                    <FiCreditCard size={24} />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-black text-gray-900 leading-tight">Tarjeta</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Crédito o Débito</div>
                                                </div>
                                            </button>

                                            <button
                                                onClick={() => handleInputChange('paymentMethod', 'oxxo')}
                                                className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all duration-300 ${formData.paymentMethod === 'oxxo' ? 'border-red-500 bg-red-50/30' : 'border-gray-100 hover:border-gray-200 bg-gray-50/50'}`}
                                            >
                                                <div className="p-2 rounded-xl bg-white shadow-sm">
                                                    <img src={oxxoLogo} alt="OXXO Pay" className="h-8 object-contain" />
                                                </div>
                                                <div className="text-left">
                                                    <div className="font-black text-red-600 leading-tight text-sm uppercase tracking-tight">OXXO Pay</div>
                                                    <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pago en Efectivo</div>
                                                </div>
                                            </button>
                                        </div>

                                        {formData.paymentMethod === 'card' && (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn pt-8">
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">nombre del titular</label>
                                                    <input
                                                        type="text"
                                                        value={formData.cardName}
                                                        onChange={(e) => handleInputChange('cardName', e.target.value)}
                                                        placeholder="COMO APARECE EN LA TARJETA"
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-bold uppercase ${formErrors.cardName ? 'border-red-500' : 'border-gray-200'}`}
                                                    />
                                                    {formErrors.cardName && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.cardName}</p>}
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">número de tarjeta</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            value={formData.cardNumber}
                                                            onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                                                            placeholder="0000 0000 0000 0000"
                                                            maxLength="19"
                                                            className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-bold ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                                                        />
                                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                                                            {getCardBrand(formData.cardNumber) === 'visa' && <SiVisa className="text-blue-800" size={24} />}
                                                            {getCardBrand(formData.cardNumber) === 'mastercard' && <SiMastercard className="text-red-500" size={24} />}
                                                        </div>
                                                    </div>
                                                    {formErrors.cardNumber && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.cardNumber}</p>}
                                                </div>
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">expiración (mm/yy)</label>
                                                    <input
                                                        type="text"
                                                        placeholder="00/00"
                                                        className="w-full mt-1.5 px-4 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-bold text-center"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">cvv</label>
                                                    <input
                                                        type="password"
                                                        placeholder="***"
                                                        maxLength="4"
                                                        className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm font-bold text-center ${formErrors.cardCVV ? 'border-red-500' : 'border-gray-200'}`}
                                                    />
                                                    {formErrors.cardCVV && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.cardCVV}</p>}
                                                </div>
                                            </div>
                                        )}

                                        {formData.paymentMethod === 'oxxo' && (
                                            <div className="bg-red-50 border border-red-100 rounded-xl p-5 animate-fadeIn mt-8">
                                                <div className="flex gap-4 items-center">
                                                    <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                                                        <img src={oxxoLogo} alt="OXXO Pay" className="h-8 object-contain" />
                                                    </div>
                                                    <div>
                                                        <h5 className="font-bold text-red-900 uppercase tracking-tight text-xs">Ficha Digital de Pago</h5>
                                                        <p className="text-[10px] text-red-700 font-bold mt-1">Podrás descargar tu ticket con la referencia al finalizar tu pedido.</p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Final Action Button */}
                                    <div className="flex items-center justify-center pt-8">
                                        <button
                                            onClick={handleConfirmPurchase}
                                            className="w-full max-w-2xl bg-gray-900 hover:bg-black text-white py-5 rounded-2xl shadow-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] font-black uppercase tracking-widest text-sm"
                                        >
                                            <FiShoppingCart size={22} /> Confirmar y Comprar
                                        </button>
                                    </div>
                                    <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest mt-6 text-center opacity-40">
                                        Al procesar el pedido, aceptas nuestras políticas de servicio
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Success Overlay */}
                    {showSuccess && (
                        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-white/90 backdrop-blur-md animate-fadeIn">
                            <div className="max-w-md w-full bg-white p-10 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center relative">
                                <button 
                                    onClick={() => { setShowSuccess(false); setIsCheckingOut(false); onNavigate('main'); }}
                                    className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors"
                                >
                                    <FiX size={24} />
                                </button>

                                <div className="w-24 h-24 bg-green-500 text-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl animate-bounce">
                                    <LuCheck size={48} />
                                </div>
                                
                                <h2 className="text-3xl font-black text-gray-900 mb-2">¡Compra Exitosa!</h2>
                                <p className="text-gray-500 text-sm mb-8">Tu pedido <span className="font-bold text-blue-600">{purchaseCode}</span> ha sido procesado correctamente.</p>
                                
                                <button 
                                    onClick={generatePDF}
                                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-lg active:scale-95 mb-4"
                                >
                                    <FiDownload size={20} />
                                    Descargar Orden de Compra
                                </button>

                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Recibirás una copia en tu correo: {formData.email}</p>
                            </div>
                        </div>
                    )}

                    <Footer onNavigate={onNavigate} />
                </div>
            </>
        );
    }

    return (
        <div className="min-h-screen bg-[#f1f1f1] text-gray-800 flex flex-col font-sans">
            <Header onNavigate={onNavigate} currentPage="designs" />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item) => (
                        <div 
                            key={item.id} 
                            onClick={() => setSelectedItem(item)}
                            className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100/50 cursor-pointer group"
                        >
                            <div className="relative h-[280px] w-full overflow-hidden shrink-0 bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop";
                                    }}
                                />
                            </div>
                            <div className="p-6 pt-8 flex-1 flex flex-col relative bg-white">
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-blue-500 font-bold tracking-tight text-xs">{item.category}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-gray-400 font-medium text-[10px] tracking-wide uppercase">{item.sales}</span>
                                    </div>
                                </div>
                                <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors">{item.title}</h3>
                                <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-3 mb-4">{item.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer onNavigate={onNavigate} />
            <ChatWidget />

            {/* Product Detail Modal */}
            {selectedItem && !isCheckingOut && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/80 animate-fadeIn overflow-y-auto">
                    <button 
                        onClick={() => setSelectedItem(null)}
                        className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors bg-white/10 hover:bg-white/20 p-3 rounded-full z-10"
                    >
                        <FiX size={24} />
                    </button>

                    <div className="max-w-6xl w-full my-auto space-y-12 py-12">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                            {/* 3D Preview Simulation */}
                            <div className="relative aspect-square flex items-center justify-center [perspective:2000px]">
                                <div className="absolute inset-x-0 bottom-0 h-24 bg-blue-500/20 blur-[80px] rounded-full translate-y-12" />
                                <div className={`relative w-full max-w-sm aspect-square preserve-3d transition-transform duration-1000 ${isRotating ? 'animate-slowRotate' : ''}`}>
                                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl p-6 overflow-hidden backface-hidden border-4 border-blue-500/20 z-10">
                                        <img src={selectedItem.image} alt={selectedItem.title} className="w-full h-full object-contain drop-shadow-2xl" />
                                    </div>
                                    <div className="absolute inset-0 bg-white rounded-3xl shadow-2xl backface-hidden [transform:rotateY(180deg)] border-4 border-gray-100 flex flex-col items-center justify-center p-8 gap-4 text-center">
                                        <img src={moranLogo} alt="Logo" className="w-24 h-auto opacity-80" />
                                        <span className="text-xl font-black text-gray-900 opacity-60 uppercase tracking-widest leading-none">Maker Lab<br/>Premium Quality</span>
                                    </div>
                                    <div className="absolute inset-y-0 -left-1 w-2 bg-gray-200 origin-left rotate-y-90" />
                                    <div className="absolute inset-y-0 -right-1 w-2 bg-gray-300 origin-right -rotate-y-90" />
                                </div>
                                <button onClick={() => setIsRotating(!isRotating)} className={`absolute -bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs transition-all ${isRotating ? 'bg-blue-600 text-white' : 'bg-white/10 text-white/60 hover:text-white hover:bg-white/20'}`}>
                                    <FiRotateCw className={isRotating ? 'animate-spin-slow' : ''} size={16} />
                                    {isRotating ? 'Pausar Rotación' : 'Activar 3D'}
                                </button>
                            </div>

                            {/* Product Info */}
                            <div className="text-white space-y-8 animate-slideUp">
                                <span className="inline-block px-4 py-1.5 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border border-blue-500/30">
                                    {selectedItem.category}
                                </span>
                                <h2 className="text-6xl font-black leading-none tracking-tighter">
                                    {selectedItem.title}
                                </h2>
                                <p className="text-lg text-white/60 leading-relaxed font-medium max-w-md">
                                    {selectedItem.description}
                                </p>
                                
                                <div className="flex items-center gap-10 py-6">
                                    <div className="flex flex-col">
                                        <span className="text-white/30 text-[10px] font-black uppercase tracking-widest mb-2">Popularidad</span>
                                        <span className="text-xl font-bold text-white/70">{selectedItem.sales}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button 
                                        onClick={() => setIsCheckingOut(true)}
                                        className="flex-1 bg-white text-black hover:bg-blue-50 py-5 rounded-[1.25rem] font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-2xl active:scale-95"
                                    >
                                        <FiEye size={20} className="text-blue-600" />
                                        <span>Ver Producto</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Reviews Section in Modal */}
                        <div className="space-y-6 max-w-4xl mx-auto">
                            <h3 className="text-2xl font-black text-white flex items-center gap-3 border-b border-white/10 pb-6 uppercase tracking-widest">
                                <FiCheck className="text-blue-500" /> Comentarios de clientes
                            </h3>
                            <Reviews />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
