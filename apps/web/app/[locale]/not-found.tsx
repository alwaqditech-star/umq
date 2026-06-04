import { PremiumErrorPage } from "@/components/errors/premium-error-page";

export default function LocaleNotFound() {
  return (
    <PremiumErrorPage
      code="404"
      titleAr="الصفحة غير موجودة"
      titleEn="Page not found"
      messageAr="عذراً، الصفحة التي تبحث عنها غير متاحة أو تم نقلها أو حذفها."
      messageEn="Sorry, the page you're looking for isn't available, was moved, or removed."
      showSearch
    />
  );
}
