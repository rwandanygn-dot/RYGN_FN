import { TeamMemberCard } from './team-member-card';

export function LeadershipGrid() {
  const leaders = [
    {
      name: 'Francois Regis Hirwa',
      title: 'President',
      image: '/images/regis.png',
      linkedin: 'https://www.linkedin.com/in/francois-regis-hirwa/',
    },
    {
      name: 'Uwase Ange Fravienne',
      title: 'Vice President',
      image: '/images/ange.jpeg',
      linkedin: 'https://rw.linkedin.com/in/uwase-ange-fravienne-22917338b',
    },
    {
      name: 'Abraham Rutunda',
      title: 'General Secretary',
      image: '/images/rutunda.jpg',
      linkedin: 'https://www.linkedin.com/in/abraham-rutunda-b32342253/',
    },
    {
      name: 'Manzi      Clement',
      title: 'Senior Treasurer',
      image: '/images/clement.jpg',
      linkedin: 'https://www.linkedin.com/in/manzi-clement/',
    },
    {
      name: 'Dr Christian Kwisanga',
      title: 'Advisor',
      image: '/images/christian.jpg',
      linkedin: 'https://www.linkedin.com/in/chris-kwisanga-51604a187/',
    },
    {
      name: 'Niyomukiza Joseph',
      title: 'Strategic Partnerships Advisor',
      image: '/images/joseph.png',
      linkedin: 'https://www.linkedin.com/in/niyomukiza-joseph-7a681a226/',
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#1a3a52] mb-2">
            OUR LEADERSHIP
          </h2>
          <p className="text-gray-600 text-lg">
            Passionate young leaders driving the nuclear agenda forward.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {leaders.map((leader) => (
            <TeamMemberCard
              key={leader.linkedin}
              name={leader.name}
              title={leader.title}
              image={leader.image}
              linkedin={leader.linkedin}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
