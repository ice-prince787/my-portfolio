export default function Contact() {
  return (
    <section
      id="contact"
      className="min-h-screen px-6 md:px-16 py-24 flex flex-col justify-center items-start"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-[#4A9B7F] mb-8">
        Contact
      </h2>

      <p className="text-[#9DB89A] mb-10 max-w-xl">
        I'm open to collaborations, internships, or just talking about
        creative projects and development ideas.
      </p>

      <a
        href="mailto:your@email.com"
        className="px-8 py-3 bg-[#4A9B7F] text-[#241E21] rounded-full font-semibold hover:bg-[#2D4F47] transition"
      >
        Say Hello
      </a>
    </section>
  );
}