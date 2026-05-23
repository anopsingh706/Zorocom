import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { Search, MapPin, Calendar, Building2, Star, MessageSquare, Plus } from 'lucide-react';

const Home = () => {
  const [companies, setCompanies] = useState([]);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [sort, setSort] = useState('newest');
  const [loading, setLoading] = useState(true);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/companies', {
        params: { search, city, sort },
      });
      setCompanies(data);
    } catch (error) {
      console.error('Error fetching companies:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, [search, city, sort]);

  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10 flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 mb-2">
            Explore <span className="gradient-text">Companies</span>
          </h1>
          <p className="text-gray-500">Find the best places to work and grow your career.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 flex-1 max-w-4xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-10 pr-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="City..."
              className="w-32 px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select
              className="px-4 py-3 bg-white/80 backdrop-blur-sm border border-white/20 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all cursor-pointer"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="newest">Newest</option>
              <option value="name">Name (A-Z)</option>
              <option value="rating">Top Rated</option>
            </select>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-bounce h-4 w-4 bg-blue-600 rounded-full mx-1"></div>
          <div className="animate-bounce h-4 w-4 bg-blue-600 rounded-full mx-1 delay-100"></div>
          <div className="animate-bounce h-4 w-4 bg-blue-600 rounded-full mx-1 delay-200"></div>
        </div>
      ) : companies.length === 0 ? (
        <div className="text-center py-20 glass-card rounded-2xl">
          <p className="text-gray-500 text-xl font-medium">No companies found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {companies.map((company) => (
            <Link
              key={company._id}
              to={`/company/${company._id}`}
              className="group glass-card rounded-2xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="h-52 bg-white p-8 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {company.logoUrl ? (
                  <img
                    src={company.logoUrl.startsWith('http') ? company.logoUrl : `http://localhost:5000${company.logoUrl}`}
                    alt={company.name}
                    className="h-full w-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <Building2 className="h-20 w-20 text-gray-200" />
                )}
                
                {company.averageRating > 0 && (
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full shadow-sm flex items-center gap-1 border border-white/50">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-bold text-gray-700">{company.averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              
              <div className="p-8 flex-1 flex flex-col">
                <h2 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                  {company.name}
                </h2>
                
                <div className="space-y-2 mb-6">
                  <div className="flex items-center text-gray-500 text-sm">
                    <MapPin className="h-4 w-4 mr-2 text-blue-500" />
                    {company.city}, {company.location}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    Est. {new Date(company.foundedOn).getFullYear()}
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <MessageSquare className="h-4 w-4 mr-2 text-blue-500" />
                    {company.totalReviews || 0} Reviews
                  </div>
                </div>

                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-6">
                  {company.description}
                </p>

                <div className="mt-auto pt-6 border-t border-gray-100/50 flex items-center justify-between">
                  <span className="text-blue-600 font-bold text-sm tracking-wide uppercase">
                    View Details
                  </span>
                  <div className="h-8 w-8 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Plus className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
