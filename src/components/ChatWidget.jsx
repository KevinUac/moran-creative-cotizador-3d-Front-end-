import { useState, useRef, useEffect } from 'react';
import { LuX, LuMessageCircle, LuSend, LuLoader } from 'react-icons/lu';

// Función para obtener respuesta de IA
async function getAIResponse(userMessage) {
  try {
    // Usar una API gratuita de IA - HuggingFace
    const response = await fetch('https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.1', {
      headers: { Authorization: 'Bearer hf_yQwtnZKPfzfKpDWXXXXXXXXXXXXXXXX' }, // Nota: Usar token gratuito o endpoint local
      method: 'POST',
      body: JSON.stringify({
        inputs: `Eres un asistente de atención al cliente para una empresa de impresión 3D llamada "Moran Creative". 
        Responde de forma amable, profesional y concisa en español.
        Contexto de servicios: Ofrecemos impresión 3D con materiales PLA, PLA+, ABS, PETG y Resina.
        
        Pregunta del cliente: ${userMessage}
        
        Respuesta:`,
        parameters: { max_length: 150 }
      }),
    });

    if (!response.ok) {
      // Si la API falla, usar respuestas locales inteligentes
      return getLocalAIResponse(userMessage);
    }

    const result = await response.json();
    return result[0]?.generated_text?.split('Respuesta:')[1]?.trim() || getLocalAIResponse(userMessage);
  } catch (error) {
    // Fallback a respuestas locales si hay error
    return getLocalAIResponse(userMessage);
  }
}

// Sistema de IA local para respuestas sin API externa
function getLocalAIResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Preguntas sobre materiales
  if (lowerMessage.includes('material') || lowerMessage.includes('pla') || lowerMessage.includes('resina') || lowerMessage.includes('abs')) {
    const responses = [
      '📌 **Materiales disponibles:**\n• **PLA**: Ideal para prototipos, económico y fácil de imprimir\n• **PLA+**: Mayor resistencia que PLA\n• **ABS**: Resistente al calor, duradero\n• **Resina**: Máxima precisión para detalles finos\n\n¿Cuál es tu proyecto?',
      '🎨 Contamos con una amplia variedad de colores en cada material. ¿Qué material buscas?',
      'Los materiales varían en precio y propiedades. ¿Es para algo decorativo, funcional o de alta precisión?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Preguntas sobre precios
  if (lowerMessage.includes('precio') || lowerMessage.includes('costo') || lowerMessage.includes('cuánto')) {
    return '💰 Los precios varían según:\n• Material seleccionado\n• Complejidad del diseño\n• Tiempo de impresión\n\nSube tu archivo para una cotización exacta en 24 horas. ¿Necesitas ayuda?';
  }

  // Preguntas sobre tiempo
  if (lowerMessage.includes('tiempo') || lowerMessage.includes('cuánto tarda') || lowerMessage.includes('entrega')) {
    return '⏱️ Nuestros tiempos:\n• **Análisis técnico**: < 24 horas\n• **Impresión**: Depende del tamaño (consulta tu cotización)\n• **Envío**: 2-5 días hábiles\n\n¿Tienes un proyecto urgente?';
  }

  // Preguntas sobre proceso
  if (lowerMessage.includes('proceso') || lowerMessage.includes('cómo funciona') || lowerMessage.includes('funciona')) {
    return '🔄 Nuestro proceso es simple:\n1️⃣ Subes tu archivo STL/OBJ\n2️⃣ Revisamos técnicamente tu diseño\n3️⃣ Te enviamos cotización detallada\n4️⃣ Confirmas y comenzamos\n5️⃣ Recibes tu proyecto\n\n¿Listos para comenzar?';
  }

  // Preguntas sobre archivo
  if (lowerMessage.includes('archivo') || lowerMessage.includes('formato') || lowerMessage.includes('stl') || lowerMessage.includes('obj')) {
    return '📁 Aceptamos:\n• **STL** (recomendado)\n• **OBJ**\n• Tamaño máximo: 100MB\n\n¿Ya tienes tu archivo listo?';
  }

  // Saludos
  if (lowerMessage.includes('hola') || lowerMessage.includes('buenos') || lowerMessage.includes('hi')) {
    return '👋 ¡Hola! Soy la IA de asistencia de Moran Creative. ¿En qué puedo ayudarte con tu proyecto de impresión 3D?';
  }

  // Preguntas sobre contacto/admin
  if (lowerMessage.includes('hablar con') || lowerMessage.includes('admin') || lowerMessage.includes('persona') || lowerMessage.includes('humano')) {
    return '👤 Claro, puedo conectarte con un administrador. Mientras esperas, ¿Cuál es tu consulta específica? Así puede ayudarte mejor.';
  }

  // Preguntas sobre calidad/acabado
  if (lowerMessage.includes('calidad') || lowerMessage.includes('acabado') || lowerMessage.includes('precisión')) {
    return '⭐ Garantizamos:\n• Precisión de ±0.5mm\n• Acabado suave y profesional\n• Revisión de calidad en cada proyecto\n\n¿Qué tipo de acabado necesitas?';
  }

  // Agradecimiento
  if (lowerMessage.includes('gracias') || lowerMessage.includes('thanks')) {
    return '😊 ¡De nada! Estoy aquí para ayudarte. ¿Hay algo más que necesites saber?';
  }

  // Respuesta por defecto inteligente
  const defaultResponses = [
    '💡 Interesante. ¿Puedes contarme más detalles sobre tu proyecto?',
    '🤔 Entendido. ¿Es para un proyecto personal, comercial o educativo?',
    '✨ Suena emocionante. ¿Tienes ya el archivo 3D o necesitas ayuda?',
    '🎯 Bien, aquí estamos para ayudarte. ¿Qué material prefieres?'
  ];
  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: '👋 ¡Hola! Soy la IA de Moran Creative. ¿En qué puedo ayudarte hoy con tu proyecto de impresión 3D?', sender: 'ai', timestamp: new Date(Date.now() - 60000) }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (inputValue.trim()) {
      const newMessage = {
        id: messages.length + 1,
        text: inputValue,
        sender: 'user',
        timestamp: new Date()
      };
      setMessages([...messages, newMessage]);
      setInputValue('');
      setIsLoading(true);

      // Obtener respuesta de IA
      setTimeout(async () => {
        const aiResponse = await getLocalAIResponse(inputValue);
        const aiMessage = {
          id: messages.length + 2,
          text: aiResponse,
          sender: 'ai',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
      }, 300);
    }
  };

  return (
    <>
      {/* Chat Button Flotante */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-12 right-6 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all z-40 hover:scale-110"
        title="Asistente IA"
      >
        {isOpen ? <LuX size={24} /> : <LuMessageCircle size={24} />}
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div className="fixed bottom-28 right-6 w-96 bg-white rounded-2xl shadow-2xl flex flex-col h-96 z-50 animate-fade-in border border-gray-100">
          {/* Header */}
          <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-4 rounded-t-2xl">
            <h3 className="font-semibold">Asistente IA</h3>
            <p className="text-xs text-red-100">Responde al instant</p>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-red-500 text-white rounded-br-none'
                      : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none whitespace-pre-wrap'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 text-gray-800 rounded-lg px-4 py-2 rounded-bl-none flex items-center gap-2">
                  <LuLoader size={14} className="animate-spin" />
                  <span className="text-xs">Pensando...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t border-gray-200 p-3 rounded-b-2xl bg-white flex gap-2">
            <input
              type="text"
              placeholder="Escribe tu pregunta..."
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={e => e.key === 'Enter' && !isLoading && handleSend()}
              disabled={isLoading}
              className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 text-sm disabled:bg-gray-100"
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors disabled:bg-gray-400"
            >
              <LuSend size={18} />
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
