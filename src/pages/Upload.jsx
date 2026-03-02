import { FiUploadCloud, FiX, FiDownload, FiCreditCard } from 'react-icons/fi';
import { LuCheck, LuUser, LuLayers, LuPalette, LuClipboardList, LuStickyNote, LuWallet } from 'react-icons/lu';
import { SiVisa, SiMastercard, SiAmericanexpress } from 'react-icons/si';
import React, { useState, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProfileAvatar from '../components/UserProfileAvatar';
import ChatWidget from '../components/ChatWidget';
import oxxoLogo from '../assets/oxxo-pay.png';
import moranLogo from '../assets/Moran Creative Logo.png';

const ThreeDViewport = ({ file }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || !file) return;

    // Configuración básica
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    const camera = new THREE.PerspectiveCamera(45, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Luces
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 10, 10);
    scene.add(mainLight);

    const backLight = new THREE.DirectionalLight(0x3b82f6, 0.5); // Azul sutil
    backLight.position.set(-10, -10, -10);
    scene.add(backLight);

    // Cargar Archivo
    const fileUrl = URL.createObjectURL(file);
    const extension = file.name.split('.').pop().toLowerCase();
    
    let loader;
    if (extension === 'stl') {
      loader = new STLLoader();
    } else if (extension === 'obj') {
      loader = new OBJLoader();
    }

    if (loader) {
      loader.load(fileUrl, (geometryOrGroup) => {
        let mesh;
        const material = new THREE.MeshPhongMaterial({ 
          color: 0xcccccc, 
          specular: 0x111111, 
          shininess: 200,
          flatShading: true 
        });

        if (extension === 'stl') {
          mesh = new THREE.Mesh(geometryOrGroup, material);
        } else {
          geometryOrGroup.traverse((child) => {
            if (child.isMesh) child.material = material;
          });
          mesh = geometryOrGroup;
        }

        // Centrar y Escalar
        const box = new THREE.Box3().setFromObject(mesh);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);
        
        mesh.position.sub(center);
        scene.add(mesh);

        camera.position.z = maxDim * 2;
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      URL.revokeObjectURL(fileUrl);
      if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, [file]);

  return <div ref={containerRef} className="w-full h-full" />;
};

export default function Upload({ onNavigate }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    material: 'PLA • $0.05/g',
    color: 'Negro',
    cantidad: 1,
    notas: '',
    paymentMethod: '', // 'card' or 'oxxo'
    cardNumber: '',
    cardExpiryMonth: '01',
    cardExpiryYear: '2024',
    cardCVV: '',
    cardName: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [quotationCode, setQuotationCode] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

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
      formData.telefono.trim().length >= 10 &&
      formData.direccion.trim().length > 0
    );
  };

  const isProjectComplete = () => {
    return (
      formData.material !== '' &&
      formData.color !== '' &&
      formData.cantidad > 0
    );
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

  const isNotesComplete = () => {
    return formData.notas.trim().length > 0;
  };

  const ALLOWED_FORMATS = ['stl', 'obj'];
  const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

  // Generar código aleatorio
  const generateQuotationCode = () => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `MOC-${timestamp}-${randomStr}`;
  };

  // Generar PDF
  const generatePDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 15;
    let yPosition = margin;

    // Encabezado Minimalista
    try {
      pdf.addImage(moranLogo, 'PNG', margin, yPosition, 25, 25);
      
      pdf.setTextColor(17, 24, 39); // Gray-900
      pdf.setFontSize(22);
      pdf.setFont(undefined, 'bold');
      pdf.text('MAKER', margin + 28, yPosition + 12);
      
      pdf.setTextColor(37, 99, 235); // Blue-600
      pdf.text('LAB', margin + 58, yPosition + 12);
      
      pdf.setTextColor(107, 114, 128); // Gray-500
      pdf.setFontSize(9);
      pdf.setFont(undefined, 'normal');
      pdf.text('BY MORAN CREATIVE', margin + 28, yPosition + 17);
      
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('COTIZACIÓN FORMAL', pageWidth - margin - 40, yPosition + 12);
    } catch (e) {
      pdf.setTextColor(17, 24, 39);
      pdf.setFontSize(24);
      pdf.text('Moran Creative', margin, yPosition + 15);
    }

    yPosition += 35;

    // Código de cotización
    pdf.setTextColor(3, 105, 161); // Azul cyan
    pdf.setFontSize(12);
    pdf.text('Código de Cotización:', margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(14);
    pdf.setFont(undefined, 'bold');
    pdf.text(quotationCode, margin, yPosition + 7);
    pdf.setFont(undefined, 'normal');
    yPosition += 18;

    // Fecha
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(10);
    const fecha = new Date().toLocaleDateString('es-ES');
    pdf.text(`Fecha: ${fecha}`, margin, yPosition);
    yPosition += 8;

    // Separador
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Datos del contacto
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('Datos de Contacto', margin, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    yPosition += 7;

    pdf.text(`Nombre: ${formData.nombre}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Email: ${formData.email}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Teléfono: ${formData.telefono}`, margin, yPosition);
    yPosition += 6;
    pdf.text(`Dirección: ${formData.direccion}`, margin, yPosition);
    yPosition += 12;

    // Detalles del proyecto
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('Detalles del Proyecto', margin, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    yPosition += 7;

    // Material
    pdf.setTextColor(50, 50, 50);
    pdf.text('Material:', margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.material, margin + 30, yPosition);
    yPosition += 6;

    // Color
    pdf.setTextColor(50, 50, 50);
    pdf.text('Color:', margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.color, margin + 30, yPosition);
    yPosition += 6;

    // Cantidad
    pdf.setTextColor(50, 50, 50);
    pdf.text('Cantidad:', margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.text(formData.cantidad.toString(), margin + 30, yPosition);
    yPosition += 6;

    // Archivo
    pdf.setTextColor(50, 50, 50);
    pdf.text('Archivo:', margin, yPosition);
    pdf.setTextColor(0, 0, 0);
    pdf.text(uploadedFile.name, margin + 30, yPosition);
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text(`Tamaño: ${uploadedFile.size} MB`, margin + 30, yPosition + 5);
    yPosition += 12;

    // Notas adicionales
    if (formData.notas.trim()) {
      pdf.setFontSize(11);
      pdf.setFont(undefined, 'bold');
      pdf.setTextColor(0, 0, 0);
      pdf.text('Notas Adicionales:', margin, yPosition);
      pdf.setFont(undefined, 'normal');
      pdf.setFontSize(10);
      yPosition += 7;

      const notasLines = pdf.splitTextToSize(formData.notas, pageWidth - margin * 2);
      pdf.text(notasLines, margin, yPosition);
      yPosition += notasLines.length * 5 + 5;
    }

    // Pago
    pdf.setFontSize(11);
    pdf.setFont(undefined, 'bold');
    pdf.text('Método de Pago', margin, yPosition);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(10);
    yPosition += 7;
    pdf.text(formData.paymentMethod === 'card' ? 'Tarjeta de Crédito/Débito' : 'Efectivo (OXXO Pay)', margin, yPosition);
    yPosition += 12;

    if (formData.paymentMethod === 'oxxo') {
      pdf.setFillColor(245, 245, 245);
      pdf.rect(margin, yPosition, pageWidth - margin * 2, 40, 'F');
      
      try {
        pdf.addImage(oxxoLogo, 'PNG', margin + 5, yPosition + 5, 30, 10);
      } catch (e) {}

      pdf.setTextColor(0, 0, 0);
      pdf.setFontSize(10);
      pdf.setFont(undefined, 'bold');
      pdf.text('Ficha Digital de Pago', margin + 5, yPosition + 20);
      pdf.setFontSize(12);
      pdf.text('Referencia: 9876 5432 1098 7654', margin + 5, yPosition + 28);
      yPosition += 55;
    }

    // Pie de página
    pdf.setDrawColor(229, 231, 235);
    pdf.line(margin, pageHeight - 30, pageWidth - margin, pageHeight - 30);
    
    pdf.setTextColor(107, 114, 128);
    pdf.setFontSize(8);
    pdf.setFont(undefined, 'normal');
    pdf.text('Esta cotización tiene una vigencia de 15 días.', margin, pageHeight - 20);
    pdf.text('Moran Creative • Maker Lab', margin, pageHeight - 15);
    pdf.text('Generado: ' + new Date().toLocaleString(), pageWidth - margin - 50, pageHeight - 15);

    pdf.save(`Cotizacion_${quotationCode}.pdf`);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleSubmit = () => {
    const errors = {};

    if (!uploadedFile) {
      errors.file = 'Por favor sube un archivo primero';
    }
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
    if (!formData.material) {
      errors.material = 'Selecciona un material';
    }
    if (!formData.color) {
      errors.color = 'Selecciona un color';
    }
    if (!formData.cantidad || formData.cantidad < 1) {
      errors.cantidad = 'Ingresa una cantidad válida';
    }
    if (!formData.paymentMethod) {
      errors.paymentMethod = 'Selecciona un método de pago';
    }
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{16}$/)) errors.cardNumber = 'Número de tarjeta inválido';
      if (!formData.cardCVV.match(/^\d{3,4}$/)) errors.cardCVV = 'CVV inválido';
      if (!formData.cardName.trim()) errors.cardName = 'Nombre del Titular requerido';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Generar código de cotización
    const newCode = generateQuotationCode();
    setQuotationCode(newCode);

    // Simular envío
    console.log('📤 Enviando cotización:', {
      codigo: newCode,
      archivo: uploadedFile.name,
      ...formData
    });

    setShowSuccess(true);
  };

  const validateFile = (file) => {
    const extension = file.name.split('.').pop().toLowerCase();
    if (!ALLOWED_FORMATS.includes(extension)) {
      alert('❌ Solo se aceptan archivos STL u OBJ');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      alert('❌ El archivo no debe exceder 100MB');
      return false;
    }
    return true;
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          rawFile: file
        });
      }
    }
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (validateFile(file)) {
        setUploadedFile({
          name: file.name,
          size: (file.size / 1024 / 1024).toFixed(2),
          rawFile: file
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header onNavigate={onNavigate} currentPage="upload" />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-center mb-12">
          <div className="text-center relative">
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400/10 blur-[80px] rounded-full pointer-events-none" />
            <div className="mx-auto mb-6 w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 text-white animate-bounce-subtle">
              <FiUploadCloud size={28} />
            </div>
            <h1 className="text-5xl font-black mb-3 text-gray-900 tracking-tight flex items-center justify-center gap-3">
              Nuevo <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Proyecto</span>
              {(uploadedFile && isContactComplete()) && (
                <div className="flex-shrink-0 bg-green-500 text-white rounded-full p-1 animate-fadeIn shadow-lg">
                  <LuCheck size={28} />
                </div>
              )}
            </h1>
            <div className="h-1 w-20 bg-blue-600 mx-auto mb-4 rounded-full" />
            <p className="text-gray-500 text-lg max-w-lg mx-auto leading-relaxed">
              Completa los detalles y recibe una cotización personalizada en <span className="text-blue-600 font-bold">24 horas</span>
            </p>
          </div>
        </div>

        {/* Upload dropzone */}
        <div className={`bg-white rounded-2xl shadow-md p-10 mb-8 border transition-colors ${formErrors.file ? 'border-red-500' : 'border-gray-100'
          }`}>
          {formErrors.file && (
            <p className="text-red-500 text-sm font-semibold mb-3 text-center">{formErrors.file}</p>
          )}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            className={`border-2 border-dashed rounded-xl py-24 flex flex-col items-center justify-center transition-colors cursor-pointer ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
              }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {uploadedFile ? (
              <div className="w-full h-full flex flex-col md:flex-row items-center gap-8 px-8 animate-fadeIn">
                <div className="relative group w-full md:w-1/2 aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-gray-800">
                  <ThreeDViewport file={uploadedFile.rawFile} />
                  <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 flex items-center gap-2 pointer-events-none">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] text-white/80 font-black uppercase tracking-widest">Viewport Interactivo</span>
                  </div>
                  <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md rounded-lg px-3 py-1.5 border border-white/20 pointer-events-none">
                    <span className="text-[10px] text-white font-bold uppercase">{uploadedFile.name.split('.').pop()}</span>
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
                    <LuCheck size={12} /> Archivo Verificado
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-2 leading-tight">
                    {uploadedFile.name}
                  </h3>
                  <p className="text-gray-500 text-sm mb-6">
                    El modelo ha sido procesado correctamente. Tamaño total: <span className="font-bold text-gray-900">{uploadedFile.size} MB</span>
                  </p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                      className="px-6 py-2.5 bg-red-50 text-red-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-red-100 transition-colors"
                    >
                      ✕ Quitar
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                      className="px-6 py-2.5 bg-gray-900 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-black transition-colors"
                    >
                      Reemplazar
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="mb-4 p-4 rounded-lg bg-gray-50 text-blue-600">
                  <FiUploadCloud size={36} />
                </div>
                <h3 className="text-xl font-semibold mb-1">Arrastra tu archivo aquí</h3>
                <p className="text-sm text-gray-400 mb-3">o haz click para explorar</p>
                <p className="text-xs text-gray-300">STL, OBJ · Máx. 100MB</p>
              </>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".stl,.obj"
              onChange={handleFileInput}
              className="hidden"
            />
          </div>
        </div>

        {/* Form grid */}
        <div className="grid grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
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
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Nombre completo</label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => handleInputChange('nombre', e.target.value)}
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.nombre ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'
                    }`}
                  placeholder="Juan Pérez"
                />
                {formErrors.nombre && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.nombre}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Correo electrónico</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.email ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'
                    }`}
                  placeholder="correo@ejemplo.com"
                />
                {formErrors.email && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Teléfono</label>
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
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.telefono ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'
                    }`}
                  placeholder="981 399 1081"
                  maxLength="12"
                />
                {formErrors.telefono && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.telefono}</p>}
              </div>

              <div className="mb-4">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Dirección completa</label>
                <input
                  type="text"
                  value={formData.direccion}
                  onChange={(e) => handleInputChange('direccion', e.target.value)}
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all ${formErrors.direccion ? 'border-red-500' : 'border-gray-200 hover:border-blue-400 shadow-sm'
                    }`}
                  placeholder="Calle 123, Col. Centro, Campeche, Mexico"
                />
                {formErrors.direccion && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.direccion}</p>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 ring-1 ring-black/5 hover:ring-blue-500/20 transition-all">
            <div className="flex items-start gap-3 mb-6">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <LuLayers size={20} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-lg font-semibold">Configuración de Impresión</h4>
                  {isProjectComplete() && (
                    <div className="bg-green-500 text-white rounded-full p-0.5 animate-bounce-subtle">
                      <LuCheck size={12} />
                    </div>
                  )}
                </div>
                <p className="text-sm text-gray-500">Personaliza los acabados de tu pieza</p>
              </div>
            </div>

            <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Material</label>
            <select
              value={formData.material}
              onChange={(e) => handleInputChange('material', e.target.value)}
              className={`w-full mt-2 mb-1 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${formErrors.material ? 'border-red-500' : 'border-gray-200 hover:border-purple-400 shadow-sm'
                }`}
            >
              <option value="">Selecciona un material</option>
              <option value="PLA">PLA</option>
              <option value="PLA+">PLA+</option>
              <option value="ABS">ABS</option>
              <option value="Resina">Resina</option>
            </select>
            {formErrors.material && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.material}</p>}
            {!formErrors.material && <div className="h-5 mb-4"></div>}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full mt-2 mb-1 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${formErrors.color ? 'border-red-500' : 'border-gray-200 hover:border-purple-400 shadow-sm'
                    }`}
                >
                  <option value="">Elige color</option>
                  <option value="Negro">Negro</option>
                  <option value="Blanco">Blanco</option>
                  <option value="Rojo">Rojo</option>
                  <option value="Azul">Azul</option>
                  <option value="Verde">Verde</option>
                  <option value="Amarillo">Amarillo</option>
                </select>
                {formErrors.color && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.color}</p>}
              </div>
              <div>
                <label className="text-sm font-bold text-gray-400 uppercase tracking-widest ml-1">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => handleInputChange('cantidad', e.target.value)}
                  className={`w-full mt-2 mb-1 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all ${formErrors.cantidad ? 'border-red-500' : 'border-gray-200 hover:border-purple-400 shadow-sm'
                    }`}
                />
                {formErrors.cantidad && <p className="text-red-500 text-[10px] font-bold mt-1 ml-1">{formErrors.cantidad}</p>}
              </div>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-amber-50 text-amber-600 p-3 rounded-lg">
              <LuStickyNote size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-semibold">Notas adicionales</h4>
                {isNotesComplete() && (
                  <div className="bg-green-500 text-white rounded-full p-0.5 animate-bounce-subtle">
                    <LuCheck size={12} />
                  </div>
                )}
              </div>
              <p className="text-sm text-gray-500">Instrucciones especiales, orientación de impresión, acabados personalizados...</p>
            </div>
          </div>
          <textarea
            value={formData.notas}
            onChange={(e) => handleInputChange('notas', e.target.value)}
            className="w-full min-h-[120px] px-4 py-3 mt-2 bg-white rounded-xl border border-gray-200 resize-y focus:ring-2 focus:ring-amber-500 focus:outline-none hover:border-amber-400 shadow-sm transition-all"
            placeholder="Escribe aquí..."
          />
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
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

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
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
              <div className={`p-2 rounded-xl shadow-sm ${formData.paymentMethod === 'oxxo' ? 'bg-white' : 'bg-white'}`}>
                <img src={oxxoLogo} alt="OXXO Pay" className="h-8 object-contain" />
              </div>
              <div className="text-left">
                <div className="font-black text-red-600 leading-tight">OXXO Pay</div>
                <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Pago en Efectivo</div>
              </div>
            </button>
          </div>

          {formErrors.paymentMethod && <p className="text-red-500 text-sm mb-4 font-semibold">{formErrors.paymentMethod}</p>}

          {/* Card Form */}
          {formData.paymentMethod === 'card' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn py-4 pb-20">
              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Nombre del Titular</label>
                <input
                  type="text"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  placeholder="COMO APARECE EN LA TARJETA"
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${formErrors.cardName ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Número de tarjeta</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.cardNumber}
                    onChange={(e) => handleInputChange('cardNumber', e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                    placeholder="0000 0000 0000 0000"
                    maxLength="19"
                    className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${formErrors.cardNumber ? 'border-red-500' : 'border-gray-200'}`}
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                    {getCardBrand(formData.cardNumber) === 'visa' && (
                      <SiVisa className="text-blue-800 animate-fadeIn" size={24} />
                    )}
                    {getCardBrand(formData.cardNumber) === 'mastercard' && (
                      <SiMastercard className="text-red-500 animate-fadeIn" size={24} />
                    )}
                    {getCardBrand(formData.cardNumber) === 'unknown' && formData.cardNumber.length > 0 && (
                      <div className="text-[10px] font-black text-gray-400 uppercase tracking-tighter bg-gray-100 px-2 py-1 rounded animate-fadeIn">Inválida</div>
                    )}
                    {formData.cardNumber.length === 0 && (
                      <>
                        <SiVisa className="text-gray-300 opacity-50" size={20} />
                        <SiMastercard className="text-gray-300 opacity-50" size={20} />
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">Expiración</label>
                <div className="grid grid-cols-2 gap-2 mt-1.5">
                  <select
                    value={formData.cardExpiryMonth}
                    onChange={(e) => handleInputChange('cardExpiryMonth', e.target.value)}
                    className="w-full px-3 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none transition-all"
                  >
                    {Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0')).map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={formData.cardExpiryYear}
                    onChange={(e) => handleInputChange('cardExpiryYear', e.target.value)}
                    className="w-full px-3 py-3 bg-white rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 shadow-sm outline-none transition-all"
                  >
                    {Array.from({ length: 11 }, (_, i) => (2024 + i).toString()).map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1">CVV</label>
                <input
                  type="password"
                  value={formData.cardCVV}
                  onChange={(e) => handleInputChange('cardCVV', e.target.value.replace(/\D/g, ''))}
                  placeholder="***"
                  maxLength="4"
                  className={`w-full mt-1.5 px-4 py-3 bg-white rounded-xl border focus:ring-2 focus:ring-blue-500 transition-all shadow-sm ${formErrors.cardCVV ? 'border-red-500' : 'border-gray-200'}`}
                />
              </div>
            </div>
          )}

          {/* Oxxo Info */}
          {formData.paymentMethod === 'oxxo' && (
            <div className="bg-red-50 border border-red-100 rounded-xl p-5 animate-fadeIn">
              <div className="flex gap-4 items-center">
                <div className="bg-white p-2 rounded-lg shadow-sm h-fit">
                  <img src={oxxoLogo} alt="OXXO Pay" className="h-10 object-contain" />
                </div>
                <div>
                  <h5 className="font-bold text-red-900 uppercase tracking-tight">Ficha Digital de Pago</h5>
                  <p className="text-sm text-red-700 mt-1">Podrás descargar tu ticket con la referencia al finalizar el envío.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Process Section */}
        <div className="mb-12">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <LuLayers size={20} />
              </div>
              <h5 className="font-black text-gray-900 mb-1">Revisión Técnica</h5>
              <p className="text-xs text-gray-500 leading-relaxed">Análisis de geometría y viabilidad en menos de 24h.</p>
            </div>
            <div className="flex-1 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                <LuClipboardList size={20} />
              </div>
              <h5 className="font-black text-gray-900 mb-1">Cálculo Preciso</h5>
              <p className="text-xs text-gray-500 leading-relaxed">Determinación exacta de materiales y tiempo de impresión.</p>
            </div>
            <div className="flex-1 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-shadow group">
              <div className="w-10 h-10 rounded-xl bg-green-50 text-green-600 flex items-center justify-center mb-4 group-hover:bg-green-600 group-hover:text-white transition-colors">
                <LuCheck size={20} />
              </div>
              <h5 className="font-black text-gray-900 mb-1">Cotización Final</h5>
              <p className="text-xs text-gray-500 leading-relaxed">Envío de propuesta formal detallada a tu correo.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center pb-12">
          <button
            onClick={handleSubmit}
            className="w-full max-w-2xl bg-gray-900 hover:bg-black text-white py-5 rounded-2xl shadow-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] font-black uppercase tracking-widest text-sm"
          >
            <FiUploadCloud size={22} /> Enviar para Cotización
          </button>
        </div>

      </div>

      {/* Success Modal */}
      {showSuccess && (
        <div
          className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 transition-all"
          onClick={() => setShowSuccess(false)}
        >
          <div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-md w-full text-center relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()} // Prevent close when clicking inside modal
          >
            {/* Close Button */}
            <button
              onClick={() => setShowSuccess(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors bg-gray-100 hover:bg-gray-200 p-2 rounded-full"
            >
              <FiX size={20} />
            </button>

            {/* Animated Checkmark SVG */}
            <div className="flex justify-center mb-6 mt-4">
              <svg
                className="w-24 h-24"
                viewBox="0 0 52 52"
              >
                <circle
                  className="animate-success-circle"
                  cx="26"
                  cy="26"
                  r="25"
                />
                <path
                  className="animate-success-check"
                  d="M14.1 27.2l7.1 7.2 16.7-16.8"
                />
              </svg>
            </div>

            <h3 className="text-2xl font-bold mb-4 text-gray-900">¡Cotización enviada!</h3>

            {/* Código de Cotización */}
            <div className="bg-blue-50/50 rounded-xl p-5 mb-6 border border-blue-100">
              <p className="text-xs text-gray-500 mb-1 font-semibold uppercase tracking-wider">Código de Cotización</p>
              <p className="text-xl font-bold text-blue-600 tracking-wider">{quotationCode}</p>
            </div>

            <div className="text-left text-gray-600 mb-8 space-y-3 bg-gray-50 rounded-xl p-5">
              <p className="flex items-start gap-2">
                <span className="text-gray-400 mt-1"><LuCheck size={16} /></span>
                Tu archivo ha sido recibido correctamente
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gray-400 mt-1"><LuCheck size={16} /></span>
                <span>Recibirás una cotización en <strong>menos de 24 horas</strong></span>
              </p>
              <p className="flex items-start gap-2">
                <span className="text-gray-400 mt-1"><LuCheck size={16} /></span>
                <span>Te enviaremos un email a <strong className="break-all">{formData.email}</strong></span>
              </p>
            </div>

            {/* Botón Descargar PDF */}
            {quotationCode && (
              <button
                onClick={generatePDF}
                className="w-full flex items-center justify-center gap-2 bg-[#0ea5e9] hover:bg-[#0284c7] text-white font-semibold py-3.5 px-4 rounded-xl transition-all shadow-md hover:shadow-lg active:scale-95 mb-4"
              >
                <FiDownload size={18} />
                Descargar PDF
              </button>
            )}

            <p className="text-sm text-gray-400">Puedes cerrar esta ventana en cualquier momento</p>
          </div>
        </div>
      )}

      <Footer onNavigate={onNavigate} />
      <ChatWidget />
    </div>
  );
}
