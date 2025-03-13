/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useMemo } from 'react';
import { Search, FileBadge, User, FileCheck } from 'lucide-react';
import { useProjectStore } from '@/application/state/project/projectStore';
import { Button } from '@/presentation/components/ui/button';
import { Input } from '@/presentation/components/ui/input';
import { Card } from '@/presentation/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/presentation/components/ui/tabs';
import { nanoid } from 'nanoid';
import path from 'path-browserify';
import { useAssetManager } from '@/application/hooks/assets/useAssetManager';
import AssetPathDisplay from './AssetPathDisplay';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/presentation/components/ui/tooltip';

// Define types for evidence and profile
interface Evidence {
  id: string;
  name: string;
  description: string;
  imageAssetPath: string; // Relative path to the image
  detailImagePath?: string; // Relative path to the detail image
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
  imageAssetPath: string;
  isInitiallyHidden: boolean;
  itemType?: 'evidence' | 'profile';
}

export function EvidenceProfileManager() {
  const { currentProject, updateProject } = useProjectStore();
  const {
    assets,
    resolveAssetPath,
    loading: assetsLoading,
  } = useAssetManager();

  const [activeTab, setActiveTab] = useState('evidence');
  const [searchTerm, setSearchTerm] = useState('');
  const [evidenceItems, setEvidenceItems] = useState<Evidence[]>([]);
  const [profileItems, setProfileItems] = useState<Profile[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load evidence and profile items from assets
  useEffect(() => {
    if (currentProject && assets.length > 0) {
      setIsLoading(true);
      console.log('Loading evidence and profile items from project assets');

      // Get evidence assets
      const evidenceAssets = assets.filter(
        (asset) =>
          asset.metadata?.category === 'evidence' ||
          asset.relativePath.includes('/evidences/')
      );
      console.log(`Found ${evidenceAssets.length} evidence assets`);

      // Get profile assets
      const profileAssets = assets.filter(
        (asset) =>
          asset.metadata?.category === 'profile' ||
          asset.relativePath.includes('/profiles/')
      );
      console.log(`Found ${profileAssets.length} profile assets`);

      // Track existing IDs to avoid duplicates
      const evidenceIds = new Set<string>();
      const profileIds = new Set<string>();

      // Create evidence items
      const evidence: Evidence[] = evidenceAssets
        .map((asset) => {
          const metadata = asset.metadata || {};
          const id = metadata.evidenceId || `ev-${nanoid(8)}`;

          // Avoid duplicates
          if (evidenceIds.has(id)) {
            return null;
          }
          evidenceIds.add(id);

          return {
            id,
            name:
              metadata.displayName ||
              path.basename(
                asset.relativePath,
                path.extname(asset.relativePath)
              ),
            description: metadata.description || '',
            imageAssetPath: asset.relativePath,
            detailImagePath: metadata.detailImagePath,
            type: metadata.type || 'Document',
            isInitiallyHidden: metadata.isInitiallyHidden || false,
            itemType: 'evidence',
          };
        })
        .filter(Boolean) as Evidence[];

      // Create profile items
      const profiles: Profile[] = profileAssets
        .map((asset) => {
          const metadata = asset.metadata || {};
          const id = metadata.profileId || `prof-${nanoid(8)}`;

          // Avoid duplicates
          if (profileIds.has(id)) {
            return null;
          }
          profileIds.add(id);

          return {
            id,
            name:
              metadata.displayName ||
              path.basename(
                asset.relativePath,
                path.extname(asset.relativePath)
              ),
            age: metadata.age || 'Unknown',
            description: metadata.description || '',
            imageAssetPath: asset.relativePath,
            isInitiallyHidden: metadata.isInitiallyHidden || false,
            itemType: 'profile',
          };
        })
        .filter(Boolean) as Profile[];

      // Add evidence IDs that don't have associated images
      if (currentProject.evidence && Array.isArray(currentProject.evidence)) {
        currentProject.evidence.forEach((id) => {
          if (evidenceIds.has(id)) return;

          console.log(`Evidence ID without associated image: ${id}`);
          evidenceIds.add(id);

          evidence.push({
            id,
            name: id,
            description: 'Missing image',
            imageAssetPath: '',
            type: 'Document',
            isInitiallyHidden: false,
            itemType: 'evidence',
          });
        });
      }

      // Add profile IDs that don't have associated images
      if (currentProject.profiles && Array.isArray(currentProject.profiles)) {
        currentProject.profiles.forEach((id) => {
          if (profileIds.has(id)) return;

          console.log(`Profile ID without associated image: ${id}`);
          profileIds.add(id);

          profiles.push({
            id,
            name: id,
            age: 'Unknown',
            gender: 'Unknown',
            description: 'Missing image',
            imageAssetPath: '',
            isInitiallyHidden: false,
            itemType: 'profile',
          });
        });
      }

      console.log('Final evidence items:', evidence);
      console.log('Final profile items:', profiles);

      setEvidenceItems(evidence);
      setProfileItems(profiles);
      setIsLoading(false);
    }
  }, [currentProject, assets]);

  // Filter items by search term
  const filteredEvidence = useMemo(() => {
    return evidenceItems.filter((item) => {
      const lowerSearchTerm = searchTerm?.toLowerCase() || '';
      return (
        (item.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (item.description?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (item.type?.toLowerCase() || '').includes(lowerSearchTerm)
      );
    });
  }, [evidenceItems, searchTerm]);

  const filteredProfiles = useMemo(() => {
    return profileItems.filter((item) => {
      const lowerSearchTerm = searchTerm?.toLowerCase() || '';
      return (
        (item.name?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (item.description?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (item.age?.toLowerCase() || '').includes(lowerSearchTerm) ||
        (item.gender?.toLowerCase() || '').includes(lowerSearchTerm)
      );
    });
  }, [profileItems, searchTerm]);

  // Get asset path - uses resolveAssetPath from the hook
  const getAssetPath = (assetPath: string) => {
    if (!assetPath) {
      return '';
    }

    return resolveAssetPath(assetPath);
  };

  // Recreate all items from the folder - useful for recovery
  const recreateAllItems = () => {
    if (!currentProject) return;

    setIsLoading(true);

    // Get all evidence and profile assets
    const evidenceAssets = assets.filter((asset) =>
      asset.relativePath.includes('/evidences/')
    );

    const profileAssets = assets.filter((asset) =>
      asset.relativePath.includes('/profiles/')
    );

    updateProject((draft) => {
      // Ensure metadata structure exists
      if (!draft.assetMetadata) {
        draft.assetMetadata = {};
      }

      // Ensure arrays exist
      if (!draft.evidence) draft.evidence = [];
      if (!draft.profiles) draft.profiles = [];

      // Process evidence assets
      evidenceAssets.forEach((asset) => {
        const id = `ev-${nanoid(8)}`;
        draft.evidence.push(id);

        const displayName = path.basename(
          asset.relativePath,
          path.extname(asset.relativePath)
        );

        if (!draft.assetMetadata) {
          draft.assetMetadata = {};
        }

        draft.assetMetadata[asset.relativePath] = {
          ...(draft.assetMetadata[asset.relativePath] || {}),
          displayName,
          category: 'evidence',
          evidenceId: id,
          type: 'Document',
          isInitiallyHidden: false,
        };
      });

      // Process profile assets
      profileAssets.forEach((asset) => {
        const id = `prof-${nanoid(8)}`;
        draft.profiles.push(id);

        const displayName = path.basename(
          asset.relativePath,
          path.extname(asset.relativePath)
        );

        if (!draft.assetMetadata) {
          draft.assetMetadata = {};
        }

        draft.assetMetadata[asset.relativePath] = {
          ...(draft.assetMetadata[asset.relativePath] || {}),
          displayName,
          category: 'profile',
          profileId: id,
          age: 'Unknown',
          gender: 'Unknown',
          isInitiallyHidden: false,
        };
      });

      // Ensure folder structure
      if (!draft.folders) {
        draft.folders = {
          img: {
            backgrounds: [],
            characters: [],
            profiles: [],
            evidences: [],
            ui: [],
            effects: [],
          },
          audio: {
            bgm: [],
            voices: [],
            sfx: [],
          },
          documents: [],
          data: [],
        };
      } else if (!draft.folders.img) {
        draft.folders.img = {
          backgrounds: [],
          characters: [],
          profiles: [],
          evidences: [],
          ui: [],
          effects: [],
        };
      }

      // Update folder references
      if (draft.folders && draft.folders.img) {
        draft.folders.img.evidences = evidenceAssets.map(
          (asset) => asset.relativePath
        );
        draft.folders.img.profiles = profileAssets.map(
          (asset) => asset.relativePath
        );
      }
    });

    // Reload will happen automatically via the effect hooks
  };

  // Get folder paths for display
  const evidenceFolderPath = currentProject?.projectFolderPath
    ? path.join(currentProject.projectFolderPath, 'img', 'evidences')
    : '';

  const profileFolderPath = currentProject?.projectFolderPath
    ? path.join(currentProject.projectFolderPath, 'img', 'profiles')
    : '';

  if (isLoading || assetsLoading) {
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
            </div>
          </div>

          {/* Folder path display */}
          <div className="mt-4">
            {activeTab === 'evidence' && evidenceFolderPath && (
              <AssetPathDisplay folderPath={evidenceFolderPath} />
            )}

            {activeTab === 'profiles' && profileFolderPath && (
              <AssetPathDisplay folderPath={profileFolderPath} />
            )}
          </div>

          {/* Evidence Tab Content */}
          <TabsContent value="evidence" className="mt-4">
            {filteredEvidence.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-0.5">
                {filteredEvidence.map((evidence) => (
                  <Card
                    key={evidence.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col w-28 h-24"
                  >
                    <div className="relative w-full h-16 bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          getAssetPath(evidence.imageAssetPath) ||
                          '/assets/images/ui/placeholder.png'
                        }
                        alt={evidence.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/assets/images/ui/placeholder.png';
                          e.currentTarget.alt = 'Image not found';
                        }}
                      />
                    </div>

                    <div className="p-1 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h4 className="text-white font-medium text-xs truncate mb-0">
                                {evidence.name}
                              </h4>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-blue-800">
                              <p>{evidence.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <p className="text-blue-300 mb-2">No evidence found</p>
                <p className="text-blue-400 text-sm mb-4">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add evidence items using the button above'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {assets.some((asset) =>
                    asset.relativePath.includes('/evidences/')
                  ) && (
                    <Button
                      variant="outline"
                      className="bg-yellow-700 border-yellow-600 text-white hover:bg-yellow-600"
                      onClick={recreateAllItems}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Recreate All Items
                    </Button>
                  )}
                </div>

                {assets.some((asset) =>
                  asset.relativePath.includes('/evidences/')
                ) && (
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg max-w-2xl mx-auto">
                    <p className="text-yellow-300 font-medium mb-2">
                      Issue Detected
                    </p>
                    <p className="text-yellow-200 text-sm mb-2">
                      There are evidence images in the folder, but no items are
                      displayed. This may be due to a synchronization issue.
                    </p>
                    <p className="text-yellow-200 text-sm">
                      Try clicking &quot;Recreate All Items&quot; to recreate
                      all items from the images.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>

          {/* Profiles Tab Content */}
          <TabsContent value="profiles" className="mt-4">
            {filteredProfiles.length > 0 ? (
              <div className="grid grid-cols-[repeat(auto-fill,minmax(7rem,1fr))] gap-0.5">
                {filteredProfiles.map((profile) => (
                  <Card
                    key={profile.id}
                    className="bg-blue-950 border-blue-800 overflow-hidden flex flex-col w-28 h-24"
                  >
                    <div className="relative w-full h-16 bg-blue-900/30 flex items-center justify-center overflow-hidden">
                      <img
                        src={
                          getAssetPath(profile.imageAssetPath) ||
                          '/assets/images/ui/placeholder.png'
                        }
                        alt={profile.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src =
                            '/assets/images/ui/placeholder.png';
                          e.currentTarget.alt = 'Image not found';
                        }}
                      />
                    </div>

                    <div className="p-1 flex-1 flex flex-col">
                      <div className="flex justify-between items-start">
                      <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h4 className="text-white font-medium text-xs truncate mb-0">
                                {profile.name}
                              </h4>
                            </TooltipTrigger>
                            <TooltipContent side="bottom" className="bg-blue-800">
                              <p>{profile.name}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-blue-900/20 rounded-lg border border-blue-800/50">
                <p className="text-blue-300 mb-2">No profiles found</p>
                <p className="text-blue-400 text-sm mb-4">
                  {searchTerm
                    ? 'Try a different search term'
                    : 'Add character profiles using the button above'}
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  {assets.some((asset) =>
                    asset.relativePath.includes('/profiles/')
                  ) && (
                    <Button
                      variant="outline"
                      className="bg-yellow-700 border-yellow-600 text-white hover:bg-yellow-600"
                      onClick={recreateAllItems}
                    >
                      <FileCheck className="h-4 w-4 mr-2" />
                      Recreate All Items
                    </Button>
                  )}
                </div>

                {assets.some((asset) =>
                  asset.relativePath.includes('/profiles/')
                ) && (
                  <div className="mt-4 p-3 bg-yellow-900/30 border border-yellow-800 rounded-lg max-w-2xl mx-auto">
                    <p className="text-yellow-300 font-medium mb-2">
                      Issue Detected
                    </p>
                    <p className="text-yellow-200 text-sm mb-2">
                      There are profile images in the folder, but no items are
                      displayed. This may be due to a synchronization issue.
                    </p>
                    <p className="text-yellow-200 text-sm">
                      Try clicking &quot;Recreate All Items&quot; to recreate
                      all items from the images.
                    </p>
                  </div>
                )}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
