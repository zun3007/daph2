import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { getPublicStats } from '../services/database';
import { isSupabaseAvailable } from '../services/supabase';

const PIE_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444'];
const GENDER_COLORS = { male: '#6366f1', female: '#ec4899', other: '#10b981' };

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

function SkeletonCard() {
  return (
    <div className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100 animate-pulse'>
      <div className='h-4 bg-gray-200 rounded w-1/2 mb-4' />
      <div className='h-10 bg-gray-200 rounded w-1/3 mb-2' />
      <div className='h-3 bg-gray-100 rounded w-2/3' />
    </div>
  );
}

function KPICard({ icon, label, value, sub, color = 'emerald', delay = 0 }) {
  const colors = {
    emerald: 'from-emerald-500 to-teal-500',
    cyan: 'from-cyan-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
    amber: 'from-amber-500 to-orange-500',
  };
  return (
    <motion.div
      variants={fadeUp}
      transition={{ delay }}
      className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
    >
      <div
        className={`inline-flex items-center justify-center w-12 h-12 rounded-xl bg-linear-to-br ${colors[color]} text-white text-2xl mb-4`}
      >
        {icon}
      </div>
      <div className='text-3xl font-bold text-gray-900 mb-1'>{value}</div>
      <div className='text-sm font-semibold text-gray-700'>{label}</div>
      {sub && <div className='text-xs text-gray-400 mt-0.5'>{sub}</div>}
    </motion.div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className='bg-white rounded-xl shadow-lg border border-gray-100 px-4 py-3 text-sm'>
      <p className='font-semibold text-gray-700 mb-1'>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
        </p>
      ))}
    </div>
  );
}

export default function StatsPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      setError(true);
      setLoading(false);
      return;
    }
    getPublicStats()
      .then(({ data, error: e }) => {
        if (e || !data) setError(true);
        else setStats(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  // Prepare chart data
  const dailyData = stats?.daily_registrations ?? [];
  const topCareers = stats?.top_careers ?? [];
  const iqDist = stats?.iq_distribution ?? [];

  const genderData = stats
    ? [
        { name: 'Nam', value: Number(stats.gender_breakdown?.male ?? 0) },
        { name: 'Nữ', value: Number(stats.gender_breakdown?.female ?? 0) },
        { name: 'Khác', value: Number(stats.gender_breakdown?.other ?? 0) },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-linear-to-br from-emerald-600 via-teal-600 to-cyan-600 text-white'>
        <div className='max-w-6xl mx-auto px-4 py-10 md:py-16'>
          <div className='flex items-center justify-between mb-6'>
            <Link
              to='/'
              className='text-white/70 hover:text-white text-sm font-medium transition-colors'
            >
              ← Trang chủ
            </Link>
            <Link
              to='/test'
              className='px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl text-sm font-semibold transition-colors'
            >
              Bắt đầu test ✨
            </Link>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-center'
          >
            <div className='text-5xl mb-4'>📊</div>
            <h1 className='text-3xl md:text-4xl font-bold mb-3'>Thống Kê PathX</h1>
            <p className='text-white/80 text-lg'>
              Dữ liệu thực từ cộng đồng học sinh sử dụng PathX
            </p>
          </motion.div>
        </div>
      </div>

      <div className='max-w-6xl mx-auto px-4 py-8 md:py-12 space-y-10'>
        {/* Error state */}
        {error && !loading && (
          <div className='bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center text-amber-800'>
            <div className='text-4xl mb-3'>⚠️</div>
            <p className='font-semibold mb-1'>Không thể tải dữ liệu thống kê</p>
            <p className='text-sm'>Vui lòng thử lại sau hoặc kiểm tra kết nối.</p>
          </div>
        )}

        {/* KPI Cards */}
        <motion.section
          variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
          initial='hidden'
          animate='visible'
        >
          <h2 className='text-xl font-bold text-gray-900 mb-4'>Tổng quan</h2>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
            ) : (
              <>
                <KPICard
                  icon='🎯'
                  label='Tổng bài test'
                  value={Number(stats?.total_completions ?? 0).toLocaleString('vi-VN')}
                  sub='đã hoàn thành'
                  color='emerald'
                  delay={0}
                />
                <KPICard
                  icon='📅'
                  label='Hôm nay'
                  value={Number(stats?.today_count ?? 0).toLocaleString('vi-VN')}
                  sub='bài test mới'
                  color='cyan'
                  delay={0.08}
                />
                <KPICard
                  icon='📆'
                  label='Tuần này'
                  value={Number(stats?.this_week_count ?? 0).toLocaleString('vi-VN')}
                  sub='bài test'
                  color='violet'
                  delay={0.16}
                />
                <KPICard
                  icon='🧠'
                  label='IQ trung bình'
                  value={stats?.avg_iq_score ? `${stats.avg_iq_score}/5` : 'N/A'}
                  sub='điểm logic'
                  color='amber'
                  delay={0.24}
                />
              </>
            )}
          </div>
        </motion.section>

        {/* Charts Row 1: Daily registrations + Gender */}
        {!loading && !error && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Daily bar chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='font-bold text-gray-900 mb-1'>Bài test theo ngày</h3>
              <p className='text-sm text-gray-400 mb-5'>30 ngày gần nhất</p>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' />
                    <XAxis
                      dataKey='date'
                      tick={{ fontSize: 11, fill: '#9ca3af' }}
                      tickLine={false}
                      interval='preserveStartEnd'
                    />
                    <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey='count' name='Bài test' fill='#10b981' radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[220px] flex items-center justify-center text-gray-400 text-sm'>
                  Chưa có dữ liệu
                </div>
              )}
            </motion.div>

            {/* Gender pie */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='font-bold text-gray-900 mb-1'>Giới tính</h3>
              <p className='text-sm text-gray-400 mb-4'>Phân bố người dùng</p>
              {genderData.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <PieChart>
                    <Pie
                      data={genderData}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='45%'
                      outerRadius={75}
                      label={({ name, percent }) =>
                        `${name} ${(percent * 100).toFixed(0)}%`
                      }
                      labelLine={false}
                    >
                      {genderData.map((entry) => (
                        <Cell
                          key={entry.name}
                          fill={
                            GENDER_COLORS[
                              entry.name === 'Nam'
                                ? 'male'
                                : entry.name === 'Nữ'
                                  ? 'female'
                                  : 'other'
                            ]
                          }
                        />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v) => [`${v} bài`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[220px] flex items-center justify-center text-gray-400 text-sm'>
                  Chưa có dữ liệu
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* Charts Row 2: Top careers + IQ distribution */}
        {!loading && !error && (
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
            {/* Top careers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='font-bold text-gray-900 mb-1'>Top 5 nghề hot nhất</h3>
              <p className='text-sm text-gray-400 mb-5'>Nghề được AI gợi ý nhiều nhất</p>
              {topCareers.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart
                    layout='vertical'
                    data={topCareers}
                    margin={{ top: 0, right: 10, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray='3 3' stroke='#f3f4f6' horizontal={false} />
                    <XAxis type='number' tick={{ fontSize: 11, fill: '#9ca3af' }} tickLine={false} />
                    <YAxis
                      dataKey='name'
                      type='category'
                      width={120}
                      tick={{ fontSize: 11, fill: '#374151' }}
                      tickLine={false}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey='value' name='Số lần' radius={[0, 4, 4, 0]}>
                      {topCareers.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[220px] flex items-center justify-center text-gray-400 text-sm'>
                  Chưa có dữ liệu
                </div>
              )}
            </motion.div>

            {/* IQ distribution */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className='bg-white rounded-2xl p-6 shadow-sm border border-gray-100'
            >
              <h3 className='font-bold text-gray-900 mb-1'>Phân bố cấp độ IQ</h3>
              <p className='text-sm text-gray-400 mb-5'>Kết quả tư duy logic</p>
              {iqDist.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <PieChart>
                    <Pie
                      data={iqDist}
                      dataKey='value'
                      nameKey='name'
                      cx='50%'
                      cy='45%'
                      outerRadius={75}
                      label={({ name, percent }) =>
                        percent > 0.05 ? `${(percent * 100).toFixed(0)}%` : ''
                      }
                    >
                      {iqDist.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip formatter={(v) => [`${v} người`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[220px] flex items-center justify-center text-gray-400 text-sm'>
                  Chưa có dữ liệu
                </div>
              )}
            </motion.div>
          </div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className='bg-linear-to-br from-emerald-600 to-teal-600 rounded-3xl p-8 text-white text-center'
        >
          <div className='text-4xl mb-3'>🚀</div>
          <h2 className='text-2xl font-bold mb-2'>Tham gia cùng cộng đồng!</h2>
          <p className='text-white/80 mb-6'>
            Khám phá nghề nghiệp phù hợp với bạn chỉ trong 15-20 phút
          </p>
          <Link
            to='/test'
            className='inline-block px-8 py-3 bg-white text-emerald-700 rounded-xl font-bold hover:shadow-xl transition-all'
          >
            Bắt đầu test miễn phí ✨
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
