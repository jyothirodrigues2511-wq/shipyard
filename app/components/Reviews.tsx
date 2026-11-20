"use client";

import { useState } from "react";
import Stars from "./Stars";

interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  helpfulCount: number;
  verified: boolean;
}

const mockReviewsByProduct: Record<string, Review[]> = {
  default: [
    {
      id: "r1",
      author: "Alex Morgan",
      rating: 5,
      date: "2 days ago",
      title: "Exceeded all expectations!",
      content:
        "The build quality is phenomenal and it works exactly as advertised. I have been using it daily for over two weeks with zero issues.",
      helpfulCount: 24,
      verified: true,
    },
    {
      id: "r2",
      author: "Taylor Reed",
      rating: 5,
      date: "1 week ago",
      title: "Superb value and performance",
      content:
        "Lightweight, durable, and thoughtfully designed down to every single detail. Would recommend to anyone looking for top tier gear.",
      helpfulCount: 16,
      verified: true,
    },
    {
      id: "r3",
      author: "Jordan Casey",
      rating: 4,
      date: "2 weeks ago",
      title: "Great quality, minor nitpick",
      content:
        "Overall very satisfied with the purchase. Setup was seamless. Just took a day to get used to the ergonomics, but great since.",
      helpfulCount: 9,
      verified: true,
    },
    {
      id: "r4",
      author: "Riley Vance",
      rating: 5,
      date: "3 weeks ago",
      title: "A game changer for my routine",
      content:
        "I was on the fence before buying, but this has genuinely improved my daily workflow. Battery life and stamina are remarkable.",
      helpfulCount: 12,
      verified: true,
    },
  ],
};

export default function Reviews({
  productId,
  productRating,
  productName,
}: {
  productId: string;
  productRating: number;
  productName: string;
}) {
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, number>>({});

  const reviews = mockReviewsByProduct[productId] || mockReviewsByProduct.default;

  const filteredReviews = filterRating
    ? reviews.filter((r) => r.rating === filterRating)
    : reviews;

  const handleVote = (id: string, currentVotes: number) => {
    setHelpfulVotes((prev) => ({
      ...prev,
      [id]: (prev[id] ?? currentVotes) + 1,
    }));
  };

  return (
    <section className="reviews-section" aria-labelledby="reviews-heading">
      <div className="section-head">
        <div>
          <h2 id="reviews-heading" className="section-title">
            Customer Reviews
          </h2>
          <span className="section-count">Verified feedback for {productName}</span>
        </div>
      </div>

      <div className="reviews-overview">
        <div className="reviews-score-box">
          <span className="reviews-score-large">{productRating.toFixed(1)}</span>
          <Stars rating={productRating} />
          <span className="reviews-score-sub">Based on 128 verified ratings</span>
        </div>

        <div className="reviews-bars">
          {[5, 4, 3, 2, 1].map((stars) => {
            const pct =
              stars === 5 ? 72 : stars === 4 ? 20 : stars === 3 ? 5 : stars === 2 ? 2 : 1;
            return (
              <button
                key={stars}
                type="button"
                className={`review-bar-row ${filterRating === stars ? "review-bar-row-active" : ""}`}
                onClick={() => setFilterRating(filterRating === stars ? null : stars)}
              >
                <span className="review-bar-label">{stars}★</span>
                <div className="review-bar-track">
                  <div className="review-bar-fill" style={{ width: `${pct}%` }} />
                </div>
                <span className="review-bar-pct">{pct}%</span>
              </button>
            );
          })}
        </div>
      </div>

      {filterRating && (
        <div className="reviews-filter-status">
          <span>Showing {filterRating}-star reviews only</span>
          <button
            type="button"
            className="reviews-filter-clear"
            onClick={() => setFilterRating(null)}
          >
            Clear filter
          </button>
        </div>
      )}

      <div className="reviews-list">
        {filteredReviews.map((review) => {
          const currentHelpful = helpfulVotes[review.id] ?? review.helpfulCount;
          return (
            <article key={review.id} className="review-card">
              <div className="review-header">
                <div>
                  <div className="review-author-row">
                    <span className="review-author">{review.author}</span>
                    {review.verified && (
                      <span className="review-verified-badge">✓ Verified Buyer</span>
                    )}
                  </div>
                  <span className="review-date">{review.date}</span>
                </div>
                <Stars rating={review.rating} />
              </div>

              <h3 className="review-title">{review.title}</h3>
              <p className="review-content">{review.content}</p>

              <div className="review-footer">
                <button
                  type="button"
                  className="review-helpful-btn"
                  onClick={() => handleVote(review.id, review.helpfulCount)}
                >
                  👍 Helpful ({currentHelpful})
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
