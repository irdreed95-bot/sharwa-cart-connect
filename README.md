# Sharwa Storefront

"أريد إنشاء تطبيق ويب متكامل لمتجر إلكتروني باسم (شروة ستور - Sharwa Store).

التقنيات المطلوبة: React, Tailwind CSS, Lucide Icons.

المواصفات المطلوبة للواجهة الأمامية (Front-end):

تصميم عصري وفخم، متجاوب تماماً مع الهاتف المحمول (Mobile-first).

شريط علوي (Navbar) يحتوي على اسم المتجر، وأيقونة سلة المشتريات تظهر عدد العناصر.

شريط تمرير أفقي للأقسام التالية: (الكل، إكسسوارات، عطور، عناية بالبشرة، هدايا رجالية، هدايا نسائية، مواد منزلية، كماليات السيارات، ساعات، اجهزة الكترونية).

شبكة منتجات (Product Grid) تعرض صورة المنتج، اسمه، فئته، والسعر بالدينار العراقي (د.ع)، مع زر إضافة للسلة.

سلة مشتريات تفتح كـ Sidebar، تتيح حذف المنتجات أو زيادة عددها.

عملية الدفع (Checkout): لا أريد بوابة دفع إلكترونية. بدلاً من ذلك، عند النقر على إتمام الطلب، تظهر نافذة تطلب (الاسم، العنوان، رقم الهاتف)، ثم تقوم بتحويل المستخدم إلى WhatsApp API على الرقم (+9647828638203) مع إرسال رسالة مجهزة تلقائياً تحتوي على تفاصيل الطلب بالكامل ومجموع السعر.

المواصفات المطلوبة للوحة التحكم (Admin Dashboard):

أريد واجهة مخفية للإدارة (Admin Panel) تتيح لي إضافة المنتجات، تعديلها، حذفها، ورفع الصور الخاصة بها.

يتم حفظ المنتجات في قاعدة بيانات محلية (Local Storage) أو قاعدة بيانات خفيفة مدعومة من طرفكم (مثل Supabase) لكي أتمكن من إضافة المنتجات التي أسحبها من منصة Taager بسهولة.

رجاءً اجعل الكود نظيفاً وقابلاً للنشر مباشرة."

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://sharwa-cart-connect.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/bb75357f-34bb-469c-a006-a95599b4ceb4).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
