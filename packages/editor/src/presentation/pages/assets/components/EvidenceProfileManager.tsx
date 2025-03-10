import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  FileBadge,
  User,
  Trash2,
  Edit,
  Eye,
  Check,
  X,
  FileCheck,
  Briefcase,
  UserPlus
} from 'lucide-react';
import {
  useProjectStore,
  Asset,
} from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/presentation/components/ui/dialog';
import { nanoid } from 'nanoid';

// Define types for evidence and profile
interface Evidence {
  id: string;
  name: string;
  description: string;
  imageAssetId: string;
  detailImageAssetId?: string;
  type: string;
  isInitiallyHidden: boolean;
  itemType?: 'evidence' | 'profile';
}

interface Profile {
  id: string;
  name: string;
  age: string;
  gender: string;
  description: string;
  imageAssetId: string;
  isInitiallyHidden: boolean;
  itemType?: 'evidence' | 'profile';
}

export function EvidenceProfileManager() {
  const { currentProject, updateProject } = useProjectStore();
  const [activeTab, setActiveTab] = useState('evidence');
  const [searchTerm, setSearchTerm] = useState('');
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [profileItems, setProfileItems] = useState<Profile[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<Evidence | Profile | null>(
    null
  );
  const [previewItem, setPreviewItem] = useState<Evidence | Profile | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  // Extract evidence and profiles from project data
  useEffect(() => {
    if (currentProject) {
      // Extract evidence items
      const evidence: Evidence[] = [];
      currentProject.evidence.forEach((evidenceId) => {
        const evidenceAsset = currentProject.assets.find(
          (a) => a.id === evidenceId
        );
        if (evidenceAsset) {
          evidence.push({
            id: evidenceAsset.id,
            name: evidenceAsset.name,
            description: (evidenceAsset.metadata?.description as string) || '',
            imageAssetId: evidenceAsset.id,
            detailImageAssetId:
              (evidenceAsset.metadata?.detailImageId as string) || undefined,
            type: (evidenceAsset.metadata?.type as string) || 'Document',
            isInitiallyHidden:
              (evidenceAsset.metadata?.isInitiallyHidden as boolean) || false,
          });
        }
      });

      // Extract profile items
      const profiles: Profile[] = [];
      currentProject.profiles.forEach((profileId) => {
        const profileAsset = currentProject.assets.find(
          (a) => a.id === profileId
        );
        if (profileAsset) {
          profiles.push({
            id: profileAsset.id,
            name: profileAsset.name,
            age: (profileAsset.metadata?.age as string) || 'Unknown',
            gender: (profileAsset.metadata?.gender as string) || 'Unknown',
            description: (profileAsset.metadata?.description as string) || '',
            imageAssetId: profileAsset.id,
            isInitiallyHidden:
              (profileAsset.metadata?.isInitiallyHidden as boolean) || false,
          });
        }
      });

      setEvidenceItems(evidence);
      setProfileItems(profiles);
      setIsLoading(false);
    }
  }, [currentProject]);

  // Filter items by search term
  const filteredEvidence = evidenceItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProfiles = profileItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.age.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.gender.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete item
  const deleteItem = (id: string, type: 'evidence' | 'profile') => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`)) {
      updateProject((draft) => {
        if (type === 'evidence') {
          const index = draft.evidence.indexOf(id);
          if (index !== -1) {
            draft.evidence.splice(index, 1);
          }
        } else {
          const index = draft.profiles.indexOf(id);
          if (index !== -1) {
            draft.profiles.splice(index, 1);
          }
        }

        // If we also want to delete the asset itself:
        // const assetIndex = draft.assets.findIndex(a => a.id === id);
        // if (assetIndex !== -1) {
        //   draft.assets.splice(assetIndex, 1);
        // }
      });
    }
  };

  // Open add modal
  const openAddModal = () => {
    setEditingItem(null);
    setIsAddModalOpen(true);
  };

  // Open edit modal
  const openEditModal = (
    item: Evidence | Profile,
    type: 'evidence' | 'profile'
  ) => {
    setEditingItem({ ...item, itemType: type });
    setIsEditModalOpen(true);
  };

  // Add/save evidence/profile
  const saveItem = () => {
    if (!editingItem) return;

    const isEvidence = 'type' in editingItem;
    const isNew = !currentProject?.assets.find((a) => a.id === editingItem.id);

    updateProject((draft) => {
      // If new item, create asset entry
      if (isNew) {
        const newId = nanoid();
        editingItem.id = newId;

        const newAsset: Asset = {
          id: newId,
          name: editingItem.name,
          type: 'png', // Assuming it's an image
          path: '', // This should be set by actual file upload
          category: isEvidence ? 'evidence' : 'profile',
        };

        draft.assets.push(newAsset);

        // Add to evidence/profile array
        if (isEvidence) {
          draft.evidence.push(newId);
        } else {
          draft.profiles.push(newId);
        }
      }

      // Update asset
      const assetIndex = draft.assets.findIndex((a) => a.id === editingItem.id);
      if (assetIndex !== -1) {
        draft.assets[assetIndex].name = editingItem.name;

        // Update metadata
        if (!draft.assets[assetIndex].metadata) {
          draft.assets[assetIndex].metadata = {};
        }

        if (isEvidence) {
          const evidence = editingItem as Evidence;
          draft.assets[assetIndex].metadata.description = evidence.description;
          draft.assets[assetIndex].metadata.type = evidence.type;
          draft.assets[assetIndex].metadata.isInitiallyHidden =
            evidence.isInitiallyHidden;

          if (evidence.detailImageAssetId) {
            draft.assets[assetIndex].metadata.detailImageId =
              evidence.detailImageAssetId;
          }
        } else {
          const profile = editingItem as Profile;
          draft.assets[assetIndex].metadata.description = profile.description;
          draft.assets[assetIndex].metadata.age = profile.age;
          draft.assets[assetIndex].metadata.gender = profile.gender;
          draft.assets[assetIndex].metadata.isInitiallyHidden =
            profile.isInitiallyHidden;
        }
      }
    });

    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setEditingItem(null);
  };

  // Preview an item
  const openPreviewItem = (
    item: Evidence | Profile,
    type: 'evidence' | 'profile'
  ) => {
    setPreviewItem({ ...item, itemType: type });
  };

  // Get asset path from id
  const getAssetPath = (assetId: string) => {
    const asset = currentProject?.assets.find((a) => a.id === assetId);
    return asset?.path || '';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Tab controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-blue-900/30 p-4 rounded-lg">
        <Tabs
          defaultValue="evidence"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 w-full">
            <TabsList className="bg-blue-900/50">
              <TabsTrigger
                value="evidence"
                className="data-[state=active]:bg-blue-700 flex items-center gap-1"
              >
                <FileBadge className="w-4 h-4" />
                Evidence
                <span className="ml-1 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                  {evidenceItems.length}
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="profiles"
                className="data-[state=active]:bg-blue-700 flex items-center gap-1"
              >
                <User className="w-4 h-4" />
                Profiles
                <span className="ml-1 bg-blue-800 text-xs px-1.5 py-0.5 rounded-md">
                  {profileItems.length}
                </span>
              </TabsTrigger>
            </TabsList>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-blue-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder={`Search ${activeTab}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 bg-blue-900/20 border-blue-700 text-white w-full"
                />
              </div>

              <Button
                variant="outline"
                className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700 flex items-center gap-1"
                onClick={openAddModal}
              >
                {activeTab === 'evidence' ? (
                  <>
                    <Briefcase className="h-4 w-4" />
                    Add Evidence
                  </>
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" />
                    Add Profile
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Evidence Tab Content */}
          <TabsContent value="evidence" className="mt-4">
            {filteredEvidence.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredEvidence.map((evidence) => (
                  <Card
                    key={evidence.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-square bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={getAssetPath(evidence.imageAssetId)}
                        alt={evidence.name}
                        className="max-w-full max-h-full object-contain"
                      />

                      {evidence.isInitiallyHidden && (
                        <div className="absolute top-2 left-2 bg-red-900/80 text-xs px-2 py-1 rounded text-red-200">
                          Initially Hidden
                        </div>
                      )}

                      <div className="absolute top-2 right-2 bg-blue-900/80 text-xs px-2 py-1 rounded text-blue-200">
                        {evidence.type}
                      </div>

                      {/* Preview button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-2 right-2 h-8 w-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white"
                        onClick={() => openPreviewItem(evidence, 'evidence')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium truncate">
                          {evidence.name}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-400 hover:text-blue-300"
                            onClick={() => openEditModal(evidence, 'evidence')}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-300"
                            onClick={() => deleteItem(evidence.id, 'evidence')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      {evidence.description && (
                        <p className="text-xs text-blue-300 mt-1 line-clamp-3 flex-1">
                          {evidence.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <p className="text-blue-300 mb-2">No evidence found</p>
                <p className="text-blue-400 text-sm mb-4">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add evidence items using the button above'}
                </p>
                <Button
                  variant="outline"
                  className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700"
                  onClick={openAddModal}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  Add Your First Evidence
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Profiles Tab Content */}
          <TabsContent value="profiles" className="mt-4">
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProfiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col"
                  >
                    <div className="relative aspect-square bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={getAssetPath(profile.imageAssetId)}
                        alt={profile.name}
                        className="max-w-full max-h-full object-contain"
                      />

                      {profile.isInitiallyHidden && (
                        <div className="absolute top-2 left-2 bg-red-900/80 text-xs px-2 py-1 rounded text-red-200">
                          Initially Hidden
                        </div>
                      )}

                      {/* Preview button */}
                      <Button
                        variant="outline"
                        size="icon"
                        className="absolute bottom-2 right-2 h-8 w-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white"
                        onClick={() => openPreviewItem(profile, 'profile')}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>

                    <div className="p-3 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <h4 className="text-white font-medium truncate">
                          {profile.name}
                        </h4>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-blue-400 hover:text-blue-300"
                            onClick={() => openEditModal(profile, 'profile')}
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-400 hover:text-red-300"
                            onClick={() => deleteItem(profile.id, 'profile')}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>

                      <div className="text-xs text-blue-400 mt-1 flex flex-wrap gap-x-3 gap-y-1">
                        <span>Age: {profile.age}</span>
                        <span>Gender: {profile.gender}</span>
                      </div>

                      {profile.description && (
                        <p className="text-xs text-blue-300 mt-1 line-clamp-3 flex-1">
                          {profile.description}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <p className="text-blue-300 mb-2">No profiles found</p>
                <p className="text-blue-400 text-sm mb-4">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add character profiles using the button above'}
                </p>
                <Button
                  variant="outline"
                  className="bg-blue-800 border-blue-700 text-white hover:bg-blue-700"
                  onClick={openAddModal}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Your First Profile
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Item Preview Modal */}
      {previewItem && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-blue-950/90 flex items-center justify-center p-4"
          onClick={() => setPreviewItem(null)}
        >
          <div
            className="relative bg-blue-900/30 p-1 rounded-lg border-2 border-blue-700 max-w-2xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="absolute top-3 right-3 z-10 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 bg-blue-950/90 border-blue-800 text-blue-300 hover:bg-blue-900 hover:text-white flex items-center gap-1"
                onClick={() => {
                  setPreviewItem(null);
                  openEditModal(
                    previewItem,
                    'type' in previewItem ? 'evidence' : 'profile'
                  );
                }}
              >
                <Edit className="h-3.5 w-3.5" />
                Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-8 w-8 bg-blue-950/90 border-blue-800 text-red-400 hover:bg-red-900/30 hover:text-red-300"
                onClick={() => setPreviewItem(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="max-h-[calc(90vh-2rem)] overflow-auto flex flex-col md:flex-row">
              <div className="md:w-1/2 p-4 flex items-center justify-center bg-black/20">
                <img
                  src={getAssetPath(previewItem.imageAssetId)}
                  alt={previewItem.name}
                  className="max-w-full max-h-[300px] object-contain"
                />
              </div>

              <div className="md:w-1/2 p-4">
                <h3 className="text-xl font-ace text-white mb-1">
                  {previewItem.name}
                </h3>

                {'type' in previewItem ? (
                  // Evidence
                  <>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-blue-900 text-xs px-2 py-1 rounded text-blue-200">
                        {previewItem.type}
                      </span>
                      {previewItem.isInitiallyHidden && (
                        <span className="bg-red-900 text-xs px-2 py-1 rounded text-red-200">
                          Initially Hidden
                        </span>
                      )}
                    </div>

                    <p className="text-blue-200 text-sm mb-4">
                      {previewItem.description || 'No description provided.'}
                    </p>

                    {previewItem.detailImageAssetId && (
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-blue-300 mb-2">
                          Detailed View
                        </h4>
                        <div className="bg-black/20 p-2 rounded-md">
                          <img
                            src={getAssetPath(previewItem.detailImageAssetId)}
                            alt={`Detail of ${previewItem.name}`}
                            className="max-w-full object-contain"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  // Profile
                  <>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-blue-300 mb-3">
                      <span>Age: {previewItem.age}</span>
                      <span>Gender: {previewItem.gender}</span>
                      {previewItem.isInitiallyHidden && (
                        <span className="bg-red-900 text-xs px-2 py-1 rounded text-red-200">
                          Initially Hidden
                        </span>
                      )}
                    </div>

                    <p className="text-blue-200 text-sm">
                      {previewItem.description || 'No description provided.'}
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Dialog
        open={isAddModalOpen || isEditModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
            setEditingItem(null);
          }
        }}
      >
        <DialogContent className="bg-blue-950 border-2 border-blue-800 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-ace text-yellow-400">
              {isAddModalOpen
                ? activeTab === 'evidence'
                  ? 'ADD NEW EVIDENCE'
                  : 'ADD NEW PROFILE'
                : 'type' in (editingItem || {})
                  ? 'EDIT EVIDENCE'
                  : 'EDIT PROFILE'}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 pt-2">
            {/* Common fields */}
            <div>
              <label className="text-blue-200 mb-2 block text-sm">Name</label>
              <Input
                value={editingItem?.name || ''}
                onChange={(e) =>
                  setEditingItem((prev) =>
                    prev ? { ...prev, name: e.target.value } : null
                  )
                }
                className="bg-blue-900/30 border-blue-700 text-white"
                placeholder={
                  activeTab === 'evidence'
                    ? 'e.g., Autopsy Report'
                    : 'e.g., Phoenix Wright'
                }
              />
            </div>

            {/* Evidence-specific fields */}
            {(activeTab === 'evidence' || 'type' in (editingItem || {})) && (
              <>
                <div>
                  <label className="text-blue-200 mb-2 block text-sm">
                    Evidence Type
                  </label>
                  <select
                    value={(editingItem as Evidence)?.type || 'Document'}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev
                          ? ({ ...prev, type: e.target.value } as Evidence)
                          : null
                      )
                    }
                    className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                  />
                  <option value="Document">Document</option>
                  <option value="Weapon">Weapon</option>
                  <option value="Photo">Photo</option>
                  <option value="Item">Item</option>
                  <option value="Badge">Badge</option>
                  <option value="Other">Other</option>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="evidence-hidden"
                    checked={
                      (editingItem as Evidence)?.isInitiallyHidden || false
                    }
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev
                          ? ({
                              ...prev,
                              isInitiallyHidden: e.target.checked,
                            } as Evidence)
                          : null
                      )
                    }
                    className="form-checkbox bg-blue-900 border-blue-700 text-yellow-500 rounded"
                  />
                  <label
                    htmlFor="evidence-hidden"
                    className="text-blue-200 text-sm"
                  >
                    Initially Hidden (only revealed when unlocked in-game)
                  </label>
                </div>

                {/* Asset selection would go here - in a real implementation, you'd
                    have asset picker functionality to select images */}
                <div className="rounded-md border border-blue-800 p-3 bg-blue-900/20">
                  <p className="text-sm text-blue-300 mb-2">
                    <FileCheck className="h-4 w-4 inline-block mr-1" />
                    Evidence image assets can be managed via the Import Assets
                    button at the top of the page
                  </p>
                </div>
              </>
            )}

            {/* Profile-specific fields */}
            {(activeTab === 'profiles' ||
              (!('type' in (editingItem || {})) && editingItem)) && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-blue-200 mb-2 block text-sm">
                      Age
                    </label>
                    <Input
                      value={(editingItem as Profile)?.age || ''}
                      onChange={(e) =>
                        setEditingItem((prev) =>
                          prev
                            ? ({ ...prev, age: e.target.value } as Profile)
                            : null
                        )
                      }
                      className="bg-blue-900/30 border-blue-700 text-white"
                      placeholder="e.g., 24"
                    />
                  </div>
                  <div>
                    <label className="text-blue-200 mb-2 block text-sm">
                      Gender
                    </label>
                    <select
                      value={(editingItem as Profile)?.gender || 'Male'}
                      onChange={(e) =>
                        setEditingItem((prev) =>
                          prev
                            ? ({ ...prev, gender: e.target.value } as Profile)
                            : null
                        )
                      }
                      className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Unknown">Unknown</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-blue-200 mb-2 block text-sm">
                    Description/Biography
                  </label>
                  <textarea
                    value={(editingItem as Profile)?.description || ''}
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev
                          ? ({
                              ...prev,
                              description: e.target.value,
                            } as Profile)
                          : null
                      )
                    }
                    rows={3}
                    className="w-full bg-blue-900/30 border border-blue-700 rounded-md p-2 text-white"
                    placeholder="Brief biography of the character"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="profile-hidden"
                    checked={
                      (editingItem as Profile)?.isInitiallyHidden || false
                    }
                    onChange={(e) =>
                      setEditingItem((prev) =>
                        prev
                          ? ({
                              ...prev,
                              isInitiallyHidden: e.target.checked,
                            } as Profile)
                          : null
                      )
                    }
                    className="form-checkbox bg-blue-900 border-blue-700 text-yellow-500 rounded"
                  />
                  <label
                    htmlFor="profile-hidden"
                    className="text-blue-200 text-sm"
                  >
                    Initially Hidden (only revealed when unlocked in-game)
                  </label>
                </div>

                {/* Asset selection would go here */}
                <div className="rounded-md border border-blue-800 p-3 bg-blue-900/20">
                  <p className="text-sm text-blue-300 mb-2">
                    <FileCheck className="h-4 w-4 inline-block mr-1" />
                    Profile image assets can be managed via the Import Assets
                    button at the top of the page
                  </p>
                </div>
              </>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                variant="ghost"
                className="text-blue-300 hover:text-blue-100"
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingItem(null);
                }}
              >
                Cancel
              </Button>
              <Button
                className="bg-yellow-600 text-white hover:bg-yellow-500 flex items-center gap-1"
                onClick={saveItem}
                disabled={!editingItem?.name}
              >
                <Check className="h-4 w-4" />
                {isAddModalOpen ? 'Add' : 'Save Changes'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
