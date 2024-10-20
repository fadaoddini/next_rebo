import '@/styles/globals.css';
import Header from '@/components/Header';

export const metadata = {
  title: "سامانه بورس خرما | ربو",
  description: "خرید و فروش بی واسطه خرما",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body>
        {/* هدر که در تمام صفحات نمایش داده می‌شود */}
        <Header />  
        
        {/* محتوای صفحات مختلف که در children قرار می‌گیرد */}
        <main>{children}</main>
        
        {/* در صورت نیاز می‌توانی فوتر نیز اضافه کنی */}
        <footer className="text-center bg-gray-800 text-white p-4">
          <p>تمام حقوق محفوظ است © 2024</p>
        </footer>
      </body>
    </html>
  );
}