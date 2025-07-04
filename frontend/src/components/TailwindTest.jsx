import React from 'react';

const TailwindTest = () => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
      <div className="md:flex">
        <div className="md:shrink-0">
          <div className="h-48 w-full bg-gradient-to-r from-blue-400 to-purple-500 md:h-full md:w-48 flex items-center justify-center">
            <span className="text-white text-4xl">🎨</span>
          </div>
        </div>
        <div className="p-8">
          <div className="uppercase tracking-wide text-sm text-indigo-500 font-semibold">Test Tailwind CSS</div>
          <h2 className="block mt-1 text-lg leading-tight font-medium text-black">
            Tailwind CSS est actif !
          </h2>
          <p className="mt-2 text-slate-500">
            Ce composant utilise les classes Tailwind CSS pour le styling. Si vous voyez des couleurs et une mise en forme moderne, c'est que Tailwind fonctionne correctement.
          </p>
          <div className="mt-4 space-x-2">
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              Bouton Bleu
            </button>
            <button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
              Bouton Vert
            </button>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
              Bouton Rouge
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TailwindTest;
