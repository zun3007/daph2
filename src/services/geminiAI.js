import { GoogleGenerativeAI } from '@google/generative-ai';

/* =======================
   CONFIG
======================= */

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Cost-efficient nhất hiện tại
 * - flash-lite: rẻ nhất
 * - flash: fallback nếu lite unavailable
 */
const MODEL_NAME = 'gemini-2.5-flash-lite';

const TIMEOUT_MS = 45_000;
const MAX_RETRIES = 2;

/* =======================
   INTERNAL UTILS
======================= */

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('TIMEOUT')), ms),
    ),
  ]);
}

/* =======================
   MAIN API
======================= */

export async function callGeminiAPI(prompt) {
  if (!API_KEY || API_KEY === 'your_gemini_api_key_here') {
    throw new Error('API_KEY_MISSING');
  }

  const genAI = new GoogleGenerativeAI(API_KEY);

  const model = genAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
      responseMimeType: 'application/json', // giữ nguyên
      temperature: 0.8,
      maxOutputTokens: 8192,
    },
  });

  let lastError;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    if (attempt > 0) {
      await sleep(attempt === 1 ? 2000 : 5000);
    }

    try {
      const result = await withTimeout(
        model.generateContent({
          contents: [
            {
              role: 'user',
              parts: [{ text: prompt }],
            },
          ],
        }),
        TIMEOUT_MS,
      );

      const text = result.response.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('INVALID_JSON');
        }
        data = JSON.parse(jsonMatch[0]);
      }

      validateAIResponse(data);
      return data;
    } catch (error) {
      lastError = error;

      if (
        error.message === 'API_KEY_MISSING' ||
        error.message === 'INVALID_JSON'
      ) {
        throw error;
      }

      if (attempt === MAX_RETRIES) break;
    }
  }

  throw lastError;
}

/* =======================
   RESPONSE VALIDATION
======================= */

export function validateAIResponse(data) {
  const requiredKeys = [
    'userResults',
    'personality',
    'objectiveAssessment',
    'careerRecommendations',
    'numerology',
    'learningRoadmap',
    'funFacts',
  ];

  for (const key of requiredKeys) {
    if (!data?.[key]) {
      throw new Error(`MISSING_FIELD:${key}`);
    }
  }

  if (
    !Array.isArray(data.careerRecommendations) ||
    data.careerRecommendations.length === 0
  ) {
    throw new Error('INVALID_CAREERS');
  }

  if (
    !Array.isArray(data.learningRoadmap) ||
    data.learningRoadmap.length === 0
  ) {
    throw new Error('INVALID_ROADMAP');
  }

  if (!Array.isArray(data.funFacts) || data.funFacts.length === 0) {
    throw new Error('INVALID_FUNFACTS');
  }

  return true;
}

/* =======================
   ERROR MAPPING (UI SAFE)
======================= */

export function getErrorMessage(error) {
  const msg = error?.message || '';

  if (msg === 'API_KEY_MISSING') {
    return 'Chưa cấu hình API key. Vui lòng thêm VITE_GEMINI_API_KEY vào file .env';
  }

  if (msg === 'TIMEOUT') {
    return 'Mất nhiều thời gian hơn dự kiến. Thử lại nhé!';
  }

  if (msg.includes('429') || msg.includes('quota')) {
    return 'Hệ thống đang bận. Chờ 1 phút rồi thử lại nhé!';
  }

  if (msg.includes('INVALID_JSON') || msg.includes('MISSING_FIELD')) {
    return 'AI trả kết quả không đúng format. Thử lại nhé!';
  }

  if (
    msg.includes('Failed to fetch') ||
    msg.includes('NetworkError') ||
    msg.includes('network')
  ) {
    return 'Không có kết nối mạng. Kiểm tra WiFi và thử lại!';
  }

  if (msg.includes('403') || msg.includes('401')) {
    return 'API key không hợp lệ. Vui lòng kiểm tra lại!';
  }

  return 'Có lỗi xảy ra. Thử lại nhé!';
}

export function getFallbackResponse() {
  return {
    userResults: {
      iqScore: 3,
      iqOutOf: 5,
      iqLevel: 'Khá',
      eqScores: {
        selfAwareness: 4,
        emotionalControl: 3,
        empathy: 4,
        conflictStyle: 'process',
      },
      eqLevel: 'Khá',
      careerInterests: ['tech', 'creative', 'media'],
      workStyle: 'remote',
      passionVsMoney: 4,
      workEnvironment: 'startup',
      coreValues: ['growth', 'innovation', 'autonomy'],
    },
    personality: {
      title: 'Nhà Sáng Tạo Số',
      emoji: '🎨',
      summary:
        'Bạn là người kết hợp tuyệt vời giữa tư duy logic và sáng tạo. Bạn thích khám phá những điều mới, không ngại thử thách, và luôn có ý tưởng độc đáo.',
      strengths: [
        'Tư duy sáng tạo, luôn có ý tưởng mới',
        'Khả năng thích nghi tốt với thay đổi',
        'Đồng cảm và thấu hiểu người khác',
      ],
      growthAreas: [
        'Cần kiên nhẫn hơn khi gặp khó khăn',
        'Học cách quản lý thời gian tốt hơn',
        'Tập trung hoàn thành việc trước khi bắt đầu việc mới',
      ],
      funDescription:
        'Nếu là nhân vật anime, bạn sẽ là kiểu protagonist sáng tạo, luôn tìm ra cách giải quyết bất ngờ mà không ai nghĩ tới! 🌟',
    },
    objectiveAssessment: {
      iqAnalysis:
        'Bạn có khả năng tư duy logic ở mức khá. Bạn xử lý các bài toán pattern và logic nhanh, nhưng đôi khi cần thêm thời gian cho những câu phức tạp. Điểm mạnh của bạn là nhận diện quy luật.',
      eqAnalysis:
        'EQ của bạn ở mức tốt! Bạn có khả năng đồng cảm cao, dễ nhận ra cảm xúc người khác. Bạn thích suy nghĩ kỹ trước khi phản ứng - đây là dấu hiệu của sự trưởng thành cảm xúc.',
      careerFit:
        'Với sự kết hợp giữa công nghệ, sáng tạo và media, bạn phù hợp với các ngành ở giao điểm giữa tech và nghệ thuật. Bạn thích tự do, năng động và tạo ra giá trị.',
      overallProfile:
        'Bạn là Gen Z điển hình: đa tài, yêu tự do, có ý thức xã hội. Bạn không chỉ muốn kiếm tiền mà còn muốn làm điều có ý nghĩa. Đây là mindset tuyệt vời cho thời đại AI!',
    },
    careerRecommendations: [
      {
        title: 'UX/UI Designer',
        emoji: '🎨',
        matchPercent: 92,
        reason:
          'Kết hợp hoàn hảo giữa sáng tạo và tech. Bạn được thiết kế trải nghiệm cho hàng triệu người dùng!',
        salaryRange: '15-40 triệu/tháng',
        demandLevel: 'Rất cao',
        skills: ['Figma', 'Design Thinking', 'User Research', 'Prototyping'],
      },
      {
        title: 'Content Creator / YouTuber',
        emoji: '🎬',
        matchPercent: 88,
        reason:
          'Bạn sáng tạo + thích media = combo hoàn hảo! Tự do sáng tạo nội dung theo cách của mình.',
        salaryRange: '10-100+ triệu/tháng',
        demandLevel: 'Cao',
        skills: ['Video Editing', 'Storytelling', 'Social Media', 'Branding'],
      },
      {
        title: 'Frontend Developer',
        emoji: '💻',
        matchPercent: 85,
        reason:
          'Logic + sáng tạo = code giao diện web đẹp. Lương cao, remote được, cầu lớn!',
        salaryRange: '15-50 triệu/tháng',
        demandLevel: 'Rất cao',
        skills: ['React', 'JavaScript', 'CSS', 'TypeScript'],
      },
      {
        title: 'Game Designer',
        emoji: '🎮',
        matchPercent: 82,
        reason:
          'Biến ý tưởng thành game thật! Kết hợp logic, sáng tạo và công nghệ.',
        salaryRange: '12-35 triệu/tháng',
        demandLevel: 'Cao',
        skills: ['Unity/Unreal', 'Game Logic', 'Level Design', 'Storytelling'],
      },
      {
        title: 'Digital Marketing Specialist',
        emoji: '📱',
        matchPercent: 78,
        reason:
          'Sáng tạo chiến lược marketing online, chạy ads, phân tích data. Ngành hot, lương ok!',
        salaryRange: '10-30 triệu/tháng',
        demandLevel: 'Cao',
        skills: ['Google Ads', 'Facebook Ads', 'Analytics', 'Content Strategy'],
      },
    ],
    numerology: {
      lifePathNumber: 7,
      lifePathMeaning:
        'Số 7 là con số của người tìm kiếm chân lý! Bạn có trí tuệ sâu sắc, thích phân tích và khám phá. Bạn cần thời gian riêng để suy nghĩ và sáng tạo.',
      personalityNumber: 3,
      personalityMeaning:
        'Số 3 đại diện cho sự sáng tạo và giao tiếp! Bạn tỏa ra năng lượng tích cực, biết cách truyền cảm hứng cho người khác.',
      careerAlignment:
        'Với số chủ đạo 7 kết hợp số tính cách 3, bạn phù hợp nhất với các nghề đòi hỏi cả tư duy sâu VÀ sáng tạo: Designer, Developer, Researcher, Content Creator.',
    },
    learningRoadmap: [
      {
        career: 'UX/UI Designer',
        phases: [
          {
            phase: 'Nền tảng (0-6 tháng)',
            tasks: [
              'Học Figma cơ bản qua YouTube/Coursera',
              'Tìm hiểu Design Thinking',
              'Redesign 3 app yêu thích',
              'Đọc sách "Dont Make Me Think"',
            ],
            resources: [
              'Figma Official Tutorial',
              'Google UX Design Certificate (Coursera)',
              'Dribbble cho inspiration',
            ],
          },
          {
            phase: 'Nâng cao (6-18 tháng)',
            tasks: [
              'Học User Research & Usability Testing',
              'Xây dựng portfolio 5-7 projects',
              'Tham gia design community',
              'Freelance đầu tiên',
            ],
            resources: [
              'UX Design Institute',
              'Behance portfolio',
              'Design community trên Discord',
            ],
          },
          {
            phase: 'Chuyên nghiệp (18-36 tháng)',
            tasks: [
              'Intern hoặc Junior Designer tại startup',
              'Học Design System',
              'Mentor newbie designers',
              'Thi chứng chỉ Google UX',
            ],
            resources: [
              'LinkedIn Jobs',
              'TopCV',
              'Design conferences (Config, Into)',
            ],
          },
        ],
      },
      {
        career: 'Content Creator / YouTuber',
        phases: [
          {
            phase: 'Nền tảng (0-6 tháng)',
            tasks: [
              'Chọn niche và target audience',
              'Học edit video cơ bản (CapCut/Premiere)',
              'Đăng 20 video/content đầu tiên',
              'Nghiên cứu trend và algorithm',
            ],
            resources: [
              'YouTube Creator Academy',
              'CapCut tutorials',
              'Ali Abdaal channel',
            ],
          },
          {
            phase: 'Nâng cao (6-18 tháng)',
            tasks: [
              'Xây dựng brand cá nhân',
              'Đạt 1000 subscribers/followers',
              'Collab với creators khác',
              'Monetize đầu tiên',
            ],
            resources: [
              'Canva cho thumbnail',
              'VidIQ/TubeBuddy',
              'Creator communities',
            ],
          },
          {
            phase: 'Chuyên nghiệp (18-36 tháng)',
            tasks: [
              'Scale lên multi-platform',
              'Nhận brand deals',
              'Thuê team hoặc VA',
              'Xây dựng sản phẩm riêng',
            ],
            resources: [
              'Sponsorship platforms',
              'Email marketing tools',
              'Merchandise platforms',
            ],
          },
        ],
      },
      {
        career: 'Frontend Developer',
        phases: [
          {
            phase: 'Nền tảng (0-6 tháng)',
            tasks: [
              'Học HTML, CSS, JavaScript cơ bản',
              'Làm 5 mini projects',
              'Học Git & GitHub',
              'Tham gia cộng đồng dev',
            ],
            resources: ['freeCodeCamp', 'The Odin Project', 'JavaScript.info'],
          },
          {
            phase: 'Nâng cao (6-18 tháng)',
            tasks: [
              'Học React/Vue framework',
              'Build 3 full projects có deploy',
              'Học TypeScript',
              'Contribute open source',
            ],
            resources: [
              'React Official Docs',
              'Vercel/Netlify deploy',
              'GitHub open source projects',
            ],
          },
          {
            phase: 'Chuyên nghiệp (18-36 tháng)',
            tasks: [
              'Intern tại tech company',
              'Học system design cơ bản',
              'Xây portfolio website ấn tượng',
              'Chuẩn bị phỏng vấn tech',
            ],
            resources: [
              'LeetCode (Easy-Medium)',
              'TopDev/ITviec',
              'Tech interview handbook',
            ],
          },
        ],
      },
      {
        career: 'Game Designer',
        phases: [
          {
            phase: 'Nền tảng (0-6 tháng)',
            tasks: [
              'Học Unity cơ bản',
              'Tạo 3 mini games',
              'Nghiên cứu game mechanics',
              'Chơi và phân tích 10 indie games',
            ],
            resources: [
              'Unity Learn',
              'Brackeys YouTube',
              'Game Design Document templates',
            ],
          },
          {
            phase: 'Nâng cao (6-18 tháng)',
            tasks: [
              'Publish game đầu tiên lên itch.io',
              'Tham gia Game Jam',
              'Học level design & narrative',
              'Build portfolio',
            ],
            resources: [
              'itch.io',
              'Global Game Jam',
              'Game dev Discord servers',
            ],
          },
          {
            phase: 'Chuyên nghiệp (18-36 tháng)',
            tasks: [
              'Intern tại game studio',
              'Publish trên Steam/App Store',
              'Xây team phát triển game',
              'Thi các giải game dev',
            ],
            resources: [
              'Steamworks',
              'Game studio VN (VNG, Amanotes)',
              'IndieDB',
            ],
          },
        ],
      },
      {
        career: 'Digital Marketing Specialist',
        phases: [
          {
            phase: 'Nền tảng (0-6 tháng)',
            tasks: [
              'Học Google Digital Garage (miễn phí)',
              'Tạo và chạy campaign đầu tiên',
              'Học Facebook/Google Ads cơ bản',
              'Hiểu về SEO & content marketing',
            ],
            resources: [
              'Google Digital Garage',
              'HubSpot Academy',
              'Ahrefs Blog',
            ],
          },
          {
            phase: 'Nâng cao (6-18 tháng)',
            tasks: [
              'Lấy chứng chỉ Google Ads',
              'Quản lý budget 5-10 triệu/tháng',
              'Học data analytics & A/B testing',
              'Freelance cho 2-3 clients',
            ],
            resources: [
              'Google Ads Certification',
              'Google Analytics Academy',
              'Facebook Blueprint',
            ],
          },
          {
            phase: 'Chuyên nghiệp (18-36 tháng)',
            tasks: [
              'Intern tại agency hoặc brand',
              'Quản lý multi-channel campaigns',
              'Học marketing automation',
              'Build personal brand trong ngành',
            ],
            resources: [
              'LinkedIn',
              'Marketing agencies VN',
              'Digital marketing conferences',
            ],
          },
        ],
      },
    ],
    funFacts: [
      {
        emoji: '🔮',
        fact: 'Số 7 được gọi là "con số thần bí" - những người số 7 thường có trực giác rất mạnh và hay đúng khi "cảm thấy" điều gì đó!',
      },
      {
        emoji: '🧠',
        fact: 'Người có EQ cao thường thành công hơn 58% so với người chỉ có IQ cao. Bạn đang đi đúng hướng!',
      },
      {
        emoji: '🌟',
        fact: 'Theo thần số học, năm nay là năm "sáng tạo" của bạn - thời điểm tuyệt vời để bắt đầu những dự án mới!',
      },
      {
        emoji: '💫',
        fact: 'Số 3 trong thần số học liên kết với hành tinh Jupiter - hành tinh của may mắn và mở rộng. Lucky you!',
      },
      {
        emoji: '🎯',
        fact: '73% Gen Z tin rằng đam mê quan trọng hơn lương cao khi chọn nghề. Bạn không đơn độc trong suy nghĩ này!',
      },
    ],
  };
}
