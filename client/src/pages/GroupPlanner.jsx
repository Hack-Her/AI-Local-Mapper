import React, { useState } from 'react';
import { Users, MapPin, Plus, Trash2, Sparkles, CheckCircle2, Car, DollarSign } from 'lucide-react';
import API from '../api/axios';
import PlaceCard from '../components/PlaceCard';
import PlaceDetails from '../components/PlaceDetails';
import Loading from '../components/Loading';

const GroupPlanner = () => {
  const [members, setMembers] = useState([
    { name: 'Alex (North Zone)', latitude: 21.1550, longitude: 79.0882 },
    { name: 'Sarah (East Zone)', latitude: 21.1458, longitude: 79.0980 },
    { name: 'David (South Zone)', latitude: 21.1350, longitude: 79.0780 }
  ]);
  const [newName, setNewName] = useState('');
  const [query, setQuery] = useState('Find an affordable restaurant for 6 friends with parking');
  const [budgetPerPerson, setBudgetPerPerson] = useState('500');
  const [occasion, setOccasion] = useState('Casual Get Together');
  const [needParking, setNeedParking] = useState(true);
  const [loading, setLoading] = useState(false);
  const [groupResults, setGroupResults] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const addMember = () => {
    if (!newName.trim()) return;
    setMembers([
      ...members,
      {
        name: newName,
        latitude: 21.1400 + (Math.random() - 0.5) * 0.03,
        longitude: 79.0800 + (Math.random() - 0.5) * 0.03
      }
    ]);
    setNewName('');
  };

  const removeMember = (index) => {
    setMembers(members.filter((_, idx) => idx !== index));
  };

  const handleCalculate = async () => {
    if (members.length === 0) return;
    setLoading(true);

    try {
      const res = await API.post('/group/search', {
        members,
        query: `${query}. Budget around ₹${budgetPerPerson} per person. Occasion: ${occasion}. ${needParking ? 'Parking required.' : ''}`
      });

      if (res.data.success) {
        setGroupResults(res.data);
      }
    } catch (err) {
      console.error('Group calculation error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 py-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
          <Users className="w-3.5 h-3.5" />
          <span>Fair Meeting Area Calculator</span>
        </div>
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Find the Perfect Place for Everyone</h1>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Enter your friends' locations. AI will calculate a fair central meeting area that minimizes average travel distance for all members.
        </p>
      </div>

      {/* Member Locations & Group Requirements Input */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-5 bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-gray-900 dark:text-white">1. Group Member Locations ({members.length})</h3>

          <div className="flex space-x-2">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Friend's Name / Area"
              className="flex-1 p-2.5 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
            />
            <button
              onClick={addMember}
              className="px-3 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-2 max-h-40 overflow-y-auto">
            {members.map((m, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-xs">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="font-semibold text-gray-800 dark:text-gray-200">{m.name}</span>
                </div>
                <button
                  onClick={() => removeMember(idx)}
                  className="text-gray-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 dark:border-gray-700 pt-4 space-y-3">
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">2. Group Preferences</h3>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Occasion / Activity</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
              >
                <option value="Casual Get Together">Casual Get Together</option>
                <option value="Birthday Dinner">Birthday Dinner</option>
                <option value="Work Team Outing">Work Team Outing</option>
                <option value="Coffee & Catchup">Coffee & Catchup</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">Budget / Person (₹)</label>
                <input
                  type="number"
                  value={budgetPerPerson}
                  onChange={(e) => setBudgetPerPerson(e.target.value)}
                  className="w-full p-2 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-xs"
                />
              </div>
              <div className="flex items-end">
                <label className="flex items-center space-x-2 p-2 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 w-full cursor-pointer">
                  <input
                    type="checkbox"
                    checked={needParking}
                    onChange={(e) => setNeedParking(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <Car className="w-3.5 h-3.5 text-indigo-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Parking</span>
                </label>
              </div>
            </div>

            <button
              onClick={handleCalculate}
              disabled={loading || members.length === 0}
              className="w-full mt-2 py-3 text-xs font-bold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Find Central Meeting Places</span>
            </button>
          </div>
        </div>

        {/* Results Panel */}
        <div className="md:col-span-7 space-y-4">
          {loading ? (
            <Loading message="Calculating central geographic midpoint & scanning places..." />
          ) : groupResults ? (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-2">
                <div className="flex items-center space-x-2 font-bold text-sm text-indigo-900 dark:text-indigo-200">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span>Best Central Meeting Area</span>
                </div>
                <p className="text-xs text-indigo-700 dark:text-indigo-300">
                  {groupResults.explanation}
                </p>
              </div>

              <div className="space-y-3">
                {groupResults.places.map((place) => (
                  <div key={place.id} onClick={() => setSelectedPlace(place)}>
                    <PlaceCard place={place} />
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-12 bg-white dark:bg-gray-800 rounded-3xl border border-gray-200 dark:border-gray-700 text-center space-y-3">
              <Users className="w-12 h-12 text-indigo-400 opacity-60" />
              <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Ready to plan a group outing?</h4>
              <p className="text-xs text-gray-400 max-w-sm">
                Add 2 or more friends with their locations, select budget & parking preferences, then click "Find Central Meeting Places".
              </p>
            </div>
          )}
        </div>
      </div>

      {selectedPlace && (
        <PlaceDetails
          place={selectedPlace}
          onClose={() => setSelectedPlace(null)}
        />
      )}
    </div>
  );
};

export default GroupPlanner;
