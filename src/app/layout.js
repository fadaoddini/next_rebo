import '@/styles/globals.css';
import Header from '@/components/Header';
import { AuthProvider } from '@/context/AuthContext'; // وارد کردن AuthProvider

export const metadata = {
  title: "سامانه بورس خرما | ربو",
  description: "خرید و فروش بی واسطه خرما",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa">
      <body>
        {/* قرار دادن AuthProvider برای دسترسی به Context */}
        <AuthProvider>
          {/* هدر که در تمام صفحات نمایش داده می‌شود */}
          <Header />  
          
          {/* محتوای صفحات مختلف که در children قرار می‌گیرد */}
          <main>{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
