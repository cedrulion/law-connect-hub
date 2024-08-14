import React from 'react';
import { FaRegCalendarAlt } from 'react-icons/fa';

const BlogPage = () => {
  const blogs = [
    {
      id: 1,
      title: 'Understanding Contract Law',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-08-01',
      excerpt: 'An overview of contract law principles and how they apply in everyday scenarios.',
    },
    {
      id: 2,
      title: 'Recent Changes in Employment Law',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-07-25',
      excerpt: 'A summary of the latest changes in employment law and their impact on businesses.',
    },
    {
      id: 3,
      title: 'Navigating Intellectual Property Rights',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-07-15',
      excerpt: 'Learn about the different types of intellectual property rights and how to protect your creations.',
    },
    {
      id: 4,
      title: 'Family Law: What You Need to Know',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-06-30',
      excerpt: 'An introduction to family law, including divorce, child custody, and more.',
    },
    {
      id: 5,
      title: 'Cybersecurity and Data Protection Laws',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-06-20',
      excerpt: 'How to stay compliant with data protection laws and secure your digital assets.',
    },
    {
      id: 6,
      title: 'The Importance of Legal Due Diligence',
      imageUrl: 'https://via.placeholder.com/600x400', // Placeholder image
      date: '2024-06-10',
      excerpt: 'Why conducting legal due diligence is crucial in mergers and acquisitions.',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-center text-gray-800">LawConnect Hub Blog</h1>
        <p className="text-center text-gray-600">Insights and updates from the world of law</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-white rounded-lg shadow-lg p-6">
            <div className="mb-4">
              <img
                src={blog.imageUrl}
                alt={blog.title}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="mb-2">
              <h2 className="text-2xl font-bold text-gray-800">{blog.title}</h2>
            </div>
            <div className="mb-4 text-gray-600 flex items-center">
              <FaRegCalendarAlt className="mr-2" />
              <span>{new Date(blog.date).toLocaleDateString()}</span>
            </div>
            <p className="text-gray-700 mb-4">{blog.excerpt}</p>
            <a
              href="#"
              className="text-blue-500 hover:underline font-semibold"
            >
              Read More
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPage;
