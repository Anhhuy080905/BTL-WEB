import * as Yup from 'yup';

export const profileUpdateSchema = Yup.object({
  fullName: Yup.string()
    .required('Vui lòng nhập họ tên')
    .min(3, 'Họ tên phải có ít nhất 3 ký tự')
    .max(50, 'Họ tên không được quá 50 ký tự'),

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

  // Nếu event_manager muốn sửa tên tổ chức
  organization: Yup.string()
    .min(3, 'Tên tổ chức phải có ít nhất 3 ký tự')
    .max(100, 'Tên tổ chức không được quá 100 ký tự')
    .when('role', {
      is: 'event_manager',
      then: schema => schema.required('Vui lòng nhập tên tổ chức'),
      otherwise: schema => schema.notRequired()
    }),

  avatar: Yup.mixed()
    .nullable()
    .test('fileSize', 'Ảnh đại diện tối đa 2MB', value => {
      return !value || (value.size <= 2 * 1024 * 1024);
    })
    .test('fileType', 'Chỉ chấp nhận file ảnh jpg, png', value => {
      return !value || ['image/jpeg', 'image/png'].includes(value.type);
    })
});

export const changePasswordSchema = Yup.object({
  currentPassword: Yup.string()
    .required('Vui lòng nhập mật khẩu hiện tại')
    .min(6, 'Mật khẩu hiện tại phải có ít nhất 6 ký tự'),

  newPassword: Yup.string()
    .required('Vui lòng nhập mật khẩu mới')
    // .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
    // .matches(/[a-z]/, 'Mật khẩu mới phải có ít nhất 1 chữ thường')
    // .matches(/[A-Z]/, 'Mật khẩu mới phải có ít nhất 1 chữ hoa')
    // .matches(/\d/, 'Mật khẩu mới phải có ít nhất 1 số')
    // .matches(/[@$!%*?&#]/, 'Mật khẩu mới phải có ít nhất 1 ký tự đặc biệt')
    .notOneOf([Yup.ref('currentPassword')], 'Mật khẩu mới không được trùng mật khẩu cũ'),

  confirmNewPassword: Yup.string()
    .required('Vui lòng xác nhận mật khẩu mới')
    .oneOf([Yup.ref('newPassword')], 'Mật khẩu xác nhận không khớp')
});