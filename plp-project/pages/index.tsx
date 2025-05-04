import { GetServerSideProps } from 'next';
import Image from 'next/image';
import { useState } from 'react';
import Head from 'next/head';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface HomeProps {
  products: Product[];
}

export const getServerSideProps: GetServerSideProps = async () => {
  const res = await fetch('https://fakestoreapi.com/products');
  const products: Product[] = await res.json();
  return { props: { products } };
};

export default function Home({ products }: HomeProps) {
  const [sortOption, setSortOption] = useState('recommended');

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortOption) {
      case 'newest':
        return b.id - a.id;
      case 'popular':
        return a.title.localeCompare(b.title);
      case 'priceHigh':
        return b.price - a.price;
      case 'priceLow':
        return a.price - b.price;
      default:
        return 0;
    }
  });

  return (
    <main className="min-h-screen p-4 bg-white">
      <Head>
        <title>Product Listing Page</title>
      </Head>
      <h1 className="text-center text-3xl font-bold mb-6">Discover Our Products</h1>

      <div className="flex justify-end mb-4">
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="recommended">Recommended</option>
          <option value="newest">Newest First</option>
          <option value="popular">Popular</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="priceLow">Price: Low to High</option>
        </select>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
        {sortedProducts.map(product => (
          <div key={product.id} className="border rounded-lg p-4 shadow-sm">
            <div className="h-40 w-full relative">
              <Image src={product.image} alt={product.title} layout="fill" objectFit="contain" />
            </div>
            <h2 className="text-sm mt-2 font-medium line-clamp-2">{product.title}</h2>
            <p className="text-gray-600 font-semibold">${product.price}</p>
            <p className="text-sm text-blue-600 underline cursor-pointer">Sign in or Create an account to see pricing</p>
          </div>
        ))}
      </div>
    </main>
  );
}