// src/Pages/AboutUs/Team/Team.jsx
import React from "react";

const Team = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Our Team & Partners</h2>
      <p className="text-gray-700">
        Behind every successful delivery is a team of passionate professionals
        working tirelessly to ensure your parcels reach their destination safely
        and on time.
      </p>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4">Leadership Team</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                <span className="text-xl">SF</span>
              </div>
            </div>
            <h4 className="font-semibold">Sakib Fahim</h4>
            <p className="text-gray-600">CEO & Founder</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                <span className="text-xl">SF</span>
              </div>
            </div>
            <h4 className="font-semibold">Sakib Fahim</h4>
            <p className="text-gray-600">CTO</p>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg text-center">
            <div className="avatar placeholder mb-4">
              <div className="bg-neutral-focus text-neutral-content rounded-full w-16">
                <span className="text-xl">SF</span>
              </div>
            </div>
            <h4 className="font-semibold">Sakib Fahim</h4>
            <p className="text-gray-600">Operations Manager</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Our Technology Partners</h3>
        <div className="flex flex-wrap gap-4">
          <div className="badge badge-lg badge-outline">Firebase</div>
          <div className="badge badge-lg badge-outline">MongoDB</div>
          <div className="badge badge-lg badge-outline">Stripe</div>
          <div className="badge badge-lg badge-outline">React</div>
          <div className="badge badge-lg badge-outline">Node.js</div>
        </div>
      </div>
    </div>
  );
};

export default Team;
