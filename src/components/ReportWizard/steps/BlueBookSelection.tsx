/**
 * Step 1: Blue Book Selection
 * Allows users to select SSA Blue Book listings that apply to their disability
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Search, X, ChevronDown, ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Alert } from '@/components/ui/Alert';
import { cn } from '@/utils/cn';
import { useWizard } from '../WizardContext';
import { indexedDBService } from '@/services/storage/IndexedDBService';
import type { BlueBookListing } from '@/types/storage';

export const BlueBookSelection: React.FC = () => {
  const { draftData, updateDraftData } = useWizard();
  const [listings, setListings] = useState<BlueBookListing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['1.00']));
  const [selectedListingIds, setSelectedListingIds] = useState<Set<string>>(
    new Set(draftData.selectedBlueBookListings || [])
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBlueBookListings();
  }, []);

  const loadBlueBookListings = async () => {
    try {
      console.log('[BlueBookSelection] Loading listings from IndexedDB...');
      const cached = await indexedDBService.getAllBlueBookListings();
      console.log('[BlueBookSelection] Loaded', cached.length, 'listings');
      console.log('[BlueBookSelection] Sample listing:', cached[0]);
      setListings(cached);
    } catch (error) {
      console.error('[BlueBookSelection] Failed to load Blue Book listings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Group listings by category
  const categorizedListings = useMemo(() => {
    const categories = new Map<string, BlueBookListing[]>();

    listings.forEach((listing) => {
      const category = listing.listingId;
      if (!categories.has(category)) {
        categories.set(category, []);
      }
      categories.get(category)!.push(listing);
    });

    return Array.from(categories.entries()).map(([category, items]) => ({
      id: category,
      name: items[0].listing_name,
      listings: items,
    }));
  }, [listings]);

  // Filter listings based on search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categorizedListings;

    const query = searchQuery.toLowerCase();
    return categorizedListings
      .map((category) => ({
        ...category,
        listings: category.listings.filter(
          (listing) =>
            listing.listing_name.toLowerCase().includes(query) ||
            listing.title.toLowerCase().includes(query) ||
            listing.content_excerpt?.toLowerCase().includes(query)
        ),
      }))
      .filter((category) => category.listings.length > 0);
  }, [categorizedListings, searchQuery]);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleListing = (listingId: string) => {
    setSelectedListingIds((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }

      // Update wizard data
      updateDraftData({
        selectedBlueBookListings: Array.from(next),
      });

      return next;
    });
  };

  const clearSelection = () => {
    setSelectedListingIds(new Set());
    updateDraftData({
      selectedBlueBookListings: [],
    });
  };

  const selectedListings = useMemo(
    () => listings.filter((l) => selectedListingIds.has(l.listingId)),
    [listings, selectedListingIds]
  );

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
        <p className="text-text-muted">Loading Blue Book listings...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-2">Select Blue Book Listings</h2>
        <p className="text-text-muted">
          Choose the SSA Blue Book listings that apply to your disability. You can select multiple
          listings.
        </p>
      </div>

      {selectedListings.length > 0 && (
        <Alert variant="success">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-semibold">
                {selectedListings.length} listing{selectedListings.length !== 1 ? 's' : ''} selected
              </p>
              <p className="text-sm mt-1">
                {selectedListings.map((l) => l.listing_name).join(', ')}
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={clearSelection}>
              Clear All
            </Button>
          </div>
        </Alert>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Selection Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-5 w-5 text-text-muted" />
            <Input
              type="text"
              placeholder="Search listings by name or keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Categories Accordion */}
          <div className="space-y-2">
            {filteredCategories.length === 0 ? (
              <div className="text-center py-8 text-text-muted">
                No listings found matching "{searchQuery}"
              </div>
            ) : (
              filteredCategories.map((category) => (
                <div key={category.id} className="border border-border rounded-lg overflow-hidden">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleCategory(category.id)}
                    className="w-full flex items-center justify-between p-4 hover:bg-surface transition-colors text-left"
                  >
                    <div className="flex items-center gap-3">
                      {expandedCategories.has(category.id) ? (
                        <ChevronDown className="h-5 w-5 text-text-muted flex-shrink-0" />
                      ) : (
                        <ChevronRight className="h-5 w-5 text-text-muted flex-shrink-0" />
                      )}
                      <div>
                        <p className="font-semibold">
                          {category.id} - {category.name}
                        </p>
                        <p className="text-sm text-text-muted">
                          {category.listings.length} listing{category.listings.length !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    {category.listings.some((l) => selectedListingIds.has(l.listingId)) && (
                      <Badge variant="success">Selected</Badge>
                    )}
                  </button>

                  {/* Category Listings */}
                  {expandedCategories.has(category.id) && (
                    <div className="border-t border-border bg-surface/50">
                      {category.listings.map((listing) => {
                        const isSelected = selectedListingIds.has(listing.listingId);

                        return (
                          <label
                            key={listing.listingId}
                            className={cn(
                              'flex items-start gap-3 p-4 border-b border-border last:border-b-0 cursor-pointer hover:bg-background transition-colors',
                              isSelected && 'bg-primary/5'
                            )}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => toggleListing(listing.listingId)}
                              className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium">{listing.title}</p>
                              {listing.content_excerpt && (
                                <p className="text-sm text-text-muted mt-1 line-clamp-2">
                                  {listing.content_excerpt}
                                </p>
                              )}
                              <a
                                href={listing.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-primary hover:underline mt-2 inline-block"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View official listing →
                              </a>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Selected Listings Sidebar */}
        <div className="lg:col-span-1">
          <div className="sticky top-4 border border-border rounded-lg p-4 bg-surface">
            <h3 className="font-semibold mb-3 flex items-center justify-between">
              <span>Selected Listings</span>
              {selectedListings.length > 0 && (
                <Badge variant="default">{selectedListings.length}</Badge>
              )}
            </h3>

            {selectedListings.length === 0 ? (
              <p className="text-sm text-text-muted text-center py-8">
                No listings selected yet. Choose from the categories on the left.
              </p>
            ) : (
              <div className="space-y-2">
                {selectedListings.map((listing) => (
                  <div
                    key={listing.listingId}
                    className="flex items-start gap-2 p-2 rounded-md bg-background border border-border"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{listing.listing_name}</p>
                      <p className="text-xs text-text-muted">{listing.listingId}</p>
                    </div>
                    <button
                      onClick={() => toggleListing(listing.listingId)}
                      className="flex-shrink-0 p-1 hover:bg-surface rounded transition-colors"
                      aria-label="Remove listing"
                    >
                      <X className="h-4 w-4 text-text-muted" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
