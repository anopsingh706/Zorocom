import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../utils/api';
import { MapPin, Calendar, Star, ThumbsUp, Share2, Plus, MessageSquare } from 'lucide-react';

const CompanyDetail = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(null);
  const [reviewsData, setReviewsData] = useState({ reviews: [], averageRating: 0, totalReviews: 0 });
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewFormData, setReviewFormData] = useState({
    fullName: '',
    subject: '',
    reviewText: '',
    rating: 5,
  });
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [compRes, revRes] = await Promise.all([
        api.get(`/companies/${id}`),
        api.get(`/reviews/company/${id}`, { params: { sort } }),
      ]);
      setCompany(compRes.data);
      setReviewsData(revRes.data);
    } catch (error) {
      console.error('Error fetching company data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, sort]);

  const handleReviewChange = (e) => {
    setReviewFormData({ ...reviewFormData, [e.target.name]: e.target.value });
  };

  const handleRatingChange = (rating) => {
    setReviewFormData({ ...reviewFormData, rating });
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setSubmittingReview(true);
    try {
      await api.post('/reviews', { ...reviewFormData, companyId: id });
      setReviewFormData({ fullName: '', subject: '', reviewText: '', rating: 5 });
      setShowReviewForm(false);
      fetchData(); // Refresh reviews
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleLike = async (reviewId) => {
    try {
      const { data } = await api.patch(`/reviews/${reviewId}/like`);
      setReviewsData((prev) => ({
        ...prev,
        reviews: prev.reviews.map((r) => (r._id === reviewId ? data : r)),
      }));
    } catch (error) {
      console.error('Error liking review:', error);
    }
  };

  if (loading && !company) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!company) return <div className="text-center py-20">Company not found.</div>;

  return (
    <div className="space-y-8">
      {/* Company Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-48 h-48 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-gray-100 shadow-inner p-4">
          {company.logoUrl ? (
            <img
              src={company.logoUrl.startsWith('http') ? company.logoUrl : `http://localhost:5000${company.logoUrl}`}
              alt={company.name}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <span className="text-4xl font-bold text-gray-300">{company.name[0]}</span>
          )}
        </div>
        <div className="flex-1">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{company.name}</h1>
          <div className="flex flex-wrap items-center gap-4 text-gray-500 mb-4">
            <div className="flex items-center">
              <MapPin className="h-4 w-4 mr-1 text-blue-500" />
              {company.city}, {company.location}
            </div>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 mr-1 text-blue-500" />
              Founded: {new Date(company.foundedOn).toLocaleDateString()}
            </div>
          </div>
          <p className="text-gray-600 leading-relaxed max-w-3xl">
            {company.description || 'No description available for this company.'}
          </p>
        </div>
        <div className="flex flex-col items-center justify-center bg-blue-50 rounded-xl p-6 min-w-[160px]">
          <div className="text-4xl font-black text-blue-600 mb-1">{reviewsData.averageRating}</div>
          <div className="flex mb-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= Math.round(reviewsData.averageRating)
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <div className="text-xs text-blue-800 font-medium uppercase tracking-wider">
            {reviewsData.totalReviews} Reviews
          </div>
        </div>
      </div>

      {/* Reviews Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <MessageSquare className="mr-2 h-6 w-6 text-blue-600" />
          User Reviews
        </h2>
        <div className="flex items-center gap-4">
          <select
            className="bg-white border border-gray-300 text-gray-700 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block p-2"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="rating">Highest Rating</option>
            <option value="oldest">Oldest First</option>
          </select>
          <button
            onClick={() => setShowReviewForm(!showReviewForm)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Review
          </button>
        </div>
      </div>

      {/* Add Review Form */}
      {showReviewForm && (
        <div className="bg-white rounded-xl shadow-md border border-blue-100 p-8 animate-in fade-in slide-in-from-top-4 duration-300">
          <h3 className="text-xl font-semibold mb-6">Write a Review</h3>
          <form onSubmit={handleReviewSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={reviewFormData.fullName}
                  onChange={handleReviewChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                <input
                  type="text"
                  name="subject"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  value={reviewFormData.subject}
                  onChange={handleReviewChange}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => handleRatingChange(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= reviewFormData.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Text</label>
              <textarea
                name="reviewText"
                rows="4"
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={reviewFormData.reviewText}
                onChange={handleReviewChange}
              ></textarea>
            </div>
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setShowReviewForm(false)}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submittingReview}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-md transition-all disabled:bg-blue-300"
              >
                {submittingReview ? 'Posting...' : 'Post Review'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Review List */}
      <div className="space-y-6">
        {reviewsData.reviews.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
            <p className="text-gray-500">No reviews yet. Be the first to review!</p>
          </div>
        ) : (
          reviewsData.reviews.map((review) => (
            <div key={review._id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold">
                    {review.fullName[0].toUpperCase()}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{review.fullName}</h4>
                    <p className="text-xs text-gray-500">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
              <h5 className="font-semibold text-gray-800 mb-2">{review.subject}</h5>
              <p className="text-gray-600 mb-6 leading-relaxed">{review.reviewText}</p>
              <div className="flex items-center gap-6 pt-4 border-t border-gray-50">
                <button
                  onClick={() => handleLike(review._id)}
                  className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group"
                >
                  <ThumbsUp className={`h-4 w-4 mr-2 group-hover:scale-110 transition-transform ${review.likes > 0 ? 'text-blue-600 fill-current' : ''}`} />
                  {review.likes || 0} Likes
                </button>
                <button className="flex items-center text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors group">
                  <Share2 className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Share
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CompanyDetail;
