
import React, { useState, useCallback, useEffect } from 'react';
import { StatCard } from './components/StatCard';
import { calculatePreciseAge } from './utils/dateUtils';
import { fetchFunFacts } from './services/geminiService';
import { AgeResult, FunFacts, CalculationStatus } from './types';

const App: React.FC = () => {
  const [birthDate, setBirthDate] = useState<string>('');
  const [ageData, setAgeData] = useState<AgeResult | null>(null);
  const [funFacts, setFunFacts] = useState<FunFacts | null>(null);
  const [status, setStatus] = useState<CalculationStatus>(CalculationStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  const handleCalculate = async () => {
    if (!birthDate) return;
    
    const selectedDate = new Date(birthDate);
    if (selectedDate > new Date()) {
      setError("Ngày sinh không thể ở trong tương lai!");
      return;
    }

    setStatus(CalculationStatus.LOADING);
    setError(null);

    try {
      const age = calculatePreciseAge(selectedDate);
      setAgeData(age);

      const facts = await fetchFunFacts(selectedDate);
      setFunFacts(facts);
      setStatus(CalculationStatus.SUCCESS);
    } catch (err) {
      console.error(err);
      setStatus(CalculationStatus.ERROR);
      setError("Đã tính xong tuổi, nhưng không thể tải thêm thông tin thú vị. Vui lòng thử lại.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col p-4 md:p-8 selection:bg-indigo-500/30">
      {/* Header */}
      <header className="max-w-6xl mx-auto w-full mb-12 flex flex-col items-center text-center">
        <div className="inline-block p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 mb-6">
          <svg className="w-10 h-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
          Nguyen Age Master
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl">
          Nhập ngày sinh của bạn để khám phá những bí mật của dòng thời gian. Chúng tôi tính toán thời gian chính xác cho hành trình của bạn, đến từng ngày cuối cùng.
        </p>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Input Panel */}
          <div className="lg:col-span-4 sticky top-8">
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl">
              <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-indigo-500 rounded-full"></span>
                Xác định Ngày Khởi Đầu
              </h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="birthdate" className="block text-sm font-medium text-slate-400 mb-2">Ngày sinh</label>
                  <input
                    id="birthdate"
                    type="date"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>
                {error && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2 rounded-lg text-sm">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleCalculate}
                  disabled={!birthDate || status === CalculationStatus.LOADING}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl shadow-lg shadow-indigo-900/20 transition-all flex items-center justify-center gap-2 text-lg group"
                >
                  {status === CalculationStatus.LOADING ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Đang tính toán...
                    </>
                  ) : (
                    <>
                      Khám phá Hành trình
                      <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>

            {ageData && (
              <div className="mt-8 bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/20 p-8 rounded-3xl">
                <div className="text-sm font-medium text-indigo-300 uppercase tracking-widest mb-2">Cung Hoàng Đạo</div>
                <div className="text-3xl font-black text-white flex items-center gap-3">
                  {ageData.zodiacSign}
                  <span className="text-2xl">✨</span>
                </div>
              </div>
            )}
          </div>

          {/* Results Area */}
          <div className="lg:col-span-8">
            {ageData ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                {/* Precise Breakdown */}
                <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                    Tuổi Chính Xác
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard label="Năm" value={ageData.years} />
                    <StatCard label="Tháng" value={ageData.months} />
                    <StatCard label="Tuần" value={ageData.weeks} />
                    <StatCard label="Ngày" value={ageData.days} />
                  </div>
                </section>

                {/* Lifetime Totals */}
                <section>
                  <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                    Hành trình Tích lũy
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatCard label="Tổng số Ngày" value={ageData.totalDays.toLocaleString()} colorClass="bg-indigo-900/10" />
                    <StatCard label="Tổng số Giờ" value={ageData.totalHours.toLocaleString()} colorClass="bg-indigo-900/10" />
                    <StatCard label="Tổng số Phút" value={ageData.totalMinutes.toLocaleString()} colorClass="bg-indigo-900/10" />
                  </div>
                </section>

                {/* Fun Insights */}
                {funFacts && (
                  <div className="space-y-8 animate-in fade-in duration-1000">
                    <div className="p-1 rounded-[2.5rem] bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
                      <div className="bg-slate-900 p-8 rounded-[2.3rem]">
                        <h3 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                          Bản chất Tính cách
                        </h3>
                        <p className="text-slate-300 leading-relaxed text-lg italic">
                          "{funFacts.personalityTraits}"
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Historical Events */}
                      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                        <h4 className="text-xl font-bold mb-6 text-indigo-400 flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          Vào Ngày này...
                        </h4>
                        <ul className="space-y-4">
                          {funFacts.historicalEvents.map((event, idx) => (
                            <li key={idx} className="flex gap-4">
                              <span className="flex-shrink-0 w-6 h-6 bg-slate-800 rounded-full flex items-center justify-center text-xs font-bold text-slate-500">
                                {idx + 1}
                              </span>
                              <span className="text-slate-300 text-sm leading-relaxed">{event}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Famous People */}
                      <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-3xl">
                        <h4 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                          Bạn cùng Ngày sinh
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {funFacts.famousBirthdays.map((person, idx) => (
                            <span key={idx} className="px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full text-purple-300 text-sm font-medium">
                              {person}
                            </span>
                          ))}
                        </div>
                        <div className="mt-8">
                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Lời khuyên Hoàng đạo</h4>
                          <p className="text-slate-400 text-sm italic">
                            {funFacts.zodiacWisdom}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-3xl">
                <div className="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-slate-600 mb-2">Kết quả đang Khóa</h3>
                <p className="text-slate-600 max-w-sm">
                  Đang chờ dữ liệu của bạn. Khi bạn nhập ngày sinh, hành trình thời gian và những hiểu biết thú vị sẽ xuất hiện ở đây.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 py-8 border-t border-slate-900 flex flex-col md:flex-row justify-between items-center text-slate-500 text-sm max-w-6xl mx-auto w-full">
        <p>© {new Date().getFullYear()} Nguyen Age Master. Bảo lưu mọi quyền.</p>
        <div className="flex gap-6 mt-4 md:mt-0">
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Chính sách Bảo mật</span>
          <span className="hover:text-indigo-400 cursor-pointer transition-colors">Điều khoản Dịch vụ</span>
        </div>
      </footer>
    </div>
  );
};

export default App;
