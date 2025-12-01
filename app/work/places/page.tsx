import { MapPin } from "lucide-react";

export default function PlacesPage() {
  const places = [
    { name: "Unilag", desc: "Youth Seminar 2024" },
    { name: "Yaba", desc: "Community Health Drive" },
    { name: "Iwaya", desc: "Clean Water Project" },
    { name: "Ikotun", desc: "School Renovation" },
  ];

  return (
    <div className="container py-24">
      <h1 className="text-4xl font-bold text-center text-blue-950 mb-12">
        Where We Work
      </h1>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {places.map((place) => (
          <div
            key={place.name}
            className="flex items-start gap-4 p-6 bg-white border rounded-xl shadow-sm hover:border-blue-200 transition-colors"
          >
            <div className="bg-blue-100 p-3 rounded-full text-blue-600">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">{place.name}</h3>
              <p className="text-slate-500">{place.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
