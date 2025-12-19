import * as Yup from "yup";

export const profileSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Tên đăng nhập ít nhất 3 ký tự")
    .max(30, "Tên đăng nhập tối đa 30 ký tự")
    .matches(/^[a-zA-Z0-9_]+$/, "Chỉ chữ cái, số và dấu gạch dưới"),
  fullName: Yup.string()
    .min(2, "Họ và tên ít nhất 2 ký tự"),
  phone: Yup.string()
    .matches(/^0[1-9][0-9]{8}$/, "Số điện thoại phải bắt đầu bằng 0 và có 10 chữ số")
    .optional(),
  birthDate: Yup.date()
    .max(new Date(), "Ngày sinh không được trong tương lai")
    .optional(),
});