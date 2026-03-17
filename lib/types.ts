export type Page<T> = {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
};

export type UserDto = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string | null;
  birthday?: string | null;
  badgeLevel?: string | null;
  streakCount?: number | null;
  friendsCount?: number | null;
  imagesCount?: number | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  lastActive?: string | null;
  isOnline?: boolean | null;
  role?: string | null;
  subscriptionPlan?: string | null;
  subscriptionExpiresAt?: string | null;
  aiRequestsToday?: number | null;
};

export type UpdateSubscriptionRequest = {
  plan: "FREE" | "SILVER" | "GOLD";
  durationDays: number;
};

export type PhotoDto = {
  id: string;
  ownerId: string;
  ownerName?: string | null;
  albumId?: string | null;
  albumName?: string | null;
  filePath?: string | null;
  thumbnailPath?: string | null;
  s3Key?: string | null;
  s3ThumbnailKey?: string | null;
  caption?: string | null;
  note?: string | null;
  location?: string | null;
  tags?: string[] | null;
  quality?: string | null;
  source?: string | null;
  fileSize?: number | null;
  season?: string | null;
  likeCount?: number | null;
  commentCount?: number | null;
  isShared?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AlbumDto = {
  id: string;
  name: string;
  description?: string | null;
  coverImageUrl?: string | null;
  creatorId: string;
  creatorName?: string | null;
  filesCount?: number | null;
  isFavorite?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

export type AdminStats = {
  usersCount: number;
  photosCount: number;
  albumsCount: number;
  photosBySource: Record<string, number>;
  photosByQuality: Record<string, number>;
  usersByBadge: Record<string, number>;
  registrationsByMonth: Record<string, number>;
  photosByMonth: Record<string, number>;
};
