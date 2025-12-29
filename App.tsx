import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import { 
  BarChart2, 
  TrendingUp, 
  Database, 
  Target, 
  PieChart, 
  Users, 
  Search, 
  Activity,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Zap,
  Menu,
  X,
  Mail,
  Phone,
  Lock
} from 'lucide-react';
import DataNetworkBackground from './components/DataNetworkBackground';
import AdminDashboard from './components/AdminDashboard';
import { ServiceItem, StatItem, ProcessStep, DifferenceItem } from './types';
import { supabase } from './supabaseClient';

// --- Data & Content ---

const statsData: StatItem[] = [
  { value: "1,200", label: "캠페인 데이터 분석", icon: BarChart2, suffix: "+" },
  { value: "312", label: "평균 ROAS 달성", icon: TrendingUp, suffix: "%" },
  { value: "5TB", label: "월 데이터 처리량", icon: Database, suffix: "+" },
];

const servicesData: ServiceItem[] = [
  {
    icon: Users,
    title: "빅데이터 마케팅 전략",
    description: "고객 행동 데이터를 정밀 분석하여 이탈률을 줄이고 구매 전환률을 극대화하는 최적의 마케팅 퍼널을 설계합니다.",
    iconColor: "text-blue-400"
  },
  {
    icon: Target,
    title: "퍼포먼스 광고 최적화",
    description: "단순 노출이 아닌 ROAS(광고비 대비 매출액) 중심의 운영으로 실시간 성과를 모니터링하고 개선합니다.",
    iconColor: "text-orange-400"
  },
  {
    icon: PieChart,
    title: "AI 고객 세그먼트 분석",
    description: "머신러닝 알고리즘을 활용해 구매 가능성이 높은 타겟 고객군을 자동으로 분류하고 맞춤 메시지를 전달합니다.",
    iconColor: "text-emerald-400"
  },
  {
    icon: Layers,
    title: "CRM & 리텐션 전략",
    description: "첫 구매 고객을 충성 고객으로 전환시킵니다. 재구매율 상승 전략을 통해 고객 생애 가치(LTV)를 극대화합니다.",
    iconColor: "text-amber-400"
  },
  {
    icon: Search,
    title: "SEO & 콘텐츠 인텔리전스",
    description: "검색 데이터 기반으로 고객의 관심사를 파악하고, 유기적 트래픽을 유도하는 콘텐츠 전략을 수립합니다.",
    iconColor: "text-cyan-400"
  },
  {
    icon: Activity,
    title: "데이터 대시보드",
    description: "복잡한 데이터를 한눈에 파악할 수 있는 실시간 성과 시각화 대시보드와 의사결정 리포트를 제공합니다.",
    iconColor: "text-pink-400"
  }
];

const differenceData: DifferenceItem[] = [
  { icon: Cpu, title: "데이터 기반 판단", description: "직감이 아닌 팩트 체크" },
  { icon: Zap, title: "실행 가능한 인사이트", description: "분석을 넘어선 액션 플랜" },
  { icon: CheckCircle2, title: "숫자로 증명", description: "투명한 성과 측정 및 공유" },
  { icon: Layers, title: "통합 구조 설계", description: "광고, 콘텐츠, 전환의 일원화" },
];

const processData: ProcessStep[] = [
  { step: "1", title: "데이터 진단", description: "현황 파악 및 데이터 수집" },
  { step: "2", title: "문제 분석", description: "이탈 구간 및 비효율 요소 발견" },
  { step: "3", title: "전략 설계", description: "맞춤형 KPI 설정 및 액션 플랜 수립" },
  { step: "4", title: "실행 & 테스트", description: "가설 검증 및 A/B 테스트 진행" },
  { step: "5", title: "성과 최적화", description: "데이터 리포팅 및 지속적 고도화" },
];

// --- Sub Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      setMobileMenuOpen(false);
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-dark-900/90 backdrop-blur-md border-b border-white/10 py-4' : 'bg-transparent py-6'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <div className="text-2xl font-bold tracking-tighter flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <span className="text-white text-lg font-black">D</span>
          </div>
          <span className="text-white">DATANOVA</span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">서비스 소개</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">핵심 역량</a>
          <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-gray-300 hover:text-white transition-colors text-sm font-medium">프로세스</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="px-5 py-2 rounded-full border border-white/20 text-white hover:bg-white hover:text-black transition-all text-sm font-medium">
            문의하기
          </a>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 bg-dark-900 border-b border-white/10 p-6 md:hidden flex flex-col gap-4"
        >
          <a href="#about" onClick={(e) => scrollToSection(e, 'about')} className="text-gray-300 hover:text-white py-2">서비스 소개</a>
          <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="text-gray-300 hover:text-white py-2">핵심 역량</a>
          <a href="#process" onClick={(e) => scrollToSection(e, 'process')} className="text-gray-300 hover:text-white py-2">프로세스</a>
          <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="w-full py-3 rounded-lg bg-white text-black font-bold block text-center">문의하기</a>
        </motion.div>
      )}
    </nav>
  );
};

const SectionHeader = ({ title, subtitle, centered = false }: { title: string, subtitle: string, centered?: boolean }) => (
  <div className={`mb-16 ${centered ? 'text-center' : ''}`}>
    <motion.span 
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-pink-500 font-bold text-sm tracking-wider uppercase mb-3 inline-block relative"
    >
      {subtitle}
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-pink-500/50 rounded-full"></span>
    </motion.span>
    <motion.h2 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.1 }}
      className="text-3xl md:text-4xl font-bold text-white leading-tight"
    >
      {title.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}<br className="hidden md:block" />
        </React.Fragment>
      ))}
    </motion.h2>
  </div>
);

const ContactSection = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if(!formData.name || !formData.phone || !formData.email || !formData.message) {
      alert("모든 항목을 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Save to Supabase
      const { error } = await supabase
        .from('messages')
        .insert([
          { 
            name: formData.name, 
            phone: formData.phone, 
            email: formData.email, 
            message: formData.message 
          }
        ]);

      if (error) throw error;

      alert('무료 상담 신청이 접수되었습니다. 빠른 시일 내에 연락드리겠습니다.');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('접수 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-dark-900 relative border-t border-white/5 scroll-mt-28">
      <div className="container mx-auto px-6 max-w-4xl">
        <SectionHeader 
          title="프로젝트 문의하기" 
          subtitle="CONTACT US"
          centered={true}
        />
        <div className="bg-dark-800 p-8 md:p-12 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          
          <form className="space-y-6 relative z-10" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium ml-1">성함</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  placeholder="홍길동"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-medium ml-1">연락처</label>
                <input 
                  type="tel" 
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  placeholder="010-1234-5678"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">이메일</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                placeholder="example@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-400 font-medium ml-1">문의사항</label>
              <textarea 
                rows={5}
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-dark-900/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600 resize-none"
                placeholder="프로젝트 내용, 예산, 일정 등 궁금하신 점을 자유롭게 적어주세요."
              ></textarea>
            </div>

            <div className="pt-4">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? '전송 중...' : '무료 상담 신청하기'}
              </motion.button>
              <p className="text-center text-gray-500 text-xs mt-4">
                보내주신 내용은 담당자 확인 후 24시간 이내에 답변 드립니다.
              </p>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

// --- Main App ---

const App = () => {
  const { scrollYProgress } = useScroll();
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-dark-900 min-h-screen text-white selection:bg-purple-500/30">
      <AdminDashboard isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
      
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-pink-500 origin-left z-[60]"
        style={{ scaleX }}
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <DataNetworkBackground />
        
        {/* Abstract Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }}></div>

        <div className="container mx-auto px-6 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block py-1 px-4 rounded-full border border-purple-500/50 bg-purple-500/10 text-purple-300 text-xs font-bold tracking-widest mb-6 backdrop-blur-sm">
              AI DRIVEN MARKETING
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tight">
              데이터로 증명하는 마케팅,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-white">
                숫자가 매출이 되는 순간
              </span>
            </h1>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              DATANOVA는 빅데이터 분석과 AI 인사이트를 기반으로<br className="hidden md:block"/>
              광고비 낭비 없는 성과형 마케팅 전략을 설계합니다.
            </p>
            
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all"
              >
                무료 데이터 진단 받기 <ArrowRight className="w-5 h-5" />
              </button>
              
              <button 
                onClick={() => scrollToSection('features')}
                className="px-8 py-4 rounded-full border border-white/20 text-white font-bold text-lg hover:border-white hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
              >
                성과 사례 보기
              </button>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 2, duration: 1.5, repeat: Infinity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center pt-2">
            <div className="w-1 h-2 bg-white rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-dark-800 border-y border-white/5">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
             <h3 className="text-xl md:text-2xl font-bold">
               데이터로 성장하는 기업들이 <span className="text-pink-500">DATANOVA</span>를 선택합니다
             </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="p-8 rounded-2xl bg-dark-700/50 border border-white/5 hover:border-purple-500/50 transition-colors group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-purple-500/20 transition-all"></div>
                
                <div className="w-12 h-12 rounded-lg bg-dark-800 flex items-center justify-center mb-6 text-pink-500 group-hover:scale-110 transition-transform duration-300">
                  <stat.icon size={24} />
                </div>
                <div className="text-4xl md:text-5xl font-black text-white mb-2 flex items-baseline">
                  {stat.value}
                  <span className="text-2xl text-purple-400 ml-1">{stat.suffix}</span>
                </div>
                <p className="text-gray-400 font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 relative overflow-hidden scroll-mt-28">
        <div className="container mx-auto px-6">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
                {/* Visual representation of data funnel */}
                <div className="aspect-video bg-gradient-to-b from-dark-800 to-black p-8 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1558494949-efc5270f9c63?q=80&w=2400&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                  <div className="relative z-10 w-full h-full border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-20 h-20 mx-auto rounded-full border-4 border-t-purple-500 border-r-pink-500 border-b-purple-500 border-l-transparent animate-spin mb-4"></div>
                      <p className="text-purple-300 font-mono text-sm">PROCESSING DATA...</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:w-1/2 w-full"
            >
              <span className="text-pink-500 font-bold text-sm tracking-wider uppercase mb-2 block">ABOUT US</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                전략과 데이터가<br />
                만나는 지점
              </h2>
              <p className="text-gray-400 mb-8 leading-relaxed">
                DATANOVA는 감이 아닌 <span className="text-white font-bold">데이터로 의사결정하는</span> 데이터 기반 마케팅 전문 기업입니다. 
                유입부터 전환, 재구매까지 매출 구조 전체를 분석하고 설계하여 지속 가능한 성장을 만듭니다.
              </p>

              <div className="space-y-6">
                {[
                  { title: "데이터 중심 전략 설계", desc: "경험이 아닌 검증된 데이터를 바탕으로 전략을 수립합니다." },
                  { title: "마케팅 퍼널 통합 분석", desc: "단편적 광고 성과가 아닌 전체 고객 여정을 추적합니다." },
                  { title: "단기 성과와 장기 성장", desc: "즉각적인 매출 상승과 브랜드 자산 가치를 동시에 고려합니다." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="mt-1">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <CheckCircle2 size={14} className="text-white" />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="features" className="py-24 bg-dark-800 relative scroll-mt-28">
        <div className="container mx-auto px-6">
          <SectionHeader 
            title="비즈니스 성장을 위한\n데이터 솔루션" 
            subtitle="OUR SERVICES"
            centered={true}
          />
          <p className="text-center text-gray-400 -mt-10 mb-16">고객의 데이터를 가장 가치 있는 자산으로 전환합니다.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesData.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-dark-900/80 p-8 rounded-2xl border border-white/5 hover:border-pink-500/50 transition-all group duration-300 shadow-lg hover:shadow-purple-900/20"
              >
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-dark-800 to-dark-700 border border-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <service.icon className={`${service.iconColor || 'text-white'} relative z-10`} size={28} />
                </div>
                <h3 className="text-xl font-bold mb-4 group-hover:text-purple-400 transition-colors">{service.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{service.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentiation Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold">DATANOVA는 무엇이 다른가요?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {differenceData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex items-center gap-6 p-6 rounded-xl bg-dark-800 border border-white/5"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-pink-500/10 flex items-center justify-center">
                  <item.icon className="text-pink-500" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">{item.title}</h4>
                  <p className="text-gray-400 text-sm">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-24 bg-dark-800 relative scroll-mt-28">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-purple-900/20 via-transparent to-transparent"></div>
        <div className="container mx-auto px-6 relative z-10">
          <SectionHeader 
            title="성공을 위한 5단계 프로세스" 
            subtitle="PROCESS"
            centered={true}
          />
          <p className="text-center text-gray-400 -mt-10 mb-20">체계적인 접근 방식으로 성공 확률을 높입니다.</p>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-purple-500/50 to-transparent -z-10"></div>
            
            {processData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="text-center group"
              >
                <div className="w-24 h-24 mx-auto bg-dark-900 rounded-full border-4 border-dark-800 flex items-center justify-center mb-6 relative group-hover:border-purple-500 transition-colors duration-500">
                  <span className="text-3xl font-black text-white">{item.step}</span>
                  <div className="absolute inset-0 rounded-full border border-white/10 scale-125 opacity-0 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"></div>
                </div>
                <h4 className="text-lg font-bold text-white mb-2">{item.title}</h4>
                <p className="text-xs text-gray-400 px-2">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="rounded-3xl p-12 md:p-20 relative overflow-hidden text-center"
        >
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900 to-blue-900 opacity-80"></div>
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30 mix-blend-overlay"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              당신의 데이터를,<br />
              성장으로 바꿀 준비가 되셨나요?
            </h2>
            <p className="text-purple-100 text-lg mb-10">
              지금 무료로 귀사의 마케팅 데이터를 진단 해 드립니다.<br />
              성장의 기회를 놓치지 마세요.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-full bg-white text-purple-900 font-bold text-lg hover:bg-gray-100 shadow-lg w-full sm:w-auto hover:scale-105 active:scale-95 transition-all"
              >
                무료 데이터 분석 신청
              </button>
              
              <button 
                onClick={() => scrollToSection('contact')}
                className="px-8 py-4 rounded-full border border-white text-white font-bold text-lg hover:bg-white/10 w-full sm:w-auto hover:scale-105 active:scale-95 transition-all"
              >
                전문가 상담 요청
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      <ContactSection />

      {/* Footer */}
      <footer className="bg-black py-12 border-t border-white/5 text-gray-500 text-sm">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
             <div className="w-6 h-6 rounded bg-white text-black flex items-center justify-center font-bold text-xs">D</div>
             <span className="text-white font-bold tracking-wider">DATANOVA</span>
          </div>
          
          <div className="text-center md:text-right">
            <p className="mb-2">© 2023 DATANOVA. All rights reserved. Seoul, Republic of Korea.</p>
          </div>

          <div className="flex gap-4">
             <button onClick={() => setIsAdminOpen(true)} className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors" aria-label="Admin Login">
               <Lock size={14}/>
             </button>
             <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Mail size={14}/></a>
             <a href="#" className="w-8 h-8 rounded-full bg-dark-800 flex items-center justify-center hover:bg-white hover:text-black transition-colors"><Phone size={14}/></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;