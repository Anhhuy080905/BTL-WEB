import * as Yup from 'yup';

export const registerSchema = Yup.object({
  username: Yup.string()
    .required('Vui lòng nhập tên đăng nhập')
    .min(3, 'Tên đăng nhập phải có ít nhất 3 ký tự')
    .max(20, 'Tên đăng nhập không được quá 20 ký tự')
    .matches(/^[a-zA-Z0-9_-]+$/, 'Tên đăng nhập chỉ chứa chữ, số, gạch dưới và gạch ngang')
    .test('no-all-numbers', 'Tên đăng nhập không được chỉ chứa số', value => {
      return value ? !/^\d+$/.test(value) : true;
    }),

  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Email phải có tên miền hợp lệ'),

  password: Yup.string()
    .required('Vui lòng nhập mật khẩu')
    // .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    // .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    // .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    // .matches(/\d/, 'Mật khẩu phải có ít nhất 1 số')
    // .matches(/[@$!%*?&#]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt')
    ,

  confirmPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),

  fullName: Yup.string()
    .required('Vui lòng nhập họ tên')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ tên không được quá 50 ký tự')
    .test('valid-name', 'Họ tên phải có ít nhất 2 từ và không chứa số', value => {
      if (!value) return true;
      const words = value.trim().split(/\s+/);
      return words.length >= 1 && /^[a-zA-ZÀ-ỹ\s]+$/.test(value);
    }),

  phone: Yup.string()
    .transform(value => value?.replace(/\s+/g, ''))
    .required('Vui lòng nhập số điện thoại')
    .matches(/^(0|\+84)[0-9]{9,10}$/, 'Số điện thoại không hợp lệ'),

  birthDate: Yup.date()
    .required('Vui lòng chọn ngày sinh')
    .max(new Date(), 'Ngày sinh không được là tương lai')
    .test('age', value => {
      if (!value) return true;
      const today = new Date();
      const birthDate = new Date(value);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
      return age >= 0;
    }),

  role: Yup.string()
    .oneOf(['volunteer', 'event_manager'], 'Vai trò không hợp lệ')
    .required('Vui lòng chọn vai trò'),

  agreeToTerms: Yup.boolean()
    .oneOf([true], 'Bạn phải đồng ý với điều khoản sử dụng')
    .required('Bạn phải đồng ý với điều khoản sử dụng'),

  agreePrivacy: Yup.boolean()
  .oneOf([true], 'Bạn phải đồng ý với chính sách bảo mật')
  .required('Bạn phải đồng ý với chính sách bảo mật'),
});

export const loginSchema = Yup.object({
  identifier: Yup.string()
    .required('Vui lòng nhập email hoặc tên đăng nhập'),
    // .min(3, 'Phải có ít nhất 3 ký tự'),
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu'),
    // .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  rememberMe: Yup.boolean()
});

export const forgotPasswordSchema = Yup.object({
  email: Yup.string()
    .required('Vui lòng nhập email')
    .email('Email không hợp lệ')
});

export const resetPasswordSchema = Yup.object({
  password: Yup.string()
    .required('Vui lòng nhập mật khẩu mới')
    // .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
    // .matches(/[a-z]/, 'Mật khẩu phải có ít nhất 1 chữ thường')
    // .matches(/[A-Z]/, 'Mật khẩu phải có ít nhất 1 chữ hoa')
    // .matches(/\d/, 'Mật khẩu phải có ít nhất 1 số')
    // .matches(/[@$!%*?&#]/, 'Mật khẩu phải có ít nhất 1 ký tự đặc biệt')
    ,
  confirmPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu')
    .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp')
});