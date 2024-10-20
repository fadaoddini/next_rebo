import Link from 'next/link';

export default function Header() {
  return (
    <header className="text-center bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        <Link href="/">
          <a className="hover:text-gray-400">خانه</a>
        </Link>
        <Link href="/profile">
          <a className="hover:text-gray-400">پروفایل</a>
        </Link>
        <Link href="/bazar">
          <a className="hover:text-gray-400">بازار</a>
        </Link>
        <Link href="/product">
          <a className="hover:text-gray-400">محصول</a>
        </Link>
        <Link href="/category">
          <a className="hover:text-gray-400">دسته بندی </a>
        </Link>
      </nav>
    </header>
  );
}
