import { supabase, isSupabaseAvailable } from './supabase';

// ─────────────────────────────────────────────
// saveResult
// Lưu kết quả AI vào Supabase sau khi test hoàn thành
// ─────────────────────────────────────────────
export async function saveResult(sessionId, resultJson, personalInfo, scores) {
  if (!isSupabaseAvailable()) return { data: null, error: 'SUPABASE_UNAVAILABLE' };

  const topCareer = resultJson?.careerRecommendations?.[0]?.title ?? null;

  const row = {
    session_id: sessionId,
    // Personal info
    full_name: personalInfo?.full_name ?? '',
    birth_date: personalInfo?.birth_date ?? null,
    birth_day: personalInfo?.birth_day ? parseInt(personalInfo.birth_day) : null,
    birth_month: personalInfo?.birth_month ? parseInt(personalInfo.birth_month) : null,
    birth_year: personalInfo?.birth_year ? parseInt(personalInfo.birth_year) : null,
    gender: personalInfo?.gender ?? null,
    age: personalInfo?.age ? parseInt(personalInfo.age) : null,
    // Scores
    iq_score: resultJson?.userResults?.iqScore ?? null,
    iq_level: resultJson?.userResults?.iqLevel ?? null,
    eq_level: resultJson?.userResults?.eqLevel ?? null,
    eq_self_awareness: resultJson?.userResults?.eqScores?.selfAwareness ?? null,
    eq_emotional_control: resultJson?.userResults?.eqScores?.emotionalControl ?? null,
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
  if (!isSupabaseAvailable()) return { data: null, error: 'SUPABASE_UNAVAILABLE' };

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
export async function searchByPersonalInfo(fullName, birthDay, birthMonth, birthYear) {
  if (!isSupabaseAvailable()) return { data: [], error: 'SUPABASE_UNAVAILABLE' };
  if (!fullName || fullName.trim().length < 2) return { data: [], error: 'NAME_TOO_SHORT' };

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
  if (!isSupabaseAvailable()) return { data: null, error: 'SUPABASE_UNAVAILABLE' };

  const { data, error } = await supabase.rpc('get_public_stats');
  return { data, error };
}

// ─────────────────────────────────────────────
// getAdminStats
// Lấy thống kê chi tiết cho trang /admin
// ─────────────────────────────────────────────
export async function getAdminStats() {
  if (!isSupabaseAvailable()) return { data: null, error: 'SUPABASE_UNAVAILABLE' };

  const { data, error } = await supabase.rpc('get_admin_stats');
  return { data, error };
}
