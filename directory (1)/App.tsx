
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PersonForm from './components/PersonForm';
import Directory from './components/Directory';
import Modal from './components/Modal';
import type { Person, Tag } from './types';
import { Avatar } from './components/PersonCard';

const TAGS: Tag[] = ['work', 'personal', 'outreach'];
const tagColorMap: Record<Tag, string> = {
    work: 'bg-blue-400/10 text-blue-300 ring-1 ring-inset ring-blue-400/20',
    personal: 'bg-green-400/10 text-green-300 ring-1 ring-inset ring-green-400/20',
    outreach: 'bg-amber-400/10 text-amber-300 ring-1 ring-inset ring-amber-400/20',
};


const App: React.FC = () => {
  const [people, setPeople] = useState<Person[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTags, setFilterTags] = useState<Tag[]>([]);

  useEffect(() => {
    try {
      const storedPeople = localStorage.getItem('directory');
      if (storedPeople) {
        setPeople(JSON.parse(storedPeople));
      }
    } catch (error) {
      console.error("Failed to parse people from localStorage", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('directory', JSON.stringify(people));
    } catch (error) {
      // FIX: Added curly braces around the catch block to fix syntax error.
      console.error("Failed to save people to localStorage", error);
    }
  }, [people]);

  const handleAddPerson = useCallback((name: string, fact: string, tags: Tag[]) => {
    const newPerson: Person = {
      id: crypto.randomUUID(),
      name,
      fact,
      tags,
    };
    setPeople((prevPeople) => [newPerson, ...prevPeople]);
  }, []);

  const handleSelectPerson = useCallback((person: Person) => {
    setSelectedPerson(person);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedPerson(null);
  }, []);

  const handleFilterTagToggle = (tag: Tag) => {
    setFilterTags((prevTags) =>
      prevTags.includes(tag)
        ? prevTags.filter((t) => t !== tag)
        : [...prevTags, tag]
    );
  };
  
  const filteredPeople = useMemo(() => {
    return people
      .filter((person) => {
        const query = searchQuery.toLowerCase().trim();
        if (!query) return true;
        return person.name.toLowerCase().includes(query) || person.fact.toLowerCase().includes(query);
      })
      .filter((person) => {
        if (filterTags.length === 0) return true;
        return filterTags.every(tag => person.tags?.includes(tag));
      });
  }, [people, searchQuery, filterTags]);


  return (
    <div className="min-h-screen text-white/90 font-sans">
      <main className="container mx-auto px-4 py-12 md:px-8 max-w-3xl">
        <header className="text-center mb-12">
            <h1 className="text-3xl font-semibold tracking-tight">
                Directory
            </h1>
        </header>
        
        <div className="mb-12">
            <PersonForm onAddPerson={handleAddPerson} />
        </div>
        
        <section className="my-12 space-y-6">
          <div className="relative">
             <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
               <svg className="h-5 w-5 text-white/40" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                 <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
               </svg>
             </div>
             <input
               type="search"
               id="search"
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               placeholder="Search..."
               className="w-full bg-white/5 backdrop-blur-sm border border-white/10 text-white placeholder:text-white/40 rounded-full pl-12 pr-5 py-3 focus:ring-2 focus:ring-white/50 focus:outline-none transition-all duration-300 shadow-lg shadow-black/20"
               aria-label="Search directory"
             />
          </div>
          <div className="flex justify-center flex-wrap gap-3">
             {TAGS.map((tag) => (
               <button
                 type="button"
                 key={tag}
                 onClick={() => handleFilterTagToggle(tag)}
                 aria-pressed={filterTags.includes(tag)}
                 className={`px-4 py-2 text-sm font-medium rounded-full transition-all duration-300 capitalize border ${
                   filterTags.includes(tag)
                     ? 'bg-white/10 text-white border-white/20'
                     : 'bg-transparent text-white/60 hover:text-white hover:bg-white/5 border-transparent'
                 }`}
               >
                 {tag}
               </button>
             ))}
             {filterTags.length > 0 && (
                 <button
                     onClick={() => setFilterTags([])}
                     className="px-4 py-2 text-sm font-medium rounded-full text-white/50 hover:text-white hover:bg-white/5 transition-colors"
                     aria-label="Clear filters"
                 >
                     Clear
                 </button>
             )}
          </div>
        </section>
        
        <Directory people={filteredPeople} onSelectPerson={handleSelectPerson} totalPeopleCount={people.length} />

        <Modal isOpen={!!selectedPerson} onClose={handleCloseModal}>
          {selectedPerson && (
            <div className="flex flex-col items-center text-center p-4">
              <Avatar name={selectedPerson.name} className="w-24 h-24 text-4xl" />
              <h2 className="text-3xl font-bold text-white mt-6">{selectedPerson.name}</h2>
               <div className="flex flex-wrap justify-center gap-2 my-4">
                {selectedPerson.tags?.map((tag) => (
                    <span key={tag} className={`px-3 py-1 text-xs font-semibold rounded-full capitalize ${tagColorMap[tag]}`}>
                        {tag}
                    </span>
                ))}
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">{selectedPerson.fact}</p>
            </div>
          )}
        </Modal>
      </main>
      <footer className="text-center py-6 text-white/40 text-sm">
        <p>Created by OJB</p>
      </footer>
    </div>
  );
};

export default App;
import React from 'react'
export default function App() {
  return <div>App is running</div>
}
