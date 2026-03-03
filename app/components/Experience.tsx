export default function Experience() {
  return (
    <section
      id="experience"
      className="min-h-screen px-6 md:px-16 py-24 flex flex-col justify-center"
    >
      <h2 className="text-4xl md:text-5xl font-bold text-[#4A9B7F] mb-16">
        Experience
      </h2>

      <div className="border-l-2 border-[#4A9B7F] pl-8 space-y-12">
        <div>
          <h3 className="text-2xl font-semibold text-[#C4CDB8]">
            Self-Taught Developer
          </h3>
          <p className="text-[#9DB89A] text-sm mb-2">2022 - Present</p>
          <p className="text-[#9DB89A]">
            Building interactive web experiences, game prototypes,
            and UI animation systems using modern frameworks.
          </p>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-[#C4CDB8]">
            Game Development Projects
          </h3>
          <p className="text-[#9DB89A] text-sm mb-2">Ongoing</p>
          <p className="text-[#9DB89A]">
            Developed multiple 2D and 3D gameplay systems
            with physics, UI systems and modular architecture.
          </p>
        </div>
      </div>
    </section>
  );
}