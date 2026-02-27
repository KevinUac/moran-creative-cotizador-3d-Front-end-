import React from 'react';
import { FiChevronDown, FiShoppingCart } from 'react-icons/fi';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';

export default function Designs({ onNavigate }) {
    // Removed BrandBadge component

    const galleryItems = [
        {
            id: 1,
            title: 'Iron Man Pelicula 2006',
            description: 'Este diseño de iron man basado en la pelicula aclamada de 2006, totalmente hecho con materiales de calidad.',
            price: '255.00',
            category: 'Pelicula',
            sales: '500 Vendidos',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTKu5Viv8Ic-sqiLeHtNzv63lSe3EaSxXK13Q&s'
        },
        {
            id: 2,
            title: 'Batman el Caballero de la Noche',
            description: 'Este diseño de batman basado en la pelicula aclamada de 2008, totalmente hecho con materiales de calidad.',
            price: '750.00',
            category: 'Pelicula',
            sales: '497 Vendidos',
            image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnNbiT6ilXi-Be0VKFtEBUZ-OAaK8DXFzHLA&s'
        },
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
            id: 7,
            title: 'Mario Bros Clásico',
            description: 'Figura de Mario retro con acabados mate. Ideal para coleccionistas y estanterías geek.',
            price: '190.00',
            category: 'Videojuegos',
            sales: '850 Vendidos',
            image: 'https://dl.myminifactory.com/object-assets/585cf081753a0/images/720X720-mario.jpg'
        },
        {
            id: 8,
            title: 'Mickey Mouse Vintage',
            description: 'Impresión en resina de Mickey en su diseño clásico en blanco y negro (Steamboat Willie).',
            price: '280.00',
            category: 'Animación',
            sales: '200 Vendidos',
            image: 'https://static.3d-baza.com/models/300457/df765494ede44b3ca3e3bef1.jpg'
        },
        {
            id: 9,
            title: 'Escudo del Capitán América',
            description: 'Réplica a escala del escudo. Acabado metálico hecho a mano sobre impresión PLA reforzado.',
            price: '650.00',
            category: 'Accesorio',
            sales: '150 Vendidos',
            image: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 10,
            title: 'Superman Vuelo',
            description: 'Estatua de Superman despegando de Metrópolis. Efecto de capa al viento muy detallado.',
            price: '820.00',
            category: 'Comic',
            sales: '110 Vendidos',
            image: 'https://images.unsplash.com/photo-1611604548018-d56bbd85d681?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 11,
            title: 'Mandaloriano',
            description: 'Figura de Mandalorian de Star Wars con texturas precisas y acabados realistas mate.',
            price: '950.00',
            category: 'Sci-Fi',
            sales: '990 Vendidos',
            image: 'https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 12,
            title: 'Groot Bebé Maceta',
            description: 'Figura hueca de Groot Bebé para usar como maceta de suculentas. Muy realista.',
            price: '340.00',
            category: 'Decoración',
            sales: '430 Vendidos',
            image: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 13,
            title: 'Halcón Milenario',
            description: 'Nave a escala de Star Wars impresa con alto detalle en resina, ideal para coleccionistas.',
            price: '1150.00',
            category: 'Naves',
            sales: '120 Vendidos',
            image: 'https://images.unsplash.com/photo-1581681284545-2e61acc5ba16?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 14,
            title: 'Stormtrooper',
            description: 'Casco de 30 cm de Stormtrooper, de uso decorativo o coleccionable. Textura suave blanca.',
            price: '790.00',
            category: 'Helmet',
            sales: '230 Vendidos',
            image: 'https://images.unsplash.com/photo-1546561892-65bf811416b9?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 15,
            title: 'BB-8 Droide',
            description: 'Figura a escala de BB-8. No motorizado, impreso en capas muy finas de PLA.',
            price: '1200.00',
            category: 'Sci-Fi',
            sales: '85 Vendidos',
            image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 16,
            title: 'Harry Potter con Varita',
            description: 'Impresión muy detallada de núcleo sólido de Harry Potter, con la cicatriz grabada.',
            price: '180.00',
            category: 'Pelicula',
            sales: '560 Vendidos',
            image: 'https://images.unsplash.com/photo-1618944847023-38aa001235f0?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 17,
            title: 'Pikachu',
            description: 'Figura adorable impresa de Pikachu. Resina lisa lista para ser pintada o ya con colores vivos.',
            price: '460.00',
            category: 'Anime',
            sales: '180 Vendidos',
            image: 'https://images.unsplash.com/photo-1605901309584-818e25960b8f?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 18,
            title: 'Naruto',
            description: 'Figura robusta de Naruto Uzumaki en pose de combate.',
            price: '890.00',
            category: 'Anime',
            sales: '140 Vendidos',
            image: 'https://images.unsplash.com/photo-1613320092329-847e5ed7a123?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 19,
            title: 'Thor Martillo (Mjölnir)',
            description: 'Mjölnir peso ligero para convenciones, impreso en PETG resistente con correa de cuero sintético real.',
            price: '500.00',
            category: 'Accesorio',
            sales: '420 Vendidos',
            image: 'https://images.unsplash.com/photo-1608889825103-eb5ed706fc64?q=80&w=800&auto=format&fit=crop'
        },
        {
            id: 20,
            title: 'Deadpool',
            description: 'Busto estilo realista de Deadpool con textura detallada del traje.',
            price: '680.00',
            category: 'Comic',
            sales: '310 Vendidos',
            image: 'https://images.unsplash.com/photo-1601645191163-3fc0d5d64e35?q=80&w=800&auto=format&fit=crop'
        }
    ];

    return (
        <div className="min-h-screen bg-[#f1f1f1] text-gray-800 flex flex-col font-sans">
            <Header onNavigate={onNavigate} currentPage="designs" />

            <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">

                {/* Sort Dropdown */}
                <div className="flex justify-end mb-8">
                    <button className="flex items-center gap-2 text-sm text-gray-700 bg-transparent hover:bg-gray-200/50 px-3 py-1.5 rounded-md transition-colors font-medium">
                        Mas Vendidos
                        <FiChevronDown size={16} />
                    </button>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {galleryItems.map((item) => (
                        <div key={item.id} className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">

                            {/* Image & Price Section container */}
                            <div className="relative h-[280px] w-full overflow-hidden shrink-0 bg-gray-100">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "https://images.unsplash.com/photo-1615529182904-14819c35db37?q=80&w=800&auto=format&fit=crop"; // fallback image
                                    }}
                                />
                            </div>

                            {/* Content box */}
                            <div className="p-6 pt-8 flex-1 flex flex-col relative bg-white">

                                {/* Top Info Row */}
                                <div className="flex justify-between items-end mb-4">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-blue-500 font-bold tracking-tight text-xs">{item.category}</span>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-gray-900 font-bold text-lg">$ {item.price}</span>
                                        <span className="text-gray-400 font-medium text-[10px] tracking-wide uppercase">{item.sales}</span>
                                    </div>
                                </div>

                                {/* Title */}
                                <h3 className="text-[17px] font-bold text-gray-900 mb-2 leading-tight">
                                    {item.title}
                                </h3>

                                {/* Description */}
                                <p className="text-xs text-gray-500 font-medium mb-6 leading-relaxed line-clamp-3">
                                    {item.description}
                                </p>

                                {/* Buttons (Fixed at bottom) */}
                                <div className="flex gap-3 mt-auto pt-2">
                                    <button className="flex-1 border border-gray-300 bg-white hover:bg-gray-50 text-gray-900 rounded-lg py-2.5 px-2 flex items-center justify-center gap-2 font-semibold text-xs transition-colors group">
                                        <FiShoppingCart size={15} className="text-gray-500 group-hover:text-gray-900 transition-colors" />
                                        <span>Agregar Carrito</span>
                                    </button>
                                    <button className="flex-1 bg-black hover:bg-gray-800 text-white rounded-lg py-2.5 px-2 flex items-center justify-center gap-2 font-semibold text-xs transition-colors">
                                        <FiShoppingCart size={15} />
                                        <span>Comprar</span>
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
            <ChatWidget />
        </div>
    );
}
