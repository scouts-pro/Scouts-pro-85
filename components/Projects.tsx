
import React, { useState } from 'react';
import { Project } from '../types';
import { Briefcase, DollarSign, BarChart3, Plus, TrendingUp, X, Save } from 'lucide-react';

interface ProjectsProps {
    projects: Project[];
    onAddProject?: (project: Project) => void;
}

const Projects: React.FC<ProjectsProps> = ({ projects, onAddProject }) => {
    const [showModal, setShowModal] = useState(false);
    const [newProject, setNewProject] = useState<Partial<Project>>({
        name: '',
        budget: 0,
        profit: 0,
        status: 'قيد التخطيط',
        description: ''
    });

    const handleSave = () => {
        if (!newProject.name || !onAddProject) return;
        
        const project: Project = {
            id: Date.now().toString(),
            name: newProject.name,
            budget: Number(newProject.budget),
            profit: Number(newProject.profit),
            status: newProject.status as any,
            description: newProject.description || '',
            managerId: '1' // Defaulting to first member/leader for demo logic
        };

        onAddProject(project);
        setShowModal(false);
        setNewProject({ name: '', budget: 0, profit: 0, status: 'قيد التخطيط', description: '' });
    };

    return (
        <div className="p-6 animate-fade-in">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">المشاريع والاستثمار</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map(project => (
                    <div key={project.id} className="bg-night-800 border border-night-700 rounded-xl p-6 hover:shadow-xl hover:border-primary-600 transition-all duration-300 group">
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-purple-900/30 p-3 rounded-lg text-purple-400 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                <Briefcase size={24} />
                            </div>
                            <span className={`px-2 py-1 rounded text-xs ${
                                project.status === 'جاري' ? 'bg-emerald-900/50 text-emerald-400' : 
                                project.status === 'مكتمل' ? 'bg-blue-900/50 text-blue-400' : 'bg-night-700 text-night-300'
                            }`}>
                                {project.status}
                            </span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{project.name}</h3>
                        <p className="text-sm text-night-300 mb-6 h-10 overflow-hidden">{project.description}</p>
                        
                        <div className="flex justify-between items-end border-t border-night-700 pt-4">
                            <div>
                                <p className="text-xs text-night-400 mb-1">الميزانية</p>
                                <p className="font-mono text-white">{project.budget.toLocaleString()} دج</p>
                            </div>
                            <div className="text-left">
                                <p className="text-xs text-night-400 mb-1">الأرباح المتوقعة</p>
                                <p className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                                    <TrendingUp size={14} /> {project.profit.toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}

                 {/* Add New Project Card */}
                 <button 
                    onClick={() => setShowModal(true)}
                    className="border-2 border-dashed border-night-700 rounded-xl flex flex-col items-center justify-center text-night-400 hover:border-primary-600 hover:text-primary-500 transition-colors min-h-[250px]"
                 >
                    <Plus size={48} className="mb-4 opacity-50" />
                    <span className="font-medium">مشروع جديد</span>
                </button>
            </div>

            {/* Project Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-night-900/90 backdrop-blur-md p-4 animate-fade-in">
                    <div className="bg-night-800 w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Briefcase className="text-purple-500"/> إضافة مشروع استثماري
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-night-400 hover:text-white"><X size={24}/></button>
                        </div>
                        
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-sm text-night-400">اسم المشروع</label>
                                <input type="text" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={newProject.name} onChange={e => setNewProject({...newProject, name: e.target.value})} placeholder="اسم المشروع..." />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm text-night-400">الميزانية المرصودة</label>
                                    <input type="number" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={newProject.budget} onChange={e => setNewProject({...newProject, budget: Number(e.target.value)})} />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-night-400">الربح المتوقع</label>
                                    <input type="number" className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white focus:border-primary-500 outline-none" value={newProject.profit} onChange={e => setNewProject({...newProject, profit: Number(e.target.value)})} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-night-400">الحالة</label>
                                <select className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white outline-none" value={newProject.status} onChange={e => setNewProject({...newProject, status: e.target.value as any})}>
                                    <option value="قيد التخطيط">قيد التخطيط</option>
                                    <option value="جاري">جاري</option>
                                    <option value="مكتمل">مكتمل</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm text-night-400">الوصف</label>
                                <textarea className="w-full bg-night-900 border border-white/10 rounded-xl p-3 text-white h-24 resize-none focus:border-primary-500 outline-none" value={newProject.description} onChange={e => setNewProject({...newProject, description: e.target.value})} placeholder="تفاصيل المشروع..."></textarea>
                            </div>
                        </div>

                        <div className="flex gap-4 mt-8">
                            <button onClick={() => setShowModal(false)} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-bold transition-colors">إلغاء</button>
                            <button onClick={handleSave} className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl font-bold shadow-lg transition-colors flex items-center justify-center gap-2">
                                <Save size={18}/> حفظ المشروع
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Projects;
