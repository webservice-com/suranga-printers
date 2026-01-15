import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ROOT_API } from "../api/adminHttp";

const PHONE = "0662285425";
const WHATSAPP = "94772285425";

export default function ServiceDetails() {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setErr("");
        setLoading(true);

        const res = await fetch(`${ROOT_API}/api/services/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data?.message || "Failed to load service");
        if (alive) setService(data);
      } catch (e) {
        if (alive) setErr(e?.message || "Failed to load service");
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => (alive = false);
  }, [id]);

  if (loading) return <div className="container-pad py-16">Loading...</div>;
  if (err) return <div className="container-pad py-16 text-red-600">{err}</div>;
  if (!service) return null;

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative h-[55vh] min-h-[360px] overflow-hidden">
        <img
          src={service.heroImage || "/images/service-placeholder.jpg"}
          alt={service.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 h-full flex items-end">
          <div className="container-pad pb-10">
            <Link to="/services" className="text-white/80 hover:text-white text-sm">
              ← Back to Services
            </Link>

            <h1 className="mt-3 text-4xl md:text-5xl font-extrabold text-white">
              {service.name}
            </h1>

            {service.description ? (
              <p className="mt-4 max-w-2xl text-white/85 leading-relaxed">
                {service.description}
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/quote"
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-600 text-white font-semibold"
              >
                Get a Quote
              </Link>

              <a
                href={`https://wa.me/${WHATSAPP}`}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-white/15 text-white font-semibold backdrop-blur border border-white/20"
              >
                WhatsApp Now
              </a>

              <a
                href={`tel:${PHONE}`}
                className="px-6 py-3 rounded-xl bg-white/15 text-white font-semibold backdrop-blur border border-white/20"
              >
                Call
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* BODY */}
      <section className="container-pad py-12">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold text-slate-900">Details</h2>
          <p className="mt-3 text-slate-700 leading-relaxed">
            Send size, quantity, paper type and finishing details — we’ll reply with pricing and timeline.
          </p>
        </div>
      </section>
    </div>
  );
}
