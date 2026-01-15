import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Star,
  Tag,
  ArrowRight,
  Printer,
  CheckCircle,
  Sparkles,
  Zap,
  Award,
  Eye,
  Image as ImageIcon,
} from "lucide-react";

const FALLBACK_IMG = "/images/service-placeholder.jpg"; // ✅ put an image in public/images/

export default function ServiceCard({ item, index, className = "", style }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imgOk, setImgOk] = useState(true);

  const getCategoryIcon = (category) => {
    const icons = {
      Business: <Printer className="w-4 h-4" />,
      Marketing: <Eye className="w-4 h-4" />,
      Events: <Sparkles className="w-4 h-4" />,
      Custom: <Award className="w-4 h-4" />,
      "Large Format": <Zap className="w-4 h-4" />,
      "Photo Printing": <Sparkles className="w-4 h-4" />,
    };
    return icons[category] || <Printer className="w-4 h-4" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      Business: "bg-blue-100 text-blue-700",
      Marketing: "bg-green-100 text-green-700",
      Events: "bg-purple-100 text-purple-700",
      Custom: "bg-amber-100 text-amber-700",
      "Large Format": "bg-red-100 text-red-700",
      "Photo Printing": "bg-pink-100 text-pink-700",
    };
    return colors[category] || "bg-slate-100 text-slate-700";
  };

  // ✅ stable features (not random every re-render)
  const features = useMemo(() => {
    if (!item?.description) return [];
    const commonFeatures = [
      "Matte/Gloss finish",
      "Lamination available",
      "Same day service",
      "Bulk discounts",
      "Custom sizes",
      "Free design help",
      "Delivery available",
    ];
    // pick 2-3 deterministic items based on name length
    const n = item?.name?.length || 0;
    const count = 2 + (n % 2); // 2 or 3
    return commonFeatures.slice(0, count);
  }, [item?.description, item?.name]);

  const category = item?.category || "General";
  const heroSrc = imgOk && item?.heroImage ? item.heroImage : FALLBACK_IMG;

  return (
    <div
      className={`group relative border border-slate-200 rounded-2xl bg-white overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${className}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ✅ HERO IMAGE HEADER */}
      <div className="relative h-44 sm:h-48">
        {/* Image */}
        <img
          src={heroSrc}
          alt={item?.name || "Service"}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
          onError={() => setImgOk(false)}
        />

        {/* Overlay gradients for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/10 via-transparent to-amber-500/10" />

        {/* Top badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium backdrop-blur-sm bg-white/75 ${getCategoryColor(
              category
            )}`}
          >
            {getCategoryIcon(category)}
            {category}
          </span>

          {!item?.active && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-red-100/90 text-red-700 text-xs font-semibold backdrop-blur-sm">
              Coming Soon
            </span>
          )}
        </div>

        {/* Featured badge */}
        {item?.featured && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-bold shadow-md">
              <Star className="w-3 h-3 fill-white" />
              Popular
            </span>
          </div>
        )}

        {/* Title + quick stats on image */}
        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-xl font-extrabold text-white leading-tight drop-shadow-sm">
            {item?.name}
          </h3>

          <div className="flex items-center gap-4 mt-2 text-white/90">
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <Zap className="w-4 h-4 text-amber-300" />
              <span>Fast Turnaround</span>
            </div>
            <div className="flex items-center gap-1 text-xs sm:text-sm">
              <CheckCircle className="w-4 h-4 text-green-300" />
              <span>Quality Guarantee</span>
            </div>
          </div>
        </div>

        {/* Hover Arrow indicator */}
        <div
          className={`absolute bottom-4 right-4 transition-transform duration-300 ${
            isHovered ? "translate-x-1" : ""
          }`}
        >
          <div className="p-2 rounded-xl bg-white/20 text-white backdrop-blur-sm border border-white/20">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>

        {/* If no image provided */}
        {!item?.heroImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/20 text-white backdrop-blur-sm border border-white/20">
              <ImageIcon className="w-4 h-4" />
              <span className="text-sm font-semibold">Add hero image</span>
            </div>
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="p-6">
        {/* Description */}
        {item?.description ? (
          <p className="text-sm text-slate-700 leading-relaxed mb-4 line-clamp-3">
            {item.description}
          </p>
        ) : (
          <p className="text-sm text-slate-500 leading-relaxed mb-4">
            Professional printing service with premium finishing and fast delivery.
          </p>
        )}

        {/* Features */}
        {features.length > 0 && (
          <div className="mb-6">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Key Features
            </div>
            <div className="space-y-1">
              {features.map((feature, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 text-sm text-slate-700"
                >
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {["Premium Finish", "Fast Delivery", "Customizable"].map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium"
            >
              <Tag className="w-3 h-3" />
              {tag}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          to="/quote"
          className="group/btn w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold hover:shadow-md hover:scale-[1.02] transition-all duration-300"
        >
          <span>Get Quote</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Hover border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-red-200 transition-colors duration-300 pointer-events-none" />

      {/* Shine effect */}
      <div
        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/0 to-transparent group-hover:via-white/15 transition-all duration-700 pointer-events-none"
        style={{ transform: isHovered ? "translateX(100%)" : "translateX(-100%)" }}
      />
    </div>
  );
}
