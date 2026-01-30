/**
 * File config chứa các hàm validation cho form thông tin cá nhân
 * Mục đích: Kiểm tra tính hợp lệ của dữ liệu người dùng nhập vào
 */

// Interface định nghĩa cấu trúc object lỗi
export interface ValidationErrors {
  name?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  company?: string;
  dob?: string;
}

// Interface cho dữ liệu form
export interface ProfileFormData {
  name: string;
  email: string;
  phoneNumber: string;
  address: string;
  company: string;
  dob: string;
}

/**
 * Validate tên (Họ Tên)
 * Quy tắc:
 * - Không được để trống
 * - Độ dài tối thiểu: 2 ký tự
 * - Độ dài tối đa: 50 ký tự
 * - Chỉ chứa chữ cái, khoảng trắng và dấu tiếng Việt
 */
export const validateName = (
  name: string,
  t: (key: string) => string,
): string | undefined => {
  // Loại bỏ khoảng trắng thừa ở đầu cuối
  const trimmedName = name.trim();

  // Kiểm tra rỗng
  if (!trimmedName) {
    return t("error.updateName1");
  }

  // Kiểm tra độ dài tối thiểu
  if (trimmedName.length < 2) {
    return t("error.updateName2");
  }

  // Kiểm tra độ dài tối đa
  if (trimmedName.length > 50) {
    return t("error.updateName3");
  }

  // Kiểm tra chỉ chứa chữ cái, khoảng trắng và dấu tiếng Việt
  const nameRegex = /^[a-zA-ZÀ-ỹ\s]+$/;
  if (!nameRegex.test(trimmedName)) {
    return t("error.updateName4");
  }

  // Không có lỗi
  return undefined;
};

/**
 * Validate email
 * Quy tắc:
 * - Không được để trống
 * - Phải đúng định dạng email (có @ và domain)
 * - Độ dài tối đa: 100 ký tự
 */
export const validateEmail = (
  email: string,
  t: (key: string) => string,
): string | undefined => {
  const trimmedEmail = email.trim();

  // Kiểm tra rỗng
  if (!trimmedEmail) {
    return t("error.updateEmail1");
  }

  // Kiểm tra độ dài tối đa
  if (trimmedEmail.length > 100) {
    return t("error.updateEmail2");
  }

  // Regex kiểm tra định dạng email
  // Pattern: username@domain.extension
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmedEmail)) {
    return t("error.updateEmail3");
  }

  return undefined;
};

/**
 * Validate số điện thoại
 * Quy tắc:
 * - Không bắt buộc (có thể để trống)
 * - Nếu nhập: phải là số điện thoại Việt Nam hợp lệ
 * - Bắt đầu bằng 0 hoặc +84
 * - Có 10-11 chữ số
 */
export const validatePhoneNumber = (
  phone: string,
  t: (key: string) => string,
): string | undefined => {
  const trimmedPhone = phone.trim();

  // Cho phép để trống (không bắt buộc)
  if (!trimmedPhone) {
    return undefined;
  }

  // Loại bỏ khoảng trắng, dấu gạch ngang, dấu chấm
  const cleanPhone = trimmedPhone.replace(/[\s\-\.]/g, "");

  // Kiểm tra định dạng số điện thoại Việt Nam
  // Bắt đầu bằng 0 hoặc +84, có 10-11 chữ số
  const phoneRegex = /^(\+84|84|0)(3|5|7|8|9)[0-9]{8}$/;
  if (!phoneRegex.test(cleanPhone)) {
    return t("error.updatePhone1");
  }

  return undefined;
};

/**
 * Validate địa chỉ
 * Quy tắc:
 * - Không bắt buộc (có thể để trống)
 * - Nếu nhập: độ dài tối thiểu 5 ký tự
 * - Độ dài tối đa: 200 ký tự
 */
export const validateAddress = (
  address: string,
  t: (key: string) => string,
): string | undefined => {
  const trimmedAddress = address.trim();

  // Cho phép để trống
  if (!trimmedAddress) {
    return undefined;
  }

  return undefined;
};

/**
 * Validate tên công ty
 * Quy tắc:
 * - Không bắt buộc (có thể để trống)
 * - Nếu nhập: độ dài tối thiểu 2 ký tự
 * - Độ dài tối đa: 100 ký tự
 */
export const validateCompany = (
  company: string,
  t: (key: string) => string,
): string | undefined => {
  const trimmedCompany = company.trim();

  // Cho phép để trống
  if (!trimmedCompany) {
    return undefined;
  }

  // Kiểm tra độ dài tối thiểu
  if (trimmedCompany.length < 2) {
    return t("error.updateCompany1");
  }

  // Kiểm tra độ dài tối đa
  if (trimmedCompany.length > 100) {
    return t("error.updateCompany2");
  }

  return undefined;
};

/**
 * Validate ngày sinh
 * Quy tắc:
 * - Không bắt buộc (có thể để trống)
 * - Nếu nhập: phải là ngày hợp lệ
 * - Phải trong quá khứ (không thể sinh trong tương lai)
 * - Tuổi phải từ 1 đến 120
 */
export const validateDob = (
  dobNumber: number | undefined,
  t: (key: string) => string,
): string | undefined => {
  // Cho phép để trống
  if (!dobNumber) {
    return undefined;
  }

  // Convert số DDMMYYYY thành Date object
  const dobStr = dobNumber.toString();

  // Kiểm tra độ dài phải là 8 chữ số (DDMMYYYY)
  if (dobStr.length !== 8) {
    return t("error.updateDOB1");
  }

  const day = parseInt(dobStr.substring(0, 2));
  const month = parseInt(dobStr.substring(2, 4));
  const year = parseInt(dobStr.substring(4, 8));

  // Kiểm tra năm hợp lệ (từ 1900 đến năm hiện tại)
  const currentYear = new Date().getFullYear();
  if (year < 1900 || year > currentYear) {
    return t("error.updateDOB2") + currentYear;
  }

  // Kiểm tra tháng hợp lệ (1-12)
  if (month < 1 || month > 12) {
    return t("error.updateDOB3");
  }

  // Tạo Date object để kiểm tra thêm
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();

  // Kiểm tra không được sinh trong tương lai
  if (birthDate > today) {
    return t("error.updateDOB4");
  }

  // Tính tuổi
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return undefined;
};

/**
 * Validate toàn bộ form
 * Trả về object chứa tất cả các lỗi (nếu có)
 * Nếu không có lỗi, trả về object rỗng {}
 */
export const validateProfileForm = (
  formData: ProfileFormData,
  dobNumber: number | undefined,
  t: (key: string) => string,
): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Validate từng field
  const nameError = validateName(formData.name, t);
  if (nameError) errors.name = nameError;

  const emailError = validateEmail(formData.email, t);
  if (emailError) errors.email = emailError;

  const phoneError = validatePhoneNumber(formData.phoneNumber, t);
  if (phoneError) errors.phoneNumber = phoneError;

  const addressError = validateAddress(formData.address, t);
  if (addressError) errors.address = addressError;

  const companyError = validateCompany(formData.company, t);
  if (companyError) errors.company = companyError;

  const dobError = validateDob(dobNumber, t);
  if (dobError) errors.dob = dobError;

  return errors;
};

/**
 * Kiểm tra xem form có lỗi không
 * Trả về true nếu có ít nhất 1 lỗi
 */
export const hasErrors = (errors: ValidationErrors): boolean => {
  return Object.keys(errors).length > 0;
};
