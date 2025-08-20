export interface Tweet {
  type: string;
  id: string;
  url: string;
  text: string;
  source: string;
  retweetCount: number;
  replyCount: number;
  likeCount: number;
  quoteCount: number;
  viewCount: number;
  createdAt: string;
  lang: string;
  bookmarkCount: number;
  isReply: boolean;
  inReplyToId: string;
  conversationId: string;
  inReplyToUserId: string;
  inReplyToUsername: string;
  author: User;
  entities: Entities;
  quoted_tweet: any;
  retweeted_tweet: any;
}

export interface User {
  type: string;
  userName: string;
  url: string;
  id: string;
  name: string;
  isBlueVerified: boolean;
  profilePicture: string;
  coverPicture: string;
  description: string;
  location: string;
  followers: number;
  following: number;
  canDm: boolean;
  createdAt: string;
  favouritesCount: number;
  hasCustomTimelines: boolean;
  isTranslator: boolean;
  mediaCount: number;
  statusesCount: number;
  withheldInCountries: string[];
  affiliatesHighlightedLabel: any;
  possiblySensitive: boolean;
  pinnedTweetIds: string[];
  isAutomated: boolean;
  automatedBy: string;
  unavailable: boolean;
  message: string;
  unavailableReason: string;
  profile_bio: ProfileBio;
}

export interface ProfileBio {
  description: string;
  entities: BioEntities;
}

export interface BioEntities {
  description: DescriptionEntities;
  url: UrlEntities;
}

export interface DescriptionEntities {
  urls: Url[];
}

export interface UrlEntities {
  urls: Url[];
}

export interface Url {
  display_url: string;
  expanded_url: string;
  indices: number[];
  url: string;
}

export interface Entities {
  hashtags: Hashtag[];
  urls: Url[];
  user_mentions: UserMention[];
}

export interface Hashtag {
  indices: number[];
  text: string;
}

export interface UserMention {
  id_str: string;
  name: string;
  screen_name: string;
}

export interface LastTweetsResponse {
  data: {
    pin_tweet: Tweet[];
    tweets: Tweet[];
  };
  has_next_page: boolean;
  next_cursor: string;
  status: string;
  msg: string;
  code: number;
}


export interface UserFollowersResponse {
  data: {
    followers: User[];
  };
  has_next_page: boolean;
  next_cursor: string;
  status: string;
  msg: string;
  code: number;
}

export interface CheckFollowRelationshipResponse {
  status: string;
  message: string;
  data: {
    following: boolean;
    followed_by: boolean;
  };
}
