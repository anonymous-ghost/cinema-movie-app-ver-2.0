import React, { useState, useEffect } from "react";
import { FaTicketAlt, FaMoneyBillAlt, FaUsers, FaFilm } from "react-icons/fa";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { useTranslation } from "react-i18next";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define types for our statistics
interface SalesStatistics {
  dailyRevenue: number;
  weeklyRevenue: number;
  montlyRevenue: number;
  ticketsSold: number;
  occupancyRate: number;
  popularMovie: string;
  newUsers: number;
  salesByDay: number[];
}

const AdminStats: React.FC = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<SalesStatistics>({
    dailyRevenue: 0,
    weeklyRevenue: 0,
    montlyRevenue: 0,
    ticketsSold: 0,
    occupancyRate: 0,
    popularMovie: "",
    newUsers: 0,
    salesByDay: [0, 0, 0, 0, 0, 0, 0]
  });

  // Popular movie titles for random selection
  const popularMovieKeys = [
    "avatar",
    "batman",
    "dune",
    "oppenheimer",
    "spiderman",
    "interstellar"
  ];

  // Generate random statistics
  const generateRandomStats = () => {
    const dailyRevenue = Math.floor(Math.random() * 50000) + 10000;
    const weeklyRevenue = dailyRevenue * (Math.floor(Math.random() * 3) + 5);
    const montlyRevenue = weeklyRevenue * (Math.floor(Math.random() * 2) + 3);
    const ticketsSold = Math.floor(Math.random() * 500) + 100;
    const occupancyRate = Math.floor(Math.random() * 40) + 60; // Between 60-100%
    const movieKey = popularMovieKeys[Math.floor(Math.random() * popularMovieKeys.length)];
    const popularMovie = t(`movies.${movieKey}`);
    const newUsers = Math.floor(Math.random() * 50) + 10;
    const salesByDay = Array(7).fill(0).map(() => Math.floor(Math.random() * 40000) + 5000);

    return {
      dailyRevenue,
      weeklyRevenue,
      montlyRevenue,
      ticketsSold,
      occupancyRate,
      popularMovie,
      newUsers,
      salesByDay
    };
  };

  // Format currency function
  const formatCurrency = (amount: number): string => {
    const locale = t('language:locale') === 'uk' ? 'uk-UA' : 'en-US';
    const currencySymbol = t('admin.form.currency');
    return new Intl.NumberFormat(locale, { 
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount) + ' ' + currencySymbol;
  };

  // Update stats every 20 seconds
  useEffect(() => {
    // Generate initial stats
    setStats(generateRandomStats());

    // Set interval to update stats every 20 seconds
    const intervalId = setInterval(() => {
      setStats(generateRandomStats());
    }, 20000);

    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Day names for chart labels
  const dayNames = [
    t('admin.stats.monday'),
    t('admin.stats.tuesday'),
    t('admin.stats.wednesday'),
    t('admin.stats.thursday'),
    t('admin.stats.friday'),
    t('admin.stats.saturday'),
    t('admin.stats.sunday')
  ];

  // Chart data
  const chartData = {
    labels: dayNames,
    datasets: [
      {
        label: t('admin.stats.dailyRevenue'),
        data: stats.salesByDay,
        fill: false,
        backgroundColor: 'rgba(229, 9, 20, 0.8)',
        borderColor: 'rgba(229, 9, 20, 0.8)',
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)',
          callback: function(value: any) {
            return formatCurrency(value);
          }
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'rgba(255, 255, 255, 0.7)'
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: 'rgba(255, 255, 255, 0.7)'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            return formatCurrency(context.parsed.y);
          }
        }
      }
    }
  };

  return (
    <div className="bg-[#1A1A1A] rounded-lg p-6">
      <h2 className="text-2xl font-semibold mb-6">{t('admin.stats.title')}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {/* Daily Revenue */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg flex items-center">
          <div className="bg-red-600 p-3 rounded-full mr-4">
            <FaMoneyBillAlt className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('admin.stats.dailyRevenue')}</p>
            <p className="text-xl font-semibold">{formatCurrency(stats.dailyRevenue)}</p>
          </div>
        </div>
        
        {/* Tickets Sold */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg flex items-center">
          <div className="bg-blue-600 p-3 rounded-full mr-4">
            <FaTicketAlt className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('admin.stats.ticketsSold')}</p>
            <p className="text-xl font-semibold">{stats.ticketsSold}</p>
          </div>
        </div>
        
        {/* Occupancy Rate */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg flex items-center">
          <div className="bg-green-600 p-3 rounded-full mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('admin.stats.occupancyRate')}</p>
            <p className="text-xl font-semibold">{stats.occupancyRate}%</p>
          </div>
        </div>
        
        {/* New Users */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg flex items-center">
          <div className="bg-purple-600 p-3 rounded-full mr-4">
            <FaUsers className="text-white text-xl" />
          </div>
          <div>
            <p className="text-sm text-gray-400">{t('admin.stats.newUsers')}</p>
            <p className="text-xl font-semibold">{stats.newUsers}</p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Weekly Revenue */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.stats.weeklyRevenue')}</h3>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.weeklyRevenue)}</p>
        </div>
        
        {/* Monthly Revenue */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.stats.monthlyRevenue')}</h3>
          <p className="text-2xl font-bold text-green-400">{formatCurrency(stats.montlyRevenue)}</p>
        </div>
        
        {/* Most Popular Movie */}
        <div className="bg-[#2D2D2D] p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-2">{t('admin.stats.popularMovie')}</h3>
          <div className="flex items-center">
            <FaFilm className="text-red-600 text-xl mr-2" />
            <p className="text-xl font-bold">{stats.popularMovie}</p>
          </div>
        </div>
      </div>
      
      {/* Chart */}
      <div className="bg-[#2D2D2D] p-4 rounded-lg">
        <h3 className="text-lg font-medium mb-4">{t('admin.stats.weeklyTrend')}</h3>
        <div className="h-80">
          <Line data={chartData} options={chartOptions as any} />
        </div>
      </div>
      
      <div className="text-right mt-4 text-sm text-gray-400">
        <p>{t('admin.stats.autoUpdate')}</p>
      </div>
    </div>
  );
};

export default AdminStats; 