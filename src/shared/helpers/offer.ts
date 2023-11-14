import { HousingType, Comfort, Cities, Offer, UserType } from '../types/index.js';
import { PARSE_INTEGER_OPTION } from './parse-integer.const.js';

export function createOffer(offerData: string): Offer {
  const [
    title,
    description,
    createdDate,
    city,
    previewImage,
    images,
    isPremium,
    isFavorites,
    rating,
    housingType,
    rooms,
    guestsNumber,
    price,
    comfort,
    userName,
    userEmail,
    userAvatar,
    userType,
    comments,
    coordinates
  ] = offerData.replace('\n', '').split('\t');

  const user = {
    name: userName,
    email: userEmail,
    avatarPath: userAvatar,
    type: userType as UserType
  };

  return {
    title,
    description,
    createdDate: new Date(createdDate),
    city: city as Cities,
    previewImage,
    images: images.split(','),
    isPremium: isPremium === 'true',
    isFavourites: isFavorites === 'true',
    rating: Number(rating),
    housingType: housingType as HousingType,
    rooms: Number.parseInt(rooms, PARSE_INTEGER_OPTION),
    guestsNumber: Number.parseInt(guestsNumber, PARSE_INTEGER_OPTION),
    price: Number.parseInt(price, PARSE_INTEGER_OPTION),
    comfort: comfort.split(',').map((comfortType) => comfortType as Comfort),
    user,
    comments: Number.parseInt(comments, PARSE_INTEGER_OPTION),
    coordinates: coordinates.split(',').map((coordinate) => Number(coordinate))
  };
}
