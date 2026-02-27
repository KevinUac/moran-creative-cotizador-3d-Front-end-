import { FiUploadCloud, FiX, FiDownload } from 'react-icons/fi';
import { LuCheck, LuUser, LuLayers, LuPalette, LuClipboardList, LuStickyNote } from 'react-icons/lu';
import React, { useState, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Header from '../components/Header';
import Footer from '../components/Footer';
import UserProfileAvatar from '../components/UserProfileAvatar';
import ChatWidget from '../components/ChatWidget';

export default function Upload({ onNavigate }) {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    material: 'PLA • $0.05/g',
    color: 'Negro',
    cantidad: 1,
    notas: ''
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [quotationCode, setQuotationCode] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const fileInputRef = useRef(null);

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

    // Encabezado
    pdf.setFillColor(30, 58, 138); // Azul oscuro
    pdf.rect(0, 0, pageWidth, 30, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(24);
    pdf.text('Moran Creative', margin, yPosition + 15);
    pdf.setFontSize(10);
    pdf.text('Cotización de Impresión 3D', pageWidth - margin - 50, yPosition + 15);

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

    yPosition += 10;

    // Separador
    pdf.setDrawColor(200, 200, 200);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    // Información importante
    pdf.setFillColor(230, 245, 255); // Azul muy claro
    pdf.rect(margin, yPosition, pageWidth - margin * 2, 25, 'F');
    pdf.setTextColor(3, 105, 161);
    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.text('⚡ Próximos Pasos:', margin + 3, yPosition + 6);
    pdf.setFont(undefined, 'normal');
    pdf.setFontSize(9);
    pdf.text('1. Revisión técnica de tu archivo (< 24 horas)', margin + 5, yPosition + 12);
    pdf.text('2. Cotización detallada en tu email', margin + 5, yPosition + 17);
    pdf.text('3. Seguimiento en vivo del proceso', margin + 5, yPosition + 22);

    yPosition = pageHeight - margin - 15;

    // Footer
    pdf.setTextColor(100, 100, 100);
    pdf.setFontSize(8);
    pdf.text('© 2026 Moran Creative | www.morancreative.com | info@morancreative.com', pageWidth / 2, yPosition, { align: 'center' });
    pdf.text(`Generado: ${new Date().toLocaleString('es-ES')}`, pageWidth / 2, yPosition + 5, { align: 'center' });

    // Descargar
    pdf.save(`Cotizacion-${quotationCode}.pdf`);
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
    if (!formData.material) {
      errors.material = 'Selecciona un material';
    }
    if (!formData.color) {
      errors.color = 'Selecciona un color';
    }
    if (!formData.cantidad || formData.cantidad < 1) {
      errors.cantidad = 'Ingresa una cantidad válida';
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
          file: file
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
          file: file
        });
      }
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      <Header onNavigate={onNavigate} currentPage="upload" />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12">
        <div className="flex items-center justify-center mb-8">
          <div className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-md text-blue-600">
              <FiUploadCloud size={22} />
            </div>
            <h1 className="text-4xl font-extrabold mb-2">Nuevo Proyecto</h1>
            <p className="text-gray-500">Completa los detalles y recibe una cotización personalizada en 24 horas</p>
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
              <>
                <div className="text-green-500 mb-4">
                  <LuCheck size={48} />
                </div>
                <h3 className="text-xl font-semibold mb-2 text-green-600">Archivo cargado</h3>
                <p className="text-sm text-gray-600 mb-1">{uploadedFile.name}</p>
                <p className="text-xs text-gray-400 mb-4">{uploadedFile.size} MB</p>
                <button
                  onClick={(e) => { e.stopPropagation(); setUploadedFile(null); }}
                  className="text-sm text-red-500 hover:text-red-700 font-medium"
                >
                  ✕ Cambiar archivo
                </button>
              </>
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
                <h4 className="text-lg font-semibold">Contacto</h4>
                <p className="text-sm text-gray-500">Datos para que te contactemos</p>
              </div>
            </div>

            <label className="text-sm text-gray-600">Nombre completo</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              className={`w-full mt-2 mb-1 px-4 py-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formErrors.nombre ? 'border-red-500' : 'border-gray-100'
                }`}
              placeholder="Juan Pérez"
            />
            {formErrors.nombre && <p className="text-red-500 text-xs mt-1 mb-4">{formErrors.nombre}</p>}
            {!formErrors.nombre && <div className="h-5 mb-4"></div>}

            <label className="text-sm text-gray-600">Correo electrónico</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`w-full mt-2 mb-1 px-4 py-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors ${formErrors.email ? 'border-red-500' : 'border-gray-100'
                }`}
              placeholder="correo@ejemplo.com"
            />
            {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-purple-50 text-purple-600 p-3 rounded-lg">
                <LuLayers size={20} />
              </div>
              <div>
                <h4 className="text-lg font-semibold">Especificaciones</h4>
                <p className="text-sm text-gray-500">Elige material, color y cantidad</p>
              </div>
            </div>

            <label className="text-sm text-gray-600">Material</label>
            <select
              value={formData.material}
              onChange={(e) => handleInputChange('material', e.target.value)}
              className={`w-full mt-2 mb-1 px-4 py-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${formErrors.material ? 'border-red-500' : 'border-gray-100'
                }`}
            >
              <option value="">Selecciona un material</option>
              <option value="PLA">PLA • $0.05/g</option>
              <option value="PLA+">PLA+ • $0.07/g</option>
              <option value="ABS">ABS • $0.08/g</option>
              <option value="Resina">Resina • $0.20/g</option>
            </select>
            {formErrors.material && <p className="text-red-500 text-xs mt-1 mb-4">{formErrors.material}</p>}
            {!formErrors.material && <div className="h-5 mb-4"></div>}

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm text-gray-600">Color</label>
                <select
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
                  className={`w-full mt-2 mb-1 px-4 py-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${formErrors.color ? 'border-red-500' : 'border-gray-100'
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
                {formErrors.color && <p className="text-red-500 text-xs mt-1">{formErrors.color}</p>}
              </div>
              <div>
                <label className="text-sm text-gray-600">Cantidad</label>
                <input
                  type="number"
                  min="1"
                  value={formData.cantidad}
                  onChange={(e) => handleInputChange('cantidad', e.target.value)}
                  className={`w-full mt-2 mb-1 px-4 py-3 bg-gray-50 rounded-lg border focus:ring-2 focus:ring-purple-500 focus:outline-none transition-colors ${formErrors.cantidad ? 'border-red-500' : 'border-gray-100'
                    }`}
                />
                {formErrors.cantidad && <p className="text-red-500 text-xs mt-1">{formErrors.cantidad}</p>}
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
              <h4 className="text-lg font-semibold">Notas adicionales</h4>
              <p className="text-sm text-gray-500">Instrucciones especiales, orientación de impresión, acabados personalizados...</p>
            </div>
          </div>
          <textarea
            value={formData.notas}
            onChange={(e) => handleInputChange('notas', e.target.value)}
            className="w-full min-h-[220px] px-4 py-3 mt-2 bg-gray-50 rounded-lg border border-gray-100 resize-y focus:ring-2 focus:ring-amber-500 focus:outline-none"
            placeholder="Escribe aquí..."
          />
        </div>

        {/* Process + CTA */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-500 text-white p-3 rounded-lg shadow-lg">
              <LuClipboardList size={20} />
            </div>
            <div>
              <h4 className="text-lg font-semibold">Proceso de cotización</h4>
              <p className="text-sm text-gray-500">Rápido, transparente y profesional</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="font-semibold">Revisión técnica</div>
              <div className="text-sm text-gray-500">Análisis en menos de 24 horas</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="font-semibold">Cálculo preciso</div>
              <div className="text-sm text-gray-500">Tiempo y cantidad de filamento</div>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4">
              <div className="font-semibold">Cotización detallada</div>
              <div className="text-sm text-gray-500">Enviada directamente a tu email</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="font-semibold">Seguimiento en vivo</div>
              <div className="text-sm text-gray-500">Monitorea el estado en tiempo real</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center">
          <button
            onClick={handleSubmit}
            className="w-full max-w-3xl bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white py-4 rounded-xl shadow-xl flex items-center justify-center gap-3 transition-all active:scale-95"
          >
            <FiUploadCloud size={20} /> Enviar para Cotización
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

      <Footer />
      <ChatWidget />
    </div>
  );
}
