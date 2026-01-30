
import React, { useEffect, useRef } from 'react';
import { Section } from '../types';
import { NAV_ITEMS } from '../constants';
import * as Icons from 'lucide-react';
import { Tent, PanelRightClose, PanelRightOpen, ChevronLeft } from 'lucide-react';

interface SidebarProps {
  currentSection: Section;
  onNavigate: (section: Section) => void;
  isOpen: boolean; 
  setIsOpen: (value: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentSection, onNavigate, isOpen, setIsOpen }) => {
  const sidebarRef = useRef<HTMLDivElement>(null);

  // إغلاق القائمة عند الضغط خارجها
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, setIsOpen]);

  return (
    <>
      {/* غطاء شفاف للموبايل عند فتح القائمة */}
      <div 
        className={`fixed inset-0 bg-black/20 backdrop-blur-[1px] z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setIsOpen(false)}
      />

      <aside 
        ref={sidebarRef}
        className={`
          fixed top-0 right-0 h-screen bg-night-900/95 backdrop-blur-xl flex flex-col border-l border-white/5 
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 shadow-2xl
          ${isOpen ? 'w-72 shadow-primary-900/20' : 'w-20'}
          max-md:${isOpen ? 'translate-x-0 w-72' : 'translate-x-full w-72'}
        `}
      >
        {/* زر التبديل الدائم بجانب القائمة */}
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className={`
            absolute -left-4 top-10 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center 
            shadow-lg hover:bg-primary-500 transition-all duration-300 z-[60] border border-white/10
            ${isOpen ? 'rotate-0' : 'rotate-180'}
            max-md:hidden
          `}
        >
          <ChevronLeft size={16} />
        </button>

        {/* منطقة الشعار */}
        <div className="h-20 flex items-center px-5 border-b border-white/5 shrink-0 overflow-hidden">
          <div className="flex items-center gap-4 min-w-max">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shrink-0">
              <Tent className="text-white" size={24} />
            </div>
            <div className={`transition-all duration-500 ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}`}>
              <h1 className="text-xl font-bold text-white tracking-wide">SCOUTS</h1>
              <p className="text-[10px] text-primary-400 font-bold tracking-[0.2em] -mt-1 uppercase">Pro System</p>
            </div>
          </div>
        </div>

        {/* روابط التنقل */}
        <nav className="flex-1 p-3 space-y-2 overflow-y-auto no-scrollbar">
          {NAV_ITEMS.map((item) => {
            const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;
            const isActive = currentSection === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (!isOpen) {
                    setIsOpen(true);
                  } else {
                    onNavigate(item.id as Section);
                    setIsOpen(false);
                  }
                }}
                className={`
                  group relative w-full flex items-center rounded-xl transition-all duration-300 h-12 overflow-hidden
                  ${isActive 
                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-900/20' 
                    : 'text-night-400 hover:bg-white/5 hover:text-white'
                  }
                `}
              >
                {/* الأيقونة - دائماً ظاهرة */}
                <div className="w-14 flex items-center justify-center shrink-0">
                  <IconComponent size={22} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                
                {/* اسم القسم - يظهر عند التوسيع فقط */}
                <span className={`
                  font-bold text-sm whitespace-nowrap transition-all duration-500 flex-1 text-right pr-2
                  ${isOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10 pointer-events-none'}
                `}>
                  {item.label}
                </span>

                {/* مؤشر نشط عند الطي */}
                {isActive && !isOpen && (
                  <div className="absolute left-0 w-1 h-6 bg-white rounded-r-full"></div>
                )}
                
                {/* Tooltip عند الطي */}
                {!isOpen && (
                  <div className="absolute right-full mr-4 px-3 py-1.5 bg-night-800 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity border border-white/10 shadow-xl whitespace-nowrap z-[100] hidden md:block">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* زر سفلي للطي (للتجربة البصرية) */}
        <div className={`p-4 border-t border-white/5 transition-all duration-500 ${isOpen ? 'opacity-100' : 'opacity-0 invisible'}`}>
           <button 
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center justify-center gap-2 p-2 rounded-xl text-night-400 hover:text-white hover:bg-white/5 transition-all"
           >
            <PanelRightClose size={20} />
            <span className="text-xs font-bold">طي القائمة</span>
           </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
