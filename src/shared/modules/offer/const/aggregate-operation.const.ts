import { SortType } from '../../../types/sort-type.enum.js';

const AGREGATE_OFFERS_OPERATIONS = {
  USER_LOOKUP: {
    $lookup: {
      from: 'user',
      localField: 'userId',
      foreignField: '_id',
      as: 'userId',
    }
  },
  UNWIND_USER: {
    $unwind: {
      path: '$userId',
      preserveNullAndEmptyArrays: true,
    }
  },
  ADD_OFFER_ID: {
    $addFields: {
      id: { $toString: '$_id' }
    }
  },
  ADD_IS_FAVOURITES_FIELD: {
    $addFields: {
      id: { $toString: '$_id' },
      favorites: '$thisUser.favorites',
      isFavourites: {
        $in: ['$id', '$thisUser.favorites']
      }
    }
  },
  COMMENTS_LOOKUP: {
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'offerId',
      as: 'comments'
    }
  },
  ADD_COMMENTS_INFO_FIELDS: {
    $addFields: {
      commentsCount: { $size: '$comments' },
      rating:  { $round: [{ $avg: '$comments.rating' }, 1] }
    }
  },
  DELETE_COMMENTS_FIELD:{
    $unset: 'comments'
  },
  SORT_DOWN: {
    $sort: { createdDate: SortType.DOWN }
  },
  SORT_UP: {
    $sort: { createdDate: SortType.UP }
  }
};

export default AGREGATE_OFFERS_OPERATIONS;

