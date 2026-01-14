import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTestContext } from '../contexts/TestContext';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';

// ============================================
// PERSONAL INFO FORM
// Final step - collect demographic & background info
// ============================================

function PersonalInfoForm() {
  const navigate = useNavigate();
  const { saveAnswer, submitTest, currentModule, sessionId } = useTestContext();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    gender: '',
    education: '',
    current_status: '',
    location: '',
    experience_years: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Save all form data
    Object.entries(formData).forEach(([key, value]) => {
      saveAnswer(currentModule, `personal_${key}`, value);
    });

    // Submit entire test
    await submitTest();

    // Navigate to loading screen
    setTimeout(() => {
      navigate('/loading', { state: { sessionId } });
    }, 500);
  };

  const isFormValid =
    formData.name && formData.email && formData.age && formData.gender;

  return (
    <div className='max-w-3xl mx-auto'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className='bg-white rounded-3xl shadow-2xl p-8 md:p-12'
      >
        {/* Header */}
        <div className='text-center mb-8'>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className='text-6xl mb-4'
          >
            👤
          </motion.div>
          <h1 className='text-3xl md:text-4xl font-bold text-gray-900 mb-3'>
            Thông Tin Cá Nhân
          </h1>
          <p className='text-gray-600'>
            Bước cuối cùng! Giúp chúng tôi hiểu bạn hơn để đưa ra gợi ý phù hợp
            nhất 🎯
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Name */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Họ và tên <span className='text-red-500'>*</span>
            </label>
            <input
              type='text'
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder='Nguyễn Văn A'
              required
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            />
          </div>

          {/* Email */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Email <span className='text-red-500'>*</span>
            </label>
            <input
              type='email'
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder='example@email.com'
              required
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            />
            <p className='text-sm text-gray-500 mt-1'>
              Chúng tôi sẽ gửi kết quả đánh giá đến email này
            </p>
          </div>

          {/* Age & Gender (side by side) */}
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Tuổi <span className='text-red-500'>*</span>
              </label>
              <input
                type='number'
                value={formData.age}
                onChange={(e) => handleChange('age', e.target.value)}
                placeholder='18'
                min='15'
                max='100'
                required
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
              />
            </div>

            <div>
              <label className='block text-sm font-semibold text-gray-700 mb-2'>
                Giới tính <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.gender}
                onChange={(e) => handleChange('gender', e.target.value)}
                required
                className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
              >
                <option value=''>Chọn giới tính</option>
                <option value='male'>Nam</option>
                <option value='female'>Nữ</option>
                <option value='other'>Khác</option>
              </select>
            </div>
          </div>

          {/* Education */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Trình độ học vấn
            </label>
            <select
              value={formData.education}
              onChange={(e) => handleChange('education', e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            >
              <option value=''>Chọn trình độ</option>
              <option value='highschool'>THPT</option>
              <option value='diploma'>Cao đẳng</option>
              <option value='bachelor'>Đại học</option>
              <option value='master'>Thạc sĩ</option>
              <option value='phd'>Tiến sĩ</option>
              <option value='other'>Khác</option>
            </select>
          </div>

          {/* Current Status */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Tình trạng hiện tại
            </label>
            <select
              value={formData.current_status}
              onChange={(e) => handleChange('current_status', e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            >
              <option value=''>Chọn tình trạng</option>
              <option value='student'>Học sinh/Sinh viên</option>
              <option value='working'>Đang làm việc</option>
              <option value='looking'>Đang tìm việc</option>
              <option value='freelance'>Freelancer</option>
              <option value='business'>Kinh doanh</option>
              <option value='other'>Khác</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Thành phố
            </label>
            <input
              type='text'
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              placeholder='Hồ Chí Minh, Hà Nội...'
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            />
          </div>

          {/* Experience Years */}
          <div>
            <label className='block text-sm font-semibold text-gray-700 mb-2'>
              Số năm kinh nghiệm làm việc
            </label>
            <select
              value={formData.experience_years}
              onChange={(e) => handleChange('experience_years', e.target.value)}
              className='w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:outline-none transition-colors'
            >
              <option value=''>Chọn kinh nghiệm</option>
              <option value='0'>Chưa có kinh nghiệm</option>
              <option value='1-2'>1-2 năm</option>
              <option value='3-5'>3-5 năm</option>
              <option value='6-10'>6-10 năm</option>
              <option value='10+'>Trên 10 năm</option>
            </select>
          </div>

          {/* Privacy Notice */}
          <div className='bg-linear-to-r from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200'>
            <p className='text-sm text-gray-700'>
              🔒 <strong>Bảo mật:</strong> Thông tin của bạn được mã hóa và bảo
              mật tuyệt đối. Chúng tôi không chia sẻ dữ liệu cá nhân với bên thứ
              ba.
            </p>
          </div>

          {/* Submit Button */}
          <motion.button
            type='submit'
            disabled={!isFormValid || isSubmitting}
            whileHover={isFormValid ? { scale: 1.02 } : {}}
            whileTap={isFormValid ? { scale: 0.98 } : {}}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all ${
              isFormValid && !isSubmitting
                ? 'bg-linear-to-r from-emerald-600 to-teal-600 text-white hover:shadow-xl'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center gap-2'>
                <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                Đang xử lý...
              </span>
            ) : (
              'Hoàn Thành & Xem Kết Quả 🎉'
            )}
          </motion.button>

          {!isFormValid && (
            <p className='text-center text-sm text-red-500'>
              * Vui lòng điền đầy đủ các thông tin bắt buộc
            </p>
          )}
        </form>
      </motion.div>
    </div>
  );
}

export default PersonalInfoForm;
