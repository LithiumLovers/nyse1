import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, Moon, Sun, ArrowUp, ArrowDown, TrendingUp, 
  Newspaper, Calendar, DollarSign, PieChart, BarChart2, 
  Menu, X, Layers
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar 
} from 'recharts';

/**
 * MOCK DATA SERVICES
 */
const MARKET_DATA = {
  assets: [
    { s: 'NVDA', n: 'NVIDIA Corp', p: 880.00, type: 'stock', sec: 'Tech' },
    { s: 'AAPL', n: 'Apple Inc.', p: 175.50, type: 'stock', sec: 'Tech' },
    { s: 'MSFT', n: 'Microsoft Corp', p: 420.00, type: 'stock', sec: 'Tech' },
    { s: 'AMZN', n: 'Amazon.com', p: 180.00, type: 'stock', sec: 'Consumo' },
    { s: 'GOOGL', n: 'Alphabet Inc.', p: 155.00, type: 'stock', sec: 'Tech' },
    { s: 'TSLA', n: 'Tesla Inc', p: 170.00, type: 'stock', sec: 'Auto' },
    { s: 'AMD', n: 'Advanced Micro Devices', p: 170.00, type: 'stock', sec: 'Semicon' },
    { s: 'JPM', n: 'JPMorgan Chase', p: 195.00, type: 'stock', sec: 'Finance' },
    { s: 'SPY', n: 'SPDR S&P 500', p: 520.00, type: 'etf', sec: 'Index' },
    { s: 'QQQ', n: 'Invesco QQQ', p: 445.00, type: 'etf', sec: 'Tech' },
    { s: 'IWM', n: 'Russell 2000', p: 205.00, type: 'etf', sec: 'Small Cap' },
    { s: 'O', n: 'Realty Income', p: 52.00, type: 'reit', sec: 'Retail' },
    { s: 'AMT', n: 'American Tower', p: 190.00, type: 'reit', sec: 'Specialty' },
    { s: 'PLD', n: 'Prologis Inc', p: 125.00, type: 'reit', sec: 'Industrial' },
  ],
  indices: [
    { n: 'S&P 500', v: 5240.50, c: 0.85 },
    { n: 'Nasdaq 100', v: 18300.10, c: 1.20 },
    { n: 'Dow Jones', v: 39500.22, c: 0.40 },
    { n: 'Russell 2000', v: 2080.50, c: -0.25 },
    { n: 'VIX', v: 13.50, c: -2.10 }
  ],
  news: [
    { 
      id: 1,
      title: "Mercados EUA: S&P 500 busca máximas com força do setor tecnológico", 
      img: "https://images.unsplash.com/photo-1611974765270-ca1258634369?q=80&w=1200", 
      ticker: 'SPY', 
      summary: "O índice S&P 500 opera em alta nesta manhã, impulsionado pelos ganhos robustos das gigantes de tecnologia e dados de inflação que reforçam a tese de pouso suave da economia americana." 
    },
    { 
      id: 2,
      title: "Nvidia lidera rali de IA com novos chips.", 
      img: "https://images.unsplash.com/photo-1624996379697-f01d168b1a52?q=80&w=600", 
      ticker: 'NVDA', 
      summary: "As ações da Nvidia disparam após o anúncio de sua nova arquitetura de GPU, prometendo dobrar a eficiência em data centers." 
    },
    { 
      id: 3,
      title: "Apple enfrenta desafios regulatórios na UE.", 
      img: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?q=80&w=600", 
      ticker: 'AAPL', 
      summary: "A gigante de Cupertino está sob pressão de reguladores europeus sobre suas práticas na App Store." 
    },
    { 
      id: 4,
      title: "Amazon investe em data centers nucleares.", 
      img: "https://images.unsplash.com/photo-1523474253046-8cd2748b5fd2?q=80&w=600", 
      ticker: 'AMZN', 
      summary: "Buscando energia limpa e constante para seus servidores AWS, a Amazon anuncia parceria bilionária para adquirir energia de novas usinas nucleares." 
    },
    { 
      id: 5,
      title: "Realty Income aumenta dividendos mensais.", 
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=600", 
      ticker: 'O', 
      summary: "A 'The Monthly Dividend Company' anuncia mais um aumento em seus proventos, reforçando sua posição como favorita entre investidores de renda passiva." 
    },
    { 
      id: 6,
      title: "Tesla ajusta produção em Xangai.", 
      img: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?q=80&w=600", 
      ticker: 'TSLA', 
      summary: "Tesla reduz temporariamente a produção na Gigafactory da China para atualizações na linha de montagem do Model Y." 
    }
  ],
  events: [
    { time: '10:00', event: 'Discurso do Fed Chair Powell', impact: 'high', actual: '', forecast: '' },
    { time: '11:00', event: 'Vendas de Casas Novas', impact: 'med', actual: '680K', forecast: '675K' },
    { time: '11:30', event: 'Estoques de Petróleo Bruto', impact: 'high', actual: '', forecast: '-1.2M' },
    { time: '14:00', event: 'Leilão Treasury 5 Anos', impact: 'med', actual: '', forecast: '' },
    { time: '16:30', event: 'API Weekly Crude Stock', impact: 'low', actual: '', forecast: '' }
  ]
};

// Hook simulando dados em tempo real
const useMarketData = () => {
  const [data, setData] = useState(MARKET_DATA);

  useEffect(() => {
    // Simular inicialização com variação
    const newData = { ...MARKET_DATA };
    newData.assets = newData.assets.map(a => ({
      ...a,
      change: (Math.random() * 6 - 3),
      price: a.p * (1 + (Math.random() * 0.05 - 0.025))
    }));
    
    // Adicionar variação aos mock news items
    const newsWithChange = newData.news.map(n => {
        const asset = newData.assets.find(a => a.s === n.ticker);
        return { ...n, change: asset ? asset.change : 0 };
    }).sort((a,b) => b.change - a.change); // Sort by gains

    setData({ ...newData, news: newsWithChange });
  }, []);

  return data;
};

// Componente: Sparkline (Mini Gráfico) via SVG
const Sparkline = ({ color, isUp }) => {
  const points = useMemo(() => {
    return Array.from({ length: 10 }, (_, i) => 
      `${i * 20},${Math.random() * 30 + 5}`
    ).join(' ');
  }, []);

  return (
    <svg className="w-full h-10 overflow-visible" viewBox="0 0 180 40" preserveAspectRatio="none">
      <polyline
        fill="none"
        stroke={isUp ? "#22c55e" : "#ef4444"} // Tailwind green-500 / red-500
        strokeWidth="2"
        points={points}
      />
    </svg>
  );
};

// Componente: Card ETF
const ETFCard = ({ etf, onClick }) => {
  const isUp = etf.change >= 0;
  return (
    <div 
      onClick={() => onClick(etf.s)}
      className="min-w-[220px] p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161b22] hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer shadow-sm"
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <div className="font-bold text-lg dark:text-white">{etf.s}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate w-24">{etf.n}</div>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded ${isUp ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
          {isUp ? '+' : ''}{etf.change?.toFixed(2)}%
        </span>
      </div>
      <div className="font-mono font-bold text-xl dark:text-white">${etf.price?.toFixed(2)}</div>
      <div className="mt-2">
        <Sparkline isUp={isUp} />
      </div>
    </div>
  );
};

/**
 * MAIN APP COMPONENT
 */
export default function App() {
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('home');
  const [ticker, setTicker] = useState('NVDA');
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  
  const marketData = useMarketData();

  // Theme Toggle Effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Derived Data Helpers
  const activeStocks = useMemo(() => [...marketData.assets].sort(() => 0.5 - Math.random()).slice(0, 10), [marketData]);
  const gainers = useMemo(() => [...marketData.assets].sort((a,b) => b.change - a.change).slice(0, 10), [marketData]);
  const losers = useMemo(() => [...marketData.assets].sort((a,b) => a.change - b.change).slice(0, 10), [marketData]);
  const etfs = useMemo(() => marketData.assets.filter(a => a.type === 'etf'), [marketData]);
  const currentAsset = useMemo(() => marketData.assets.find(a => a.s === ticker) || marketData.assets[0], [marketData, ticker]);

  const handleSearch = (e) => {
    const term = e.target.value.toUpperCase();
    setSearchTerm(term);
    if (term.length > 0) {
      setSearchResults(marketData.assets.filter(a => a.s.startsWith(term) || a.n.toUpperCase().includes(term)));
    } else {
      setSearchResults([]);
    }
  };

  const selectTicker = (symbol) => {
    setTicker(symbol);
    setView('stock');
    setSearchTerm('');
    setSearchResults([]);
    window.scrollTo(0,0);
  };

  // --- SUB-COMPONENTS (Internal) ---

  const Navbar = () => (
    <nav className="fixed top-0 w-full z-50 bg-white/90 dark:bg-[#161b22]/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 cursor-pointer" onClick={() => setView('home')}>
              <span className="text-xl font-extrabold tracking-tight dark:text-white">
                INVEST<span className="text-blue-500">NYSE</span> PRO
              </span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                {['home', 'stock', 'dividends', 'etfs'].map((v) => (
                  <button
                    key={v}
                    onClick={() => {
                        if (v === 'stock') selectTicker('NVDA');
                        else setView(v);
                    }}
                    className={`px-3 py-2 rounded-md text-sm font-medium uppercase transition-colors ${
                      view === v 
                        ? 'text-blue-600 dark:text-blue-400' 
                        : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
                    }`}
                  >
                    {v === 'stock' ? 'Ações' : v}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="flex items-center bg-gray-100 dark:bg-[#0d1117] rounded border border-gray-300 dark:border-gray-700 focus-within:border-blue-500 transition-colors">
                <div className="pl-3 pr-2 text-gray-500"><Search size={14} /></div>
                <input
                  type="text"
                  className="bg-transparent border-none focus:ring-0 text-sm w-32 sm:w-48 py-1.5 text-gray-900 dark:text-gray-100 placeholder-gray-500"
                  placeholder="Ticker (Ex: AAPL)..."
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              {searchResults.length > 0 && (
                <ul className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-700 rounded shadow-lg max-h-60 overflow-auto z-50">
                  {searchResults.map(res => (
                    <li 
                      key={res.s} 
                      onClick={() => selectTicker(res.s)}
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer flex justify-between items-center border-b border-gray-100 dark:border-gray-800 last:border-0"
                    >
                      <span className="font-bold text-sm dark:text-white">{res.s}</span>
                      <span className="text-xs text-gray-500">{res.type.toUpperCase()}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors"
            >
              {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <div className="hidden sm:flex items-center text-xs font-semibold text-green-600 dark:text-green-400">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              ONLINE
            </div>
          </div>
        </div>
      </div>
    </nav>
  );

  const TickerTape = () => (
    <div className="fixed top-16 w-full z-40 bg-white dark:bg-[#161b22] border-b border-gray-200 dark:border-gray-800 h-8 overflow-hidden flex items-center">
      <div className="animate-marquee whitespace-nowrap flex items-center">
        {[...marketData.assets, ...marketData.assets].map((asset, i) => {
          const isUp = asset.change >= 0;
          return (
            <div key={i} className="inline-flex items-center mx-4 text-xs font-mono">
              <span className="font-bold mr-2 dark:text-white">{asset.s}</span>
              <span className={isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                {asset.price?.toFixed(2)} ({isUp ? '+' : ''}{asset.change?.toFixed(2)}%)
              </span>
            </div>
          )
        })}
      </div>
    </div>
  );

  const MarketTable = ({ title, data, titleColor = "text-gray-900 dark:text-white" }) => (
    <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg overflow-hidden h-full flex flex-col">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-800">
        <h3 className={`text-sm font-bold uppercase tracking-wide ${titleColor}`}>{title}</h3>
      </div>
      <div className="overflow-auto flex-grow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 dark:bg-[#0d1117]">
            <tr>
              <th className="px-4 py-2 text-left font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">Ativo</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">Preço</th>
              <th className="px-4 py-2 text-right font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">%</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {data.map((item) => {
              const isUp = item.change >= 0;
              return (
                <tr 
                  key={item.s} 
                  onClick={() => selectTicker(item.s)}
                  className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-2.5">
                    <span className="font-bold dark:text-white">{item.s}</span>
                    <span className="text-xs text-gray-500 ml-1 hidden sm:inline">({item.n.substring(0,8)}..)</span>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono dark:text-gray-300">{item.price?.toFixed(2)}</td>
                  <td className={`px-4 py-2.5 text-right font-mono font-medium ${isUp ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isUp ? '+' : ''}{item.change?.toFixed(2)}%
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  );

  const HeroSection = () => {
    // Current Hero Item (Static Background) based on selection
    const activeNews = marketData.news[heroIndex] || marketData.news[0];
    const isUp = activeNews.change >= 0;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-8 h-[500px]">
        {/* Main Hero - Static Background Image Style */}
        <div 
          className="lg:col-span-2 relative rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 bg-cover bg-center group cursor-pointer"
          style={{ backgroundImage: `url('${activeNews.img}')` }}
          onClick={() => alert(`Navegando para notícia: ${activeNews.title}`)}
        >
          {/* Static Gradient Overlay for Text Readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent z-10"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
            <span className="inline-block px-2 py-1 mb-3 text-xs font-bold text-white bg-red-600 rounded uppercase tracking-wider">Manchete</span>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight drop-shadow-lg">
              {activeNews.title}
            </h1>
            <p className="text-gray-200 text-sm md:text-base mb-4 line-clamp-2 max-w-2xl drop-shadow-md">
              {activeNews.summary}
            </p>
            
            <div className="inline-flex items-center bg-gray-900/80 backdrop-blur-sm border border-gray-700 rounded px-3 py-2">
              <span className="font-bold text-blue-400 mr-3">{activeNews.ticker}</span>
              <span className={`font-mono font-bold ${isUp ? 'text-green-400' : 'text-red-400'}`}>
                {isUp ? '+' : ''}{activeNews.change?.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>

        {/* Side List */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg flex flex-col overflow-hidden">
          <div className="flex-grow overflow-y-auto">
            {marketData.news.map((item, idx) => (
              <div 
                key={item.id}
                onClick={() => setHeroIndex(idx)}
                className={`relative p-4 border-b border-gray-200 dark:border-gray-800 cursor-pointer transition-colors h-1/5 min-h-[90px] flex flex-col justify-end bg-cover bg-center group`}
                style={{ backgroundImage: `url('${item.img}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40 z-0"></div>
                <div className="relative z-10">
                  <h4 className={`text-xs font-semibold mb-2 line-clamp-2 text-gray-100 group-hover:text-blue-400 transition-colors ${heroIndex === idx ? 'text-blue-400' : ''}`}>
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-blue-300 bg-gray-900/60 px-1.5 py-0.5 rounded border border-gray-700">{item.ticker}</span>
                    <span className={`text-[10px] font-mono ${item.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {item.change >= 0 ? '+' : ''}{item.change?.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // --- VIEWS ---

  const HomeView = () => (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20 animate-fade-in">
      <HeroSection />

      {/* ETF Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold flex items-center gap-2 dark:text-white">
            <Layers className="text-blue-500" size={20} />
            ETFs Globais em Destaque
          </h2>
          <span className="text-xs font-medium text-gray-500 uppercase border border-gray-300 dark:border-gray-700 px-2 py-1 rounded">Mercado EUA</span>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {etfs.map(etf => <ETFCard key={etf.s} etf={etf} onClick={selectTicker} />)}
        </div>
      </div>

      {/* Data Grid 3 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="h-96"><MarketTable title="Ações Mais Ativas" data={activeStocks} /></div>
        <div className="h-96"><MarketTable title="Maiores Altas (Top 10)" data={gainers} titleColor="text-green-600 dark:text-green-400" /></div>
        <div className="h-96"><MarketTable title="Maiores Baixas (Top 10)" data={losers} titleColor="text-red-600 dark:text-red-400" /></div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Indices */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
            <h3 className="font-bold text-sm uppercase dark:text-white">Principais Índices</h3>
            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 px-2 py-0.5 rounded">EUA</span>
          </div>
          <table className="w-full text-sm">
            <tbody>
              {marketData.indices.map(idx => (
                <tr key={idx.n} className="border-b border-gray-100 dark:border-gray-800 last:border-0">
                  <td className="py-2 font-bold dark:text-gray-200">{idx.n}</td>
                  <td className="py-2 text-right font-mono dark:text-gray-300">{idx.v.toFixed(2)}</td>
                  <td className={`py-2 text-right font-mono ${idx.c >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {idx.c > 0 ? '+' : ''}{idx.c}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Heatmap */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <h3 className="font-bold text-sm uppercase mb-4 dark:text-white">S&P 500 Heatmap</h3>
          <div className="flex flex-wrap content-start gap-1 h-64 overflow-hidden">
            {marketData.assets.map(a => {
              const color = a.change >= 0 
                ? `rgba(34, 197, 94, ${0.3 + Math.abs(a.change)/10})` 
                : `rgba(239, 68, 68, ${0.3 + Math.abs(a.change)/10})`;
              const width = Math.max(15, Math.random() * 30) + '%';
              return (
                <div 
                  key={a.s}
                  onClick={() => selectTicker(a.s)}
                  style={{ width, backgroundColor: color, height: '60px' }}
                  className="flex-grow flex flex-col items-center justify-center cursor-pointer hover:brightness-110 transition-all text-xs font-bold text-white shadow-sm"
                >
                  <span>{a.s}</span>
                  <span className="text-[10px]">{a.change?.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Economic Events */}
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4 border-b border-gray-200 dark:border-gray-800 pb-2">
            <h3 className="font-bold text-sm uppercase dark:text-white">Agenda Econômica</h3>
            <span className="text-xs bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 px-2 py-0.5 rounded">HOJE</span>
          </div>
          <div className="space-y-3">
            {marketData.events.map((evt, i) => (
              <div key={i} className="flex items-center text-sm border-b border-gray-100 dark:border-gray-800 pb-2 last:border-0 last:pb-0">
                <span className="font-mono text-gray-500 w-12 text-xs">{evt.time}</span>
                <div className="flex-grow ml-2">
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${evt.impact === 'high' ? 'bg-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]' : evt.impact === 'med' ? 'bg-yellow-500' : 'bg-blue-500'}`}></span>
                    <span className="font-medium dark:text-gray-200 line-clamp-1">{evt.event}</span>
                  </div>
                  <div className="ml-4 text-xs text-gray-400 mt-0.5">
                    Forecast: {evt.forecast || '--'} <span className="mx-1">|</span> Actual: <span className="text-white">{evt.actual || '--'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );

  const StockView = () => {
    const isUp = currentAsset.change >= 0;
    const chartData = Array.from({length: 30}, (_, i) => ({
      date: i,
      value: currentAsset.price * (1 + Math.sin(i) * 0.05 + Math.random() * 0.02)
    }));

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20 animate-fade-in">
        <button onClick={() => setView('home')} className="mb-4 text-sm text-gray-500 hover:text-blue-500 flex items-center">
          ← Voltar ao Terminal
        </button>
        
        <div className="bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold dark:text-white flex items-center gap-3">
                {currentAsset.s} 
                <span className="text-lg font-normal text-gray-500">{currentAsset.n}</span>
              </h1>
              <div className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded border border-gray-200 dark:border-gray-700">{currentAsset.type.toUpperCase()}</span>
                <span>•</span>
                <span>{currentAsset.sec}</span>
                <span>•</span>
                <span>NASDAQ</span>
              </div>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-4xl font-mono font-bold dark:text-white">${currentAsset.price.toFixed(2)}</div>
              <div className={`text-lg font-bold flex items-center justify-end ${isUp ? 'text-green-500' : 'text-red-500'}`}>
                {isUp ? <ArrowUp size={20} /> : <ArrowDown size={20} />}
                {currentAsset.change.toFixed(2)}%
              </div>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} vertical={false} />
                <XAxis dataKey="date" hide />
                <YAxis domain={['auto', 'auto']} orientation="right" tick={{fill: theme === 'dark' ? '#9ca3af' : '#4b5563'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderColor: '#374151', color: theme === 'dark' ? '#fff' : '#000' }}
                  itemStyle={{ color: theme === 'dark' ? '#fff' : '#000' }}
                  formatter={(val) => [`$${val.toFixed(2)}`, 'Preço']}
                />
                <Area type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-800">
            {[
              { l: 'Capitalização', v: '2.5T USD' },
              { l: 'P/L (P/E)', v: '65.2x' },
              { l: 'Div. Yield', v: '0.02%' },
              { l: 'Vol (Méd)', v: '45M' }
            ].map((stat) => (
              <div key={stat.l}>
                <div className="text-xs text-gray-500 uppercase">{stat.l}</div>
                <div className="font-mono font-bold dark:text-gray-200">{stat.v}</div>
              </div>
            ))}
          </div>
        </div>
      </main>
    );
  };

  const DividendView = () => {
    const [inv, setInv] = useState(10000);
    const [price, setPrice] = useState(150);
    const [div, setDiv] = useState(3.50);
    const [years, setYears] = useState(10);
    const [result, setResult] = useState(0);
    const [chartData, setChartData] = useState([]);

    useEffect(() => {
      let shares = inv / price;
      let total = 0;
      const data = [];
      for(let i = 1; i <= years; i++) {
        const annualDiv = shares * div;
        const newShares = annualDiv / price;
        shares += newShares;
        total = shares * price;
        data.push({ year: `Ano ${i}`, value: total });
      }
      setResult(total);
      setChartData(data);
    }, [inv, price, div, years]);

    return (
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 mt-20 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-6">
            <h2 className="text-lg font-bold mb-6 dark:text-white flex items-center gap-2">
              <DollarSign className="text-green-500" /> Simulador DRIP
            </h2>
            <div className="space-y-4">
              {[
                { l: 'Investimento ($)', v: inv, s: setInv },
                { l: 'Preço Ação ($)', v: price, s: setPrice },
                { l: 'Dividendo/Ação', v: div, s: setDiv },
                { l: 'Anos', v: years, s: setYears }
              ].map((f) => (
                <div key={f.l}>
                  <label className="block text-xs font-medium text-gray-500 mb-1">{f.l}</label>
                  <input 
                    type="number" 
                    value={f.v} 
                    onChange={e => f.s(parseFloat(e.target.value))}
                    className="w-full bg-gray-50 dark:bg-[#0d1117] border border-gray-300 dark:border-gray-700 rounded px-3 py-2 text-sm focus:border-blue-500 outline-none dark:text-white text-right font-mono"
                  />
                </div>
              ))}
            </div>
            <div className="mt-8 text-center pt-6 border-t border-gray-200 dark:border-gray-800">
              <div className="text-xs text-gray-500 uppercase tracking-wider">Patrimônio Projetado</div>
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">
                ${result.toLocaleString('en-US', {maximumFractionDigits: 0})}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 bg-white dark:bg-[#161b22] border border-gray-200 dark:border-gray-800 rounded-lg p-6 flex flex-col">
            <h3 className="text-sm font-bold uppercase text-gray-500 mb-4">Crescimento Patrimonial (Reinvestimento)</h3>
            <div className="flex-grow min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#e5e7eb'} vertical={false} />
                  <XAxis dataKey="year" tick={{fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontSize: 12}} />
                  <YAxis tick={{fill: theme === 'dark' ? '#9ca3af' : '#4b5563', fontSize: 12}} />
                  <Tooltip 
                    cursor={{fill: theme === 'dark' ? '#1f2937' : '#f3f4f6'}}
                    contentStyle={{ backgroundColor: theme === 'dark' ? '#1f2937' : '#fff', borderColor: '#374151', color: theme === 'dark' ? '#fff' : '#000' }}
                    formatter={(val) => [`$${val.toFixed(0)}`, 'Valor']}
                  />
                  <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </main>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-[#0b0e11] text-gray-900 dark:text-gray-200 font-sans transition-colors duration-300`}>
      <Navbar />
      <TickerTape />
      
      {view === 'home' && <HomeView />}
      {view === 'stock' && <StockView />}
      {view === 'dividendos' && <DividendView />}
      {(view === 'etfs' || view === 'reits') && (
        <div className="mt-32 text-center text-gray-500">
          <h2 className="text-2xl font-bold mb-2">Módulo {view.toUpperCase()}</h2>
          <p>Utilize a busca ou navegue pela Home para ver detalhes.</p>
        </div>
      )}

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#161b22] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-xl font-extrabold tracking-tight dark:text-white mb-2">
            INVEST<span className="text-blue-500">NYSE</span> PRO
          </div>
          <p className="text-sm text-gray-500">Terminal Financeiro Profissional - Dados Simulados</p>
          <div className="mt-4 text-xs text-gray-600 dark:text-gray-400">
            &copy; 2024 InvestNYSE Pro. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
