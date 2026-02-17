const leadershipMembers = [
  { name: 'Arthur Faynin', role: 'President', image: '/board_01.jpg' },
  { name: 'Alfred Leong', role: 'Vice-President', image: '/board_02.jpg' },
  { name: 'Alexi Tilly', role: 'Treasurer', image: '/board_03.jpg' },
  { name: 'Abie Lent', role: 'Secretary', image: '/board_04.jpg' },
  { name: 'Daniel Shmir', role: 'Data Officer', image: '/board_05.jpg' },
  { name: 'Kateryna Chevplianska', role: 'Data Officer', image: '/board_06.jpg' },
  { name: 'Mei Lin Pan', role: 'Marketing Officer', image: '/board_07.jpg' },
  { name: 'Dmytro Popov', role: 'Events Officer', image: '/board_08.jpg' },
];

export default function LeadershipSection() {
  return (
    <section
      id="leadership"
      className="min-h-screen bg-primary-dark relative flex items-center py-[12vh]"
    >
      <div className="w-full px-[6vw]">
        {/* Header */}
        <div className="mb-12">
          <span className="micro-label text-secondary-light mb-4 block">
            Leadership
          </span>
          <h2 className="headline-lg text-primary-light" style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)' }}>
            Meet the Leadership
          </h2>
          <p className="body-text text-secondary-light mt-4 max-w-xl">
            A team committed to excellence, innovation, and member success.
          </p>
        </div>

        {/* Leadership Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {leadershipMembers.map((member, index) => (
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
