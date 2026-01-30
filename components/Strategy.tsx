import React, { useState } from 'react';
import { BrainCircuit, Loader2, Target, TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { generateStrategicReport } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

const Strategy: React.FC = () => {
    const [report, setReport] = useState<string>('');
    const [loading, setLoading] = useState(false);

    // Mock Context Data representing App State for AI analysis
    const contextData = `
        - عدد الأعضاء: 50
        - الميزانية الحالية: 13000 دج (منخفضة)
        - نسبة الحضور: 92% (ممتازة)
        - عدد الوحدات: 4
        - ملاحظات: نقص في عتاد التخييم، مشاركة ضعيفة في الأنشطة الولائية.
    `;

    const handleGenerate = async () => {
        setLoading(true);
        const result = await generateStrategicReport(contextData);
        setReport(result);
        setLoading(false);
    };

    return (
        <div className="p-8 h-full flex flex-col animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                 <div>
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                        <span className="p-2 bg-purple-500/20 rounded-xl text-purple-400"><BrainCircuit size={32} /></span>
                        مركز التخطيط الاستراتيجي
                    </h2>
                    <p className="text-night-400 mt-2">تحليل البيانات واتخاذ القرارات بدعم من الذكاء الاصطناعي</p>
                 </div>
                 <button 
                    onClick={handleGenerate}
                    disabled={loading}
                    className="flex items-center gap-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-8 py-4 rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-purple-900/40 hover:scale-105 active:scale-95 group"
                 >
                     {loading ? <Loader2 className="animate-spin" /> : <BrainCircuit className="group-hover:rotate-12 transition-transform" />}
                     <span className="font-bold">توليد تقرير (AI)</span>
                 </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1">
                {/* Left Panel: Manual Input & Stats */}
                <div className="lg:col-span-4 space-y-6">
                    <div className="bg-night-800/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
                        <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                            <Target className="text-primary-500" />
                            أهداف الموسم الحالية
                        </h3>
                        <textarea 
                            className="w-full h-40 bg-night-900/50 border border-white/10 rounded-xl p-4 resize-none outline-none focus:border-purple-500 transition-colors text-white placeholder-white/20 text-sm leading-relaxed" 
                            placeholder="أدخل الأهداف الاستراتيجية يدوياً هنا لتتبعها..."
                        ></textarea>
                    </div>
                    
                    <div className="bg-night-800/60 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
                        <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
                            <TrendingUp className="text-emerald-500" />
                            مؤشرات الأداء (KPIs)
                        </h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-night-300">التقدم في المنهج</span>
                                    <span className="text-sm font-bold text-blue-400">60%</span>
                                </div>
                                <div className="w-full h-2 bg-night-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-blue-500 w-[60%] shadow-[0_0_10px_#3b82f6]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm text-night-300">تنفيذ المشاريع</span>
                                    <span className="text-sm font-bold text-emerald-400">30%</span>
                                </div>
                                <div className="w-full h-2 bg-night-900 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500 w-[30%] shadow-[0_0_10px_#10b981]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Panel: AI Output */}
                <div className="lg:col-span-8 bg-gradient-to-br from-night-800/80 to-night-900/80 backdrop-blur-2xl p-8 rounded-3xl border border-purple-500/20 shadow-2xl relative overflow-hidden min-h-[500px]">
                    <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50"></div>
                    
                    {!report && !loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-night-400/50">
                            <div className="w-24 h-24 bg-purple-500/10 rounded-full flex items-center justify-center mb-6 animate-pulse">
                                <BrainCircuit size={48} className="text-purple-500/50" />
                            </div>
                            <p className="text-lg">النظام جاهز للتحليل. اضغط على زر التوليد.</p>
                        </div>
                    )}
                    
                    {loading && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-night-900/50 backdrop-blur-sm">
                            <div className="relative">
                                <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <BrainCircuit size={24} className="text-purple-500" />
                                </div>
                            </div>
                            <p className="mt-6 text-purple-300 animate-pulse font-medium">جاري معالجة البيانات وبناء الاستراتيجية...</p>
                        </div>
                    )}

                    {report && (
                        <div className="prose prose-invert prose-p:text-right prose-headings:text-right max-w-none">
                            <div className="flex items-center gap-2 mb-6 pb-4 border-b border-white/10">
                                <CheckCircle2 className="text-emerald-500" size={20} />
                                <span className="text-emerald-400 text-sm font-mono">تم التوليد بنجاح</span>
                                <span className="mr-auto text-xs text-night-500">{new Date().toLocaleTimeString()}</span>
                            </div>
                            <ReactMarkdown>{report}</ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Strategy;