import React from 'react';
import { Link } from 'react-router-dom';
import jumpImg from '../../images/jump.jpg';


const NormativeCard = ({ normative }) => {
  return (
    <Link to={`/normatives/${normative.id}`} className="block no-underline text-inherit">
  <div style={{ backgroundImage: `url(${jumpImg})` }}
       className="bg-cover bg-black/40 bg-blend-darken rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,0,0,0.75)]">
    <div className="p-4">
      <h3 className="text-white text-lg font-semibold mb-2">{normative.name}</h3>
      <p className="text-white mb-2">{normative.type}</p>
      <div className="flex items-center text-white text-sm">
            <span>{normative.ageGroup}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NormativeCard;
