import { supabase, isSupabaseAvailable } from './supabase';

const STATS_ROW_LIMIT = 5000;

function getUTCDateKey(dateString) {
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return null;
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
    d.getUTCDate(),
  ).padStart(2, '0')}`;
}

function getDateRangeKeys(days) {
  const out = [];
  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - i));
    out.push(`${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(
      d.getUTCDate(),
    ).padStart(2, '0')}`);
  }
  return out;
}

function formatDateLabel(dateKey) {
  const [, month, day] = dateKey.split('-').map(Number);
  return `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}`;
}

function normalizeWorkStyle(workStyle) {
  const value = String(workStyle || '').toLowerCase();
  if (!value) return null;
  if (value.includes('remote') || value.includes('từ xa') || value.includes('hybrid')) {
    return 'remote';
  }
  if (value.includes('office') || value.includes('văn phòng') || value.includes('on-site')) {
    return 'office';
  }
  return null;
}

function getIqBucket(row) {
  if (row?.iq_level) return String(row.iq_level);

  const score = Number(row?.iq_score);
  if (Number.isNaN(score)) return 'N/A';
  if (score <= 1) return 'Thấp';
  if (score === 2) return 'Trung bình';
  if (score === 3) return 'Khá';
  if (score === 4) return 'Cao';
  return 'Xuất sắc';
}

function toTopList(counterObj, max = 10) {
  return Object.entries(counterObj)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, max);
}

function buildStatsFromRows(rows) {
  const now = new Date();
  const nowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const dayMs = 24 * 60 * 60 * 1000;

  let iqScoreSum = 0;
  let iqScoreCount = 0;
  let eqAvgSum = 0;
  let eqAvgCount = 0;

  const genderBreakdown = { male: 0, female: 0, other: 0 };
  const workStyleSplit = { remote: 0, office: 0 };
  const careerCounter = {};
  const iqCounter = {};
  const dailyCounter = {};

  let todayCount = 0;
  let thisWeekCount = 0;
  let thisMonthCount = 0;

  for (const row of rows) {
    const createdAt = new Date(row.created_at);
    if (Number.isNaN(createdAt.getTime())) continue;

    const createdUTC = Date.UTC(
      createdAt.getUTCFullYear(),
      createdAt.getUTCMonth(),
      createdAt.getUTCDate(),
    );
    const diffDays = Math.floor((nowUTC - createdUTC) / dayMs);

    if (diffDays === 0) todayCount += 1;
    if (diffDays >= 0 && diffDays < 7) thisWeekCount += 1;
    if (
      createdAt.getUTCFullYear() === now.getUTCFullYear() &&
      createdAt.getUTCMonth() === now.getUTCMonth()
    ) {
      thisMonthCount += 1;
    }

    const dateKey = getUTCDateKey(row.created_at);
    if (dateKey) {
      dailyCounter[dateKey] = (dailyCounter[dateKey] || 0) + 1;
    }

    const gender = String(row.gender || '').toLowerCase();
    if (gender === 'male' || gender === 'female' || gender === 'other') {
      genderBreakdown[gender] += 1;
    }

    const normalizedWorkStyle = normalizeWorkStyle(row.work_style);
    if (normalizedWorkStyle) {
      workStyleSplit[normalizedWorkStyle] += 1;
    }

    if (row.top_career) {
      careerCounter[row.top_career] = (careerCounter[row.top_career] || 0) + 1;
    }

    const iqBucket = getIqBucket(row);
    iqCounter[iqBucket] = (iqCounter[iqBucket] || 0) + 1;

    const iqScore = Number(row.iq_score);
    if (!Number.isNaN(iqScore)) {
      iqScoreSum += iqScore;
      iqScoreCount += 1;
    }

    const eqParts = [row.eq_self_awareness, row.eq_emotional_control, row.eq_empathy]
      .map((v) => Number(v))
      .filter((v) => !Number.isNaN(v));

    if (eqParts.length > 0) {
      eqAvgSum += eqParts.reduce((a, b) => a + b, 0) / eqParts.length;
      eqAvgCount += 1;
    }
  }

  const dailyKeys = getDateRangeKeys(30);
  const dailyRegistrations = dailyKeys.map((key) => ({
    date: formatDateLabel(key),
    count: dailyCounter[key] || 0,
  }));

  return {
    total_completions: rows.length,
    today_count: todayCount,
    this_week_count: thisWeekCount,
    this_month_count: thisMonthCount,
    avg_iq_score: iqScoreCount > 0 ? Number((iqScoreSum / iqScoreCount).toFixed(1)) : null,
    avg_eq: eqAvgCount > 0 ? Number((eqAvgSum / eqAvgCount).toFixed(1)) : null,
    gender_breakdown: genderBreakdown,
    work_style_split: workStyleSplit,
    daily_registrations: dailyRegistrations,
    top_careers: toTopList(careerCounter, 10),
    iq_distribution: toTopList(iqCounter, 6),
    recent_completions: rows
      .slice()
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, 100),
  };
}

async function fetchStatsRows() {
  const { data, error } = await supabase
    .from('test_results')
    .select(
      'session_id, full_name, gender, age, iq_score, iq_level, eq_self_awareness, eq_emotional_control, eq_empathy, work_style, top_career, personality_title, personality_emoji, created_at',
    )
    .order('created_at', { ascending: false })
    .limit(STATS_ROW_LIMIT);

  return { data: data ?? [], error };
}

// ─────────────────────────────────────────────
// saveResult
// Lưu kết quả AI vào Supabase sau khi test hoàn thành
// ─────────────────────────────────────────────
export async function saveResult(sessionId, resultJson, personalInfo) {
  if (!isSupabaseAvailable())
    return { data: null, error: 'SUPABASE_UNAVAILABLE' };

  const topCareer = resultJson?.careerRecommendations?.[0]?.title ?? null;

  const row = {
    session_id: sessionId,
    // Personal info
    full_name: personalInfo?.full_name ?? '',
    birth_date: personalInfo?.birth_date ?? null,
    birth_day: personalInfo?.birth_day
      ? parseInt(personalInfo.birth_day)
      : null,
    birth_month: personalInfo?.birth_month
      ? parseInt(personalInfo.birth_month)
      : null,
    birth_year: personalInfo?.birth_year
      ? parseInt(personalInfo.birth_year)
      : null,
    gender: personalInfo?.gender ?? null,
    age: personalInfo?.age ? parseInt(personalInfo.age) : null,
    // Scores
    iq_score: resultJson?.userResults?.iqScore ?? null,
    iq_level: resultJson?.userResults?.iqLevel ?? null,
    eq_level: resultJson?.userResults?.eqLevel ?? null,
    eq_self_awareness: resultJson?.userResults?.eqScores?.selfAwareness ?? null,
    eq_emotional_control:
      resultJson?.userResults?.eqScores?.emotionalControl ?? null,
    eq_empathy: resultJson?.userResults?.eqScores?.empathy ?? null,
    work_style: resultJson?.userResults?.workStyle ?? null,
    passion_vs_money: resultJson?.userResults?.passionVsMoney ?? null,
    // Summary
    top_career: topCareer,
    personality_title: resultJson?.personality?.title ?? null,
    personality_emoji: resultJson?.personality?.emoji ?? null,
    // Full result blob
    result_json: resultJson,
  };

  const { data, error } = await supabase
    .from('test_results')
    .insert(row)
    .select('id')
    .single();

  if (error) {
    console.warn('[PathX] Supabase save failed:', error.message);
  }

  return { data, error };
}

// ─────────────────────────────────────────────
// getResultBySessionId
// Lấy kết quả theo sessionId (dùng cho cross-device fallback)
// ─────────────────────────────────────────────
export async function getResultBySessionId(sessionId) {
  if (!isSupabaseAvailable())
    return { data: null, error: 'SUPABASE_UNAVAILABLE' };

  const { data, error } = await supabase
    .from('test_results')
    .select('result_json, full_name, created_at')
    .eq('session_id', sessionId)
    .single();

  return { data, error };
}

// ─────────────────────────────────────────────
// searchByPersonalInfo
// Tìm kết quả theo tên + ngày sinh (trang /lookup)
// ─────────────────────────────────────────────
export async function searchByPersonalInfo(
  fullName,
  birthDay,
  birthMonth,
  birthYear,
) {
  if (!isSupabaseAvailable())
    return { data: [], error: 'SUPABASE_UNAVAILABLE' };
  if (!fullName || fullName.trim().length < 2)
    return { data: [], error: 'NAME_TOO_SHORT' };

  let query = supabase
    .from('test_results')
    .select(
      'session_id, full_name, personality_title, personality_emoji, top_career, created_at',
    )
    .ilike('full_name', `%${fullName.trim()}%`)
    .order('created_at', { ascending: false })
    .limit(10);

  if (birthDay) query = query.eq('birth_day', parseInt(birthDay));
  if (birthMonth) query = query.eq('birth_month', parseInt(birthMonth));
  if (birthYear) query = query.eq('birth_year', parseInt(birthYear));

  const { data, error } = await query;
  return { data: data ?? [], error };
}

// ─────────────────────────────────────────────
// getPublicStats
// Lấy thống kê tổng hợp cho trang /stats
// ─────────────────────────────────────────────
export async function getPublicStats() {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'SUPABASE_UNAVAILABLE' };
  }

  const rpcRes = await supabase.rpc('get_public_stats');
  if (!rpcRes.error && rpcRes.data) {
    return rpcRes;
  }

  const { data: rows, error } = await fetchStatsRows();
  if (error) return { data: null, error };

  const stats = buildStatsFromRows(rows);
  return { data: { ...stats, recent_completions: undefined }, error: null };
}

// ─────────────────────────────────────────────
// getAdminStats
// Lấy thống kê chi tiết cho trang /admin
// ─────────────────────────────────────────────
export async function getAdminStats() {
  if (!isSupabaseAvailable()) {
    return { data: null, error: 'SUPABASE_UNAVAILABLE' };
  }

  const rpcRes = await supabase.rpc('get_admin_stats');
  if (!rpcRes.error && rpcRes.data) {
    return rpcRes;
  }

  const { data: rows, error } = await fetchStatsRows();
  if (error) return { data: null, error };

  const stats = buildStatsFromRows(rows);
  return { data: stats, error: null };
}
