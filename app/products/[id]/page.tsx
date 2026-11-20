import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ProductCard from "../../components/ProductCard";
import Stars from "../../components/Stars";
import { getProduct, products, relatedProducts } from "../../data/products";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

// Pre-build one static page per product at build time.
export function generateStaticParams() {
  return products.map((product) => ({ id: product.id }));
}

// Per-page dynamic metadata for each product
export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { id } = await params;
  const product = getProduct(id);

  if (!product) {
    return {
      title: "Product Not Found",
      description: "We could not find that item. It may have sold out or moved.",
    };
  }

  return {
    title: product.name,
    description: `${product.tagline} ${product.description}`,
  };
}

// Lazy-load the heavy below-the-fold customer reviews section
const Reviews = dynamic(() => import("../../components/Reviews"), {
  loading: () => (
    <div className="reviews-loading" aria-label="Loading customer reviews">
      <div className="reviews-skeleton-header" />
      <div className="reviews-skeleton-card" />
    </div>
  ),
});

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const product = getProduct(id);

  // If the id in the URL does not match a product, show the 404 page.
  if (!product) {
    notFound();
  }

  const related = relatedProducts(product);

  return (
    <main className="container">
      <nav className="crumbs">
        <Link href="/">Home</Link>
        <span>/</span>
        <Link href={`/#${product.category}`}>{product.category}</Link>
        <span>/</span>
        <span className="crumbs-here">{product.name}</span>
      </nav>

      <article className="detail">
        <div
          className="detail-art"
          style={{
            background: `linear-gradient(135deg, ${product.accent}, ${product.accent2})`,
          }}
        >
          {product.badge && <span className="card-badge">{product.badge}</span>}
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            sizes="(max-width: 720px) 100vw, 340px"
            style={{ objectFit: "cover" }}
          />
        </div>

        <div className="detail-body">
          <span className="card-category">{product.category}</span>
          <h1 className="detail-name">{product.name}</h1>
          <p className="detail-tagline">{product.tagline}</p>
          <Stars rating={product.rating} />
          <span className="detail-price">${product.price}</span>
          <p className="detail-desc">{product.description}</p>

          <h2 className="detail-specs-title">Specs</h2>
          <ul className="detail-specs">
            {product.specs.map((spec) => (
              <li key={spec}>{spec}</li>
            ))}
          </ul>
        </div>
      </article>

      {/* Lazy-loaded heavy component */}
      <Reviews
        productId={product.id}
        productRating={product.rating}
        productName={product.name}
      />

      {related.length > 0 && (
        <section className="related">
          <div className="section-head">
            <h2 className="section-title">More in {product.category}</h2>
          </div>
          <div className="grid">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
