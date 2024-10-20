import Link from 'next/link';

export default function Header() {
  return (
    <header className="text-center bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        <Link className="hover:text-gray-400" href="/">
          خانه
        </Link>
        <Link className="hover:text-gray-400" href="/profile">
         پروفایل
        </Link>
        <Link className="hover:text-gray-400" href="/bazar">
          بازار
        </Link>
        <Link className="hover:text-gray-400" href="/product">
          محصول
        </Link>
        <Link className="hover:text-gray-400" href="/category">
          دسته بندی 
        </Link>
      </nav>
    </header>
  );
}
