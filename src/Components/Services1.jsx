
import {
  FaBolt,
  FaWrench,
  FaShieldAlt,
  FaChartBar,
  FaDesktop,
  FaLightbulb,
  FaArrowRight,
} from "react-icons/fa";

const SERVICES = [
  {
    icon: FaBolt,
    title: "Power Supply",
    subtitle: "Reliable power",
    description:
      "Reliable and uninterrupted power supply solutions for efficient operations.",
  },
  {
    icon: FaWrench,
    title: "Maintenance",
    subtitle: "Expert support",
    description:
      "Professional maintenance services to keep electrical systems running smoothly.",
  },
  {
    icon: FaShieldAlt,
    title: "Safety",
    subtitle: "Safe operations",
    description:
      "Safety-focused practices designed to protect people, equipment and infrastructure.",
  },
  {
    icon: FaChartBar,
    title: "Substation",
    subtitle: "Management",
    description:
      "Efficient substation management for stable and dependable power distribution.",
  },
  {
    icon: FaDesktop,
    title: "Monitoring",
    subtitle: "& Control",
    description:
      "Modern monitoring and control solutions for better system visibility.",
  },
  {
    icon: FaLightbulb,
    title: "Technical",
    subtitle: "Support",
    description:
      "Dedicated technical assistance for electrical systems and operational needs.",
  },
];

export default function Services() {
  return (
    <section className="relative w-full overflow-hidden bg-slate-50 py-14 sm:py-16 md:py-20 lg:py-20 xl:py-28">
      
      {/* Background Decoration */}
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-100/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-yellow-100/40 blur-3xl" />

      <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 2xl:max-w-[1500px]">

        {/* ================= SECTION HEADER ================= */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12 md:mb-14 lg:mb-16">

          {/* Small Label */}
          <div className="mb-3 flex items-center justify-center gap-3 sm:mb-4">
            <span className="h-0.5 w-8 bg-yellow-400 sm:w-10" />

            <span className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-500 sm:text-sm">
              What We Provide
            </span>

            <span className="h-0.5 w-8 bg-yellow-400 sm:w-10" />
          </div>

          {/* Heading */}
          <h2 className="text-3xl font-extrabold leading-tight text-blue-950 sm:text-4xl md:text-5xl lg:text-[52px]">
            Our Services
          </h2>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-gray-500 sm:mt-5 sm:text-base sm:leading-7 md:text-lg">
            Reliable solutions for every need. From power supply to technical
            support, we cover every stage of your electrical infrastructure.
          </p>
        </div>

        {/* ================= SERVICES GRID ================= */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7 sm:px-15 xl:gap-8">

          {SERVICES.map(({ icon: Icon, title, subtitle, description }) => (
            <ServiceCard
              key={title}
              icon={Icon}
              title={title}
              subtitle={subtitle}
              description={description}
            />
          ))}

        </div>
      </div>
    </section>
  );
}


/* =========================================================
   SERVICE CARD
========================================================= */

function ServiceCard({
  icon: Icon,
  title,
  subtitle,
  description,
}) {
  return (
    <article
      className="
        group relative flex min-h-[280px] flex-col
        overflow-hidden rounded-2xl
        border border-blue-100
        bg-white
        p-6
        shadow-sm
        transition-all duration-300 ease-out

        hover:-translate-y-2
        hover:border-yellow-300
        hover:shadow-xl

        sm:p-7
        md:min-h-[290px]
        md:p-8
        lg:min-h-[300px]
        lg:p-8
        xl:min-h-[310px]
      "
    >

      {/* Top Accent */}
      <div
        className="
          absolute left-0 top-0
          h-1 w-0
          bg-yellow-400
          transition-all duration-500
          group-hover:w-full
        "
      />

      {/* ================= ICON ================= */}
      <div
        className="
          flex h-14 w-14 shrink-0 items-center justify-center
          rounded-xl
          bg-blue-50
          text-xl text-blue-700

          transition-all duration-300

          group-hover:bg-blue-900
          group-hover:text-yellow-400
          group-hover:shadow-lg

          sm:h-16 sm:w-16
          sm:text-2xl
        "
      >
        <Icon />
      </div>

      {/* ================= TITLE ================= */}
      <div className="mt-6">
        <h3
          className="
            text-xl font-bold leading-tight
            text-blue-950
            transition-colors duration-300
            group-hover:text-blue-800
            sm:text-[22px]
          "
        >
          {title}
        </h3>

        <p className="mt-1 text-sm font-medium text-yellow-500">
          {subtitle}
        </p>
      </div>

      {/* ================= DESCRIPTION ================= */}
      <p
        className="
          mt-4
          max-w-md
          text-sm
          leading-6
          text-gray-500
          sm:text-[15px]
          sm:leading-7
        "
      >
        {description}
      </p>

      {/* ================= LEARN MORE ================= */}
      <a
        href="#"
        className="
          mt-auto
          inline-flex
          w-fit
          items-center
          gap-2
          pt-6

          text-sm
          font-semibold
          text-blue-700

          transition-all
          duration-300

          group-hover:translate-x-1
        "
      >
        Learn more

        <FaArrowRight
          className="
            text-xs
            transition-transform
            duration-300
            group-hover:translate-x-1
          "
        />
      </a>

      {/* ================= BOTTOM DECORATION ================= */}
      <div
        className="
          absolute bottom-0 left-1/2
          h-1 w-0
          -translate-x-1/2
          rounded-full
          bg-yellow-400
          transition-all duration-500
          group-hover:w-20
        "
      />
    </article>
  );
}
