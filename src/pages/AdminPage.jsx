import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { getAdminStats } from '../services/database';
import { isSupabaseAvailable } from '../services/supabase';

const STORAGE_KEY = 'PathX_admin_auth';
const PIE_COLORS = ['#10b981', '#14b8a6', '#06b6d4', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
const GENDER_COLORS = { male: '#6366f1', female: '#ec4899', other: '#10b981' };

const GENDER_LABELS = { male: 'Nam', female: 'Nữ', other: 'Khác' };

function formatDate(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
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

function StatCard({ icon, label, value, color = 'emerald' }) {
  const gradients = {
    emerald: 'from-emerald-500 to-teal-500',
    cyan: 'from-cyan-500 to-blue-500',
    violet: 'from-violet-500 to-purple-500',
    amber: 'from-amber-500 to-orange-500',
    rose: 'from-rose-500 to-pink-500',
    indigo: 'from-indigo-500 to-blue-600',
  };
  return (
    <div className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100'>
      <div
        className={`inline-flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br ${gradients[color]} text-white text-xl mb-3`}
      >
        {icon}
      </div>
      <div className='text-2xl font-bold text-gray-900'>{value}</div>
      <div className='text-xs text-gray-500 mt-0.5'>{label}</div>
    </div>
  );
}

// ─── Passcode Form ──────────────────────────────────────────────────────────
function PasscodeForm({ onSuccess }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState('');
  const correctCode = import.meta.env.VITE_ADMIN_PASSCODE;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!correctCode) {
      setError('Chưa cấu hình VITE_ADMIN_PASSCODE trong .env');
      return;
    }
    if (passcode === correctCode) {
      localStorage.setItem(STORAGE_KEY, 'true');
      onSuccess();
    } else {
      setError('Mật khẩu không đúng! Thử lại nha 😅');
      setPasscode('');
    }
  };

  return (
    <div className='min-h-screen bg-gray-900 flex items-center justify-center p-6'>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className='bg-gray-800 rounded-3xl p-8 md:p-10 w-full max-w-md border border-gray-700 shadow-2xl'
      >
        <div className='text-center mb-8'>
          <div className='text-5xl mb-4'>🔐</div>
          <h1 className='text-2xl font-bold text-white mb-2'>Admin Panel</h1>
          <p className='text-gray-400 text-sm'>PathX Analytics Dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-2'>
              Mật khẩu admin
            </label>
            <input
              type='password'
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value);
                setError('');
              }}
              placeholder='Nhập mật khẩu...'
              autoFocus
              className='w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-emerald-500 focus:outline-none transition-colors'
            />
          </div>

          {error && (
            <p className='text-red-400 text-sm flex items-center gap-2'>
              <span>❌</span> {error}
            </p>
          )}

          <button
            type='submit'
            className='w-full py-3 bg-linear-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all'
          >
            Đăng nhập →
          </button>
        </form>

        <div className='mt-6 text-center'>
          <Link to='/' className='text-gray-500 hover:text-gray-300 text-sm transition-colors'>
            ← Về trang chủ
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

// ─── Admin Dashboard ─────────────────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 10;

  useEffect(() => {
    if (!isSupabaseAvailable()) {
      setError(true);
      setLoading(false);
      return;
    }
    getAdminStats()
      .then(({ data, error: e }) => {
        if (e || !data) setError(true);
        else setStats(data);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const recentRows = stats?.recent_completions ?? [];
  const pagedRows = recentRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const totalPages = Math.ceil(recentRows.length / PAGE_SIZE);

  const dailyData = stats?.daily_registrations ?? [];
  const topCareers = (stats?.top_careers ?? []).slice(0, 8);
  const iqDist = stats?.iq_distribution ?? [];

  const genderData = stats
    ? Object.entries(stats.gender_breakdown ?? {})
        .map(([k, v]) => ({ name: GENDER_LABELS[k] ?? k, value: Number(v) }))
        .filter((d) => d.value > 0)
    : [];

  const workStyleData = stats
    ? [
        { name: 'Remote', value: Number(stats.work_style_split?.remote ?? 0) },
        { name: 'Văn phòng', value: Number(stats.work_style_split?.office ?? 0) },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className='min-h-screen bg-gray-950 text-gray-100'>
      {/* Top bar */}
      <div className='bg-gray-900 border-b border-gray-800 px-4 py-4 sticky top-0 z-10'>
        <div className='max-w-7xl mx-auto flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-2xl'>📊</span>
            <div>
              <h1 className='font-bold text-white leading-tight'>PathX Admin</h1>
              <p className='text-xs text-gray-400'>Analytics Dashboard</p>
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <Link
              to='/stats'
              className='text-sm text-gray-400 hover:text-white transition-colors'
            >
              Public Stats
            </Link>
            <button
              onClick={onLogout}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-medium transition-colors'
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </div>

      <div className='max-w-7xl mx-auto px-4 py-8 space-y-8'>
        {error && (
          <div className='bg-red-900/30 border border-red-700 rounded-2xl p-6 text-center text-red-300'>
            <div className='text-4xl mb-2'>⚠️</div>
            <p className='font-semibold'>Không thể tải dữ liệu</p>
            <p className='text-sm mt-1'>Kiểm tra cấu hình Supabase và thử lại.</p>
          </div>
        )}

        {/* KPI Grid */}
        {!loading && !error && (
          <div>
            <h2 className='text-lg font-bold text-gray-200 mb-4'>Tổng quan</h2>
            <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
              <StatCard icon='🎯' label='Tổng bài test' value={Number(stats?.total_completions ?? 0).toLocaleString('vi-VN')} color='emerald' />
              <StatCard icon='📅' label='Hôm nay' value={Number(stats?.today_count ?? 0).toLocaleString('vi-VN')} color='cyan' />
              <StatCard icon='📆' label='Tuần này' value={Number(stats?.this_week_count ?? 0).toLocaleString('vi-VN')} color='violet' />
              <StatCard icon='🗓️' label='Tháng này' value={Number(stats?.this_month_count ?? 0).toLocaleString('vi-VN')} color='amber' />
              <StatCard icon='🧠' label='IQ TB' value={stats?.avg_iq_score ? `${stats.avg_iq_score}/5` : 'N/A'} color='rose' />
              <StatCard icon='💝' label='EQ TB' value={stats?.avg_eq ? `${stats.avg_eq}/5` : 'N/A'} color='indigo' />
            </div>
          </div>
        )}

        {loading && (
          <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='bg-gray-800 rounded-2xl p-5 animate-pulse h-24' />
            ))}
          </div>
        )}

        {/* Charts row 1 */}
        {!loading && !error && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            <div className='lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800'>
              <h3 className='font-bold text-gray-200 mb-1'>Bài test theo ngày</h3>
              <p className='text-xs text-gray-500 mb-4'>30 ngày gần nhất</p>
              {dailyData.length > 0 ? (
                <ResponsiveContainer width='100%' height={200}>
                  <BarChart data={dailyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                    <XAxis dataKey='date' tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} interval='preserveStartEnd' />
                    <YAxis tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey='count' name='Bài test' fill='#10b981' radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[200px] flex items-center justify-center text-gray-600 text-sm'>Chưa có dữ liệu</div>
              )}
            </div>

            <div className='bg-gray-900 rounded-2xl p-6 border border-gray-800'>
              <h3 className='font-bold text-gray-200 mb-1'>Giới tính</h3>
              <p className='text-xs text-gray-500 mb-2'>Phân bố người dùng</p>
              {genderData.length > 0 ? (
                <ResponsiveContainer width='100%' height={200}>
                  <PieChart>
                    <Pie data={genderData} dataKey='value' nameKey='name' cx='50%' cy='45%' outerRadius={65}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      labelLine={false}
                    >
                      {genderData.map((entry) => (
                        <Cell key={entry.name}
                          fill={GENDER_COLORS[entry.name === 'Nam' ? 'male' : entry.name === 'Nữ' ? 'female' : 'other']}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(v) => [`${v} bài`, '']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[200px] flex items-center justify-center text-gray-600 text-sm'>Chưa có dữ liệu</div>
              )}
            </div>
          </div>
        )}

        {/* Charts row 2 */}
        {!loading && !error && (
          <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
            {/* Top careers */}
            <div className='lg:col-span-2 bg-gray-900 rounded-2xl p-6 border border-gray-800'>
              <h3 className='font-bold text-gray-200 mb-1'>Top nghề hot</h3>
              <p className='text-xs text-gray-500 mb-4'>Nghề AI gợi ý nhiều nhất</p>
              {topCareers.length > 0 ? (
                <ResponsiveContainer width='100%' height={220}>
                  <BarChart layout='vertical' data={topCareers} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray='3 3' stroke='#374151' horizontal={false} />
                    <XAxis type='number' tick={{ fontSize: 10, fill: '#6b7280' }} tickLine={false} />
                    <YAxis dataKey='name' type='category' width={130} tick={{ fontSize: 10, fill: '#d1d5db' }} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey='value' name='Số lần' radius={[0, 3, 3, 0]}>
                      {topCareers.map((_, i) => (
                        <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className='h-[220px] flex items-center justify-center text-gray-600 text-sm'>Chưa có dữ liệu</div>
              )}
            </div>

            {/* IQ + WorkStyle */}
            <div className='space-y-4'>
              <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800'>
                <h3 className='font-bold text-gray-200 mb-1 text-sm'>Phân bố IQ</h3>
                {iqDist.length > 0 ? (
                  <ResponsiveContainer width='100%' height={130}>
                    <PieChart>
                      <Pie data={iqDist} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={50}>
                        {iqDist.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                      <Tooltip formatter={(v) => [`${v} người`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-[130px] flex items-center justify-center text-gray-600 text-xs'>Chưa có dữ liệu</div>
                )}
              </div>

              <div className='bg-gray-900 rounded-2xl p-5 border border-gray-800'>
                <h3 className='font-bold text-gray-200 mb-1 text-sm'>Remote vs Văn phòng</h3>
                {workStyleData.length > 0 ? (
                  <ResponsiveContainer width='100%' height={130}>
                    <PieChart>
                      <Pie data={workStyleData} dataKey='value' nameKey='name' cx='50%' cy='50%' outerRadius={50}
                        label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        <Cell fill='#10b981' />
                        <Cell fill='#6366f1' />
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: '10px', color: '#9ca3af' }} />
                      <Tooltip formatter={(v) => [`${v} người`, '']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className='h-[130px] flex items-center justify-center text-gray-600 text-xs'>Chưa có dữ liệu</div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Recent completions table */}
        {!loading && !error && recentRows.length > 0 && (
          <div>
            <h2 className='text-lg font-bold text-gray-200 mb-4'>
              Bài test gần đây{' '}
              <span className='text-sm font-normal text-gray-500'>({recentRows.length} kết quả mới nhất)</span>
            </h2>
            <div className='bg-gray-900 rounded-2xl border border-gray-800 overflow-hidden'>
              <div className='overflow-x-auto'>
                <table className='w-full text-sm'>
                  <thead>
                    <tr className='border-b border-gray-800 text-gray-400 text-xs'>
                      <th className='text-left px-4 py-3 font-medium'>Thời gian</th>
                      <th className='text-left px-4 py-3 font-medium'>Họ tên</th>
                      <th className='text-left px-4 py-3 font-medium'>GT</th>
                      <th className='text-left px-4 py-3 font-medium'>Tuổi</th>
                      <th className='text-left px-4 py-3 font-medium'>IQ</th>
                      <th className='text-left px-4 py-3 font-medium'>Nghề top 1</th>
                      <th className='text-left px-4 py-3 font-medium'>Tính cách</th>
                      <th className='px-4 py-3' />
                    </tr>
                  </thead>
                  <tbody>
                    {pagedRows.map((row, i) => (
                      <tr
                        key={row.session_id}
                        className={`border-b border-gray-800/60 hover:bg-gray-800/40 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-800/20'}`}
                      >
                        <td className='px-4 py-3 text-gray-400 text-xs whitespace-nowrap'>{formatDate(row.created_at)}</td>
                        <td className='px-4 py-3 text-gray-200 font-medium'>{row.full_name}</td>
                        <td className='px-4 py-3 text-gray-400 text-xs'>
                          {row.gender === 'male' ? '♂' : row.gender === 'female' ? '♀' : '–'}
                        </td>
                        <td className='px-4 py-3 text-gray-400 text-xs'>{row.age ?? '–'}</td>
                        <td className='px-4 py-3'>
                          <span className={`px-2 py-0.5 rounded-lg text-xs font-semibold ${
                            row.iq_score >= 4 ? 'bg-emerald-900/50 text-emerald-300' :
                            row.iq_score >= 3 ? 'bg-blue-900/50 text-blue-300' :
                            'bg-gray-700 text-gray-400'
                          }`}>
                            {row.iq_score ?? '–'}/5
                          </span>
                        </td>
                        <td className='px-4 py-3 text-gray-300 text-xs max-w-[140px] truncate'>{row.top_career ?? '–'}</td>
                        <td className='px-4 py-3 text-gray-300 text-xs'>
                          {row.personality_emoji} {row.personality_title ?? '–'}
                        </td>
                        <td className='px-4 py-3'>
                          <button
                            onClick={() => navigate(`/results/${row.session_id}`)}
                            className='text-emerald-400 hover:text-emerald-300 text-xs font-medium transition-colors'
                          >
                            Xem →
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className='px-4 py-3 flex items-center justify-between border-t border-gray-800'>
                  <span className='text-xs text-gray-500'>
                    Trang {page + 1}/{totalPages}
                  </span>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => setPage((p) => Math.max(0, p - 1))}
                      disabled={page === 0}
                      className='px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                    >
                      ← Trước
                    </button>
                    <button
                      onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                      disabled={page === totalPages - 1}
                      className='px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs disabled:opacity-40 disabled:cursor-not-allowed transition-colors'
                    >
                      Sau →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main AdminPage ──────────────────────────────────────────────────────────
export default function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'true' && import.meta.env.VITE_ADMIN_PASSCODE) {
      setAuthenticated(true);
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setAuthenticated(false);
  }, []);

  if (!authenticated) {
    return <PasscodeForm onSuccess={() => setAuthenticated(true)} />;
  }

  return <AdminDashboard onLogout={handleLogout} />;
}
