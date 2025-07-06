import React from 'react';
import NormativeCard from '../NormativeCard/NormativeCard';

const NormativeList = ({ normatives }) => {
    console.log("NORMATIVE ",normatives)
    return (
    <div class="max-w-[1200px] mx-auto px-4 py-8">
      <h2 class="text-2xl font-bold mb-6">Нормативы</h2>

      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {normatives.map(normative => (
          <NormativeCard key={normative.id} normative={normative} />
        ))}
      </div>
    </div>
  );
};

export default NormativeList;
