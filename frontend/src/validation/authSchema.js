import * as Yup from "yup";

// Schema chung cho email & password
export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export const registerSchema = Yup.object().shape({
  username: Yup.string()
    .required("Tên đăng nhập là bắt buộc")
    .min(3, "Tên đăng nhập ít nhất 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Chỉ chữ cái, số và dấu gạch dưới"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email là bắt buộc"),
  password: Yup.string()
    .required("Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải ít nhất 6 ký tự"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Mật khẩu xác nhận không khớp")
    .required("Xác nhận mật khẩu là bắt buộc"),
  fullName: Yup.string()
    .required("Họ và tên là bắt buộc")
    .min(2, "Họ và tên ít nhất 2 ký tự"),
  phone: Yup.string()
    .matches(/^0[1-9][0-9]{8}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số")
    .optional(),
});