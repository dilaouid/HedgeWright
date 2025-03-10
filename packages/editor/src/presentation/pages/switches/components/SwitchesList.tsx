import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Info, ToggleLeft, ToggleRight, Save, Trash2 } from 'lucide-react';
import { Switch } from '@/application/state/project/switchesStore';

interface SwitchesListProps {
  switches: Switch[];
  totalSwitches: number;
  onUpdate: (
    id: string,
    data: { name: string; description: string; initialValue: boolean }
  ) => void;
  onDelete: (id: string) => void;
  onToggleValue: (id: string, currentValue: boolean) => void;
}

export function SwitchesList({
  switches,
  totalSwitches,
  onUpdate,
  onDelete,
  onToggleValue,
}: SwitchesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    initialValue: false,
  });

  const handleStartEditing = (switchItem: Switch) => {
    setEditForm({
      name: switchItem.name,
      description: switchItem.description,
      initialValue: switchItem.initialValue,
    });
    setEditingId(switchItem.id);
  };

  const handleUpdateSwitch = (id: string) => {
    onUpdate(id, editForm);
    setEditingId(null);
  };

  const handleDeleteRequest = (id: string) => {
    onDelete(id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="card-ace bg-blue-950 p-4"
    >
      <h2 className="text-xl font-ace text-white mb-4 tracking-wide shadow-text">
        SWITCHES ({switches.length})
      </h2>

      {switches.length === 0 ? (
        <div className="bg-blue-900/40 border border-blue-800 rounded-lg p-4 text-center">
          <Info className="h-8 w-8 mx-auto text-blue-400 mb-2" />
          <p className="text-blue-300">
            {totalSwitches === 0
              ? 'No switches found. Create your first switch using the form above.'
              : 'No switches match your current filters.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-blue-900/50 border-b border-blue-800">
              <tr>
                <th className="px-4 py-3 text-sm font-semibold text-blue-200">
                  ID
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-blue-200">
                  Name
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-blue-200">
                  Description
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-blue-200">
                  Value
                </th>
                <th className="px-4 py-3 text-sm font-semibold text-blue-200">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blue-900/70">
              {switches.map((switchItem) => (
                <tr
                  key={switchItem.id}
                  className="hover:bg-blue-900/20 transition-colors"
                >
                  <td className="px-4 py-3 text-blue-300 font-mono">
                    {switchItem.numericId}
                  </td>
                  <td className="px-4 py-3 text-white">
                    {editingId === switchItem.id ? (
                      <input
                        type="text"
                        value={editForm.name}
                        onChange={(e) =>
                          setEditForm({ ...editForm, name: e.target.value })
                        }
                        className="w-full bg-blue-900/50 border border-blue-800 rounded-lg px-3 py-1 text-white placeholder-blue-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    ) : (
                      switchItem.name
                    )}
                  </td>
                  <td className="px-4 py-3 text-blue-200">
                    {editingId === switchItem.id ? (
                      <input
                        type="text"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm({
                            ...editForm,
                            description: e.target.value,
                          })
                        }
                        className="w-full bg-blue-900/50 border border-blue-800 rounded-lg px-3 py-1 text-white placeholder-blue-400 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                      />
                    ) : (
                      switchItem.description || (
                        <span className="text-blue-500 italic">
                          No description
                        </span>
                      )
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {editingId === switchItem.id ? (
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            setEditForm({ ...editForm, initialValue: false })
                          }
                          className={`px-2 py-1 text-xs rounded-l-lg ${!editForm.initialValue ? 'bg-red-800 text-white' : 'bg-blue-900/70 text-blue-300'}`}
                        >
                          OFF
                        </button>
                        <button
                          onClick={() =>
                            setEditForm({ ...editForm, initialValue: true })
                          }
                          className={`px-2 py-1 text-xs rounded-r-lg ${editForm.initialValue ? 'bg-green-700 text-white' : 'bg-blue-900/70 text-blue-300'}`}
                        >
                          ON
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          onToggleValue(switchItem.id, switchItem.initialValue)
                        }
                        className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${
                          switchItem.initialValue
                            ? 'bg-green-700 text-white'
                            : 'bg-red-800 text-white'
                        }`}
                      >
                        {switchItem.initialValue ? (
                          <>
                            <ToggleRight className="h-4 w-4" />
                            ON
                          </>
                        ) : (
                          <>
                            <ToggleLeft className="h-4 w-4" />
                            OFF
                          </>
                        )}
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {editingId === switchItem.id ? (
                        <>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleUpdateSwitch(switchItem.id)}
                            className="p-1 bg-green-700 text-white rounded"
                          >
                            <Save className="h-4 w-4" />
                          </motion.button>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => setEditingId(null)}
                            className="p-1 bg-blue-700 text-white rounded"
                          >
                            Cancel
                          </motion.button>
                        </>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleStartEditing(switchItem)}
                          className="p-1 bg-blue-700 text-white rounded"
                        >
                          Edit
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRequest(switchItem.id)}
                        className="p-1 bg-red-700 text-white rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </motion.button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
