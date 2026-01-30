
import React, { useState } from 'react';
import { 
    Tent, ShieldCheck, BrainCircuit, LayoutDashboard, 
    ArrowLeft, Lock, Mail, Eye, EyeOff, Loader2, Star, 
    Sparkles, Compass, Map, Rocket, Maximize, Minimize
} from 'lucide-react';

interface LandingPageProps {
    onLogin: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onLogin }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Direct access simulation (Bypass credentials check)
        setTimeout(() => {
            setIsLoading(false);
            onLogin();
        }, 800);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
            setIsFullscreen(true);
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
                setIsFullscreen(false);
            }
        }
    };

    return (
        <div className="relative min-h-screen w-full overflow-hidden flex items-center justify-center font-sans bg-night-900" dir="rtl">
            
            {/* Fullscreen Toggle Button */}
            <button 
                onClick={toggleFullscreen}
                className="absolute top-6 left-6 z-50 p-3 bg-white/5 border border-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-all backdrop-blur-md hover:scale-110 shadow-lg group"
                title={isFullscreen ? "إنهاء ملء الشاشة" : "ملء الشاشة"}
            >
                {isFullscreen ? (
                    <Minimize size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                ) : (
                    <Maximize size={24} className="group-hover:rotate-90 transition-transform duration-300" />
                )}
            </button>

            {/* --- Advanced Background Layer --- */}
            <div className="absolute inset-0 z-0">
                <img 
                    src="https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?q=80&w=2070&auto=format&fit=crop" 
                    className="w-full h-full object-cover opacity-60 scale-105 animate-pulse-slow" // Subtle zoom effect
                    alt="Camping Night"
                />
                {/* Complex Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-night-900 via-night-900/90 to-purple-900/40 mix-blend-multiply"></div>
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-night-900/50 to-night-900"></div>
                
                {/* Floating Particles/Glows */}
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary-600/20 rounded-full blur-[100px] animate-pulse"></div>
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-600/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
            </div>

            {/* --- Main Content --- */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center h-full py-12">
                
                {/* Right Side: Hero Section (7 cols) */}
                <div className="lg:col-span-7 space-y-10 animate-fade-in hidden lg:block">
                    {/* Badge */}
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/5 border border-white/10 text-white backdrop-blur-md shadow-xl hover:bg-white/10 transition-colors cursor-default">
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                        </span>
                        <span className="text-sm font-bold tracking-wide">الإصدار الذهبي v2.0</span>
                    </div>
                    
                    {/* Typography */}
                    <div className="space-y-4">
                        <h1 className="text-7xl font-black text-white leading-tight drop-shadow-2xl">
                            المستقبل الرقمي <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-emerald-400 animate-gradient-x">للكشافة.</span>
                        </h1>
                        <p className="text-xl text-blue-100/80 leading-relaxed max-w-2xl font-light">
                            منصة Scouts Pro تجمع بين أصالة التقاليد الكشفية وقوة الذكاء الاصطناعي. 
                            أدر الفوج، المالية، والعتاد في واجهة واحدة صممت للإبداع.
                        </p>
                    </div>

                    {/* Feature Grid (Glass Cards) */}
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        {[
                            { icon: BrainCircuit, title: "ذكاء اصطناعي", desc: "تحليل استراتيجي فوري", color: "text-purple-400", bg: "bg-purple-500/10" },
                            { icon: ShieldCheck, title: "حماية قصوى", desc: "تشفير بيانات الأعضاء", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                            { icon: Compass, title: "تخطيط الأنشطة", desc: "إدارة المخيمات بدقة", color: "text-blue-400", bg: "bg-blue-500/10" },
                            { icon: LayoutDashboard, title: "لوحة قيادة", desc: "نظرة شاملة للفوج", color: "text-orange-400", bg: "bg-orange-500/10" },
                        ].map((feat, idx) => (
                            <div key={idx} className="flex items-start gap-4 p-5 rounded-2xl bg-night-800/40 border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all group backdrop-blur-sm cursor-default">
                                <div className={`p-3 rounded-xl ${feat.bg} ${feat.color} group-hover:scale-110 transition-transform shadow-lg`}>
                                    <feat.icon size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg mb-1">{feat.title}</h3>
                                    <p className="text-gray-400 text-sm">{feat.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Left Side: Login Card (5 cols) */}
                <div className="lg:col-span-5 w-full">
                    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden group">
                        
                        {/* Card Glow Effects */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-600/30 rounded-full blur-[80px] group-hover:bg-primary-500/40 transition-colors"></div>
                        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-600/30 rounded-full blur-[80px] group-hover:bg-purple-500/40 transition-colors"></div>
                        
                        <div className="relative z-10 flex flex-col items-center text-center">
                            {/* Logo */}
                            <div className="w-24 h-24 bg-gradient-to-tr from-primary-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg shadow-primary-900/50 mb-8 transform hover:rotate-3 transition-transform duration-500 border border-white/20">
                                <Tent size={48} className="text-white drop-shadow-md" />
                            </div>

                            <h2 className="text-3xl font-black text-white mb-2">مرحباً بالقائد</h2>
                            <p className="text-blue-200/70 text-sm mb-10 max-w-xs">نظام Scouts Pro جاهز للعمل. الوصول السريع مفعل لهذه الجلسة.</p>

                            <form onSubmit={handleLogin} className="w-full space-y-6">
                                {/* Visual Only Inputs (Optional aesthetic) */}
                                <div className="space-y-4 opacity-50 pointer-events-none filter blur-[1px] select-none">
                                    <div className="bg-night-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                                        <Mail size={20} className="text-gray-500"/>
                                        <div className="h-2 w-24 bg-gray-700/50 rounded"></div>
                                    </div>
                                    <div className="bg-night-900/50 border border-white/10 rounded-2xl p-4 flex items-center gap-3">
                                        <Lock size={20} className="text-gray-500"/>
                                        <div className="h-2 w-16 bg-gray-700/50 rounded"></div>
                                    </div>
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full relative overflow-hidden bg-gradient-to-r from-primary-600 to-blue-600 hover:from-primary-500 hover:to-blue-500 text-white font-black py-5 rounded-2xl shadow-xl shadow-primary-900/30 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 group/btn"
                                >
                                    <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                                    {isLoading ? (
                                        <Loader2 className="animate-spin" size={24} />
                                    ) : (
                                        <>
                                            <Rocket size={24} className="group-hover/btn:-translate-y-1 group-hover/btn:translate-x-1 transition-transform" />
                                            <span className="text-lg">دخول فوري للنظام</span>
                                            <ArrowLeft size={20} />
                                        </>
                                    )}
                                </button>
                            </form>

                            <div className="mt-8 pt-6 border-t border-white/5 w-full">
                                <p className="text-gray-500 text-xs flex items-center justify-center gap-2">
                                    <Lock size={12} />
                                    اتصال آمن ومشفر بواسطة Scouts Security™
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
