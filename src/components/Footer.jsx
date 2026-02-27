export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-white font-semibold mb-3">Moran Creative</h3>
            <p className="text-sm text-gray-400">Transformando ideas en realidad a través de la impresión 3D profesional.</p>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-white font-semibold mb-3">Servicios</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Impresión PLA</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Impresión ABS</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Resina</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Diseño personalizado</a></li>
            </ul>
          </div>
          
          {/* Info */}
          <div>
            <h4 className="text-white font-semibold mb-3">Información</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="text-gray-400 hover:text-white transition">Precios</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Materiales</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Proceso</a></li>
              <li><a href="#" className="text-gray-400 hover:text-white transition">Contacto</a></li>
            </ul>
          </div>
          
          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-3">Contacto</h4>
            <ul className="space-y-2 text-sm">
              <li className="text-gray-400">+34 123 456 789</li>
              <li className="text-gray-400">info@morancreative.com</li>
              <li className="text-gray-400">Madrid, España</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-6 flex items-center justify-between">
          <p className="text-sm text-gray-400">© 2026 Moran Creative. Todos los derechos reservados.</p>
          <div className="flex gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition">Twitter</a>
            <a href="#" className="text-gray-400 hover:text-white transition">LinkedIn</a>
            <a href="#" className="text-gray-400 hover:text-white transition">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
