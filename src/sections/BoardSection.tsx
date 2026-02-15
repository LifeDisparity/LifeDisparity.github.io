const boardMembers = [
  { name: 'Alex Chen', role: 'President', image: '/board_01.jpg' },
  { name: 'Sarah Kim', role: 'VP Projects', image: '/board_02.jpg' },
  { name: 'Michael Park', role: 'VP Education', image: '/board_03.jpg' },
  { name: 'Emma Wilson', role: 'VP Outreach', image: '/board_04.jpg' },
  { name: 'David Liu', role: 'Treasurer', image: '/board_05.jpg' },
  { name: 'Rachel Green', role: 'Secretary', image: '/board_06.jpg' },
  { name: 'James Martinez', role: 'Tech Lead', image: '/board_07.jpg' },
  { name: 'Lisa Thompson', role: 'Events Coordinator', image: '/board_08.jpg' },
];

export default function BoardSection() {
  return (
    <section
      id="board"
      className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
    >
      <div className="w-full px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="micro-label text-secondary-light mb-4 block">
            Board
          </span>
          <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Meet the Board
          </h2>
          <p className="body-text text-secondary-light mt-4 max-w-xl">
            A small team focused on building things that work and helping others learn.
          </p>
        </div>

        {/* Board Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {boardMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <div className="photo-frame w-full aspect-square mb-4 overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
              <span className="font-display font-semibold text-primary-light text-center">
                {member.name}
              </span>
              <span className="micro-label text-accent-green mt-1">
                {member.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
