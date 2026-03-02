import React from 'react';
import { FiStar, FiLayers, FiMessageSquare } from 'react-icons/fi';

const reviewsData = [
    {
        id: 1,
        name: 'Carlos Perez',
        rating: 4,
        date: '15 de Enero de 2026',
        comment: 'La verdad muy bien por el producto, lo recomendaría de nuevo si es necesario.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Carlos'
    },
    {
        id: 2,
        name: 'Kevin Gonzalez',
        rating: 3,
        date: '15 de Febrero de 2026',
        comment: 'La verdad muy bien por el producto, lo recomendaría de nuevo si es necesario.',
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Kevin'
    }
];

export default function Reviews() {
    const [activeTab, setActiveTab] = React.useState('valoraciones');
    const [reviews, setReviews] = React.useState(reviewsData);
    const [newReview, setNewReview] = React.useState({ name: '', comment: '', rating: 5 });
    const [showForm, setShowForm] = React.useState(false);

    const averageRating = 4.5;
    const totalReviews = reviews.length;

    const handlePostReview = (e) => {
        e.preventDefault();
        if (!newReview.name || !newReview.comment) return;
        
        const review = {
            id: Date.now(),
            name: newReview.name,
            rating: newReview.rating,
            date: new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' }),
            comment: newReview.comment,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newReview.name}`
        };

        setReviews([review, ...reviews]);
        setNewReview({ name: '', comment: '', rating: 5 });
        setShowForm(false);
    };

    return (
        <div className="flex flex-col gap-6 animate-fadeIn">
            {/* Tabs Header */}
            <div className="flex border-b border-gray-100 mb-2">
                <button 
                    onClick={() => setActiveTab('especificaciones')}
                    className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all relative flex items-center gap-3 ${activeTab === 'especificaciones' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FiLayers size={18} className={activeTab === 'especificaciones' ? 'text-blue-600' : 'text-gray-400'} />
                    Especificaciones
                    {activeTab === 'especificaciones' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                </button>
                <button 
                    onClick={() => setActiveTab('valoraciones')}
                    className={`px-8 py-4 font-black text-sm uppercase tracking-widest transition-all relative flex items-center gap-3 ${activeTab === 'valoraciones' ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
                >
                    <FiMessageSquare size={18} className={activeTab === 'valoraciones' ? 'text-blue-600' : 'text-gray-400'} />
                    Valoraciones
                    {activeTab === 'valoraciones' && <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded-t-full" />}
                </button>
            </div>

            {activeTab === 'especificaciones' ? (
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm animate-fadeIn">
                    <div className="grid grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Dimensiones</h4>
                            <p className="text-gray-600 font-medium">15cm x 12cm x 20cm (Escalable)</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Material Base</h4>
                            <p className="text-gray-600 font-medium">PLA Premium de alta tenacidad</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Tiempo estimado</h4>
                            <p className="text-gray-600 font-medium">24-48 horas de producción</p>
                        </div>
                        <div className="space-y-4">
                            <h4 className="font-black text-[10px] uppercase tracking-[0.2em] text-blue-600">Calidad</h4>
                            <p className="text-gray-600 font-medium">0.12mm - 0.2mm (Alta Resolución)</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-3xl p-10 border border-gray-100 shadow-sm animate-fadeIn">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                        <div className="flex items-center gap-6">
                            <span className="text-6xl font-black text-blue-600 tracking-tighter">
                                {averageRating}
                            </span>
                            <div className="flex flex-col gap-1">
                                <div className="flex gap-1 text-blue-500">
                                    {[...Array(4)].map((_, i) => <FiStar key={i} size={20} fill="currentColor" />)}
                                    <FiStar size={20} className="opacity-30" />
                                </div>
                                <span className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
                                    Basado en {totalReviews} calificaciones
                                </span>
                            </div>
                        </div>
                        <button 
                            onClick={() => setShowForm(!showForm)}
                            className="px-6 py-3 bg-gray-900 hover:bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest transition-all active:scale-95"
                        >
                            {showForm ? 'Cancelar' : 'Escribir Reseña'}
                        </button>
                    </div>

                    {showForm && (
                        <form onSubmit={handlePostReview} className="mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-100 space-y-4 animate-slideDown">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <input 
                                    type="text" 
                                    placeholder="Tu nombre" 
                                    className="px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
                                    value={newReview.name}
                                    onChange={(e) => setNewReview({...newReview, name: e.target.value})}
                                    required
                                />
                                <div className="flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-200">
                                    <span className="text-xs font-black uppercase tracking-widest text-gray-400">Calificación:</span>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button 
                                                key={star} 
                                                type="button"
                                                onClick={() => setNewReview({...newReview, rating: star})}
                                                className={star <= newReview.rating ? 'text-blue-500' : 'text-gray-300'}
                                            >
                                                <FiStar fill={star <= newReview.rating ? 'currentColor' : 'none'} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <textarea 
                                placeholder="Escribe tu comentario aquí..." 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none font-medium h-32 resize-none"
                                value={newReview.comment}
                                onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                                required
                            />
                            <button type="submit" className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black text-xs uppercase tracking-widest transition-all">
                                Publicar Comentario
                            </button>
                        </form>
                    )}

                    <div className="flex flex-col gap-10">
                        {reviews.map((review) => (
                            <div key={review.id} className="flex gap-6 group">
                                <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 border-4 border-gray-50 shadow-sm group-hover:scale-105 transition-transform duration-500">
                                    <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex flex-col flex-1 gap-2 pt-1">
                                    <div className="flex justify-between items-center w-full">
                                        <div className="flex items-center gap-4">
                                            <h5 className="font-black text-gray-900 tracking-tight">{review.name}</h5>
                                            <div className="flex gap-0.5 text-blue-500">
                                                {[...Array(review.rating)].map((_, i) => (
                                                    <FiStar key={i} size={14} fill="currentColor" />
                                                ))}
                                            </div>
                                        </div>
                                        <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest opacity-60">
                                            {review.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                                        {review.comment}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
