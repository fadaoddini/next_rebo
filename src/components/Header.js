import Link from 'next/link';

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        <Link href="/">
          <a className="hover:text-gray-400">Home</a>
        </Link>
        <Link href="/profile">
          <a className="hover:text-gray-400">Profile</a>
        </Link>
        <Link href="/bazar">
          <a className="hover:text-gray-400">Bazar</a>
        </Link>
        <Link href="/product">
          <a className="hover:text-gray-400">Product</a>
        </Link>
        <Link href="/category">
          <a className="hover:text-gray-400">Category</a>
        </Link>
      </nav>
    </header>
  );
}
