export const identifyRepresentation = (id: number) => {
  switch (id) {
    case 0:
      return 'Vendredi 5 juin';

    case 1:
      return 'Samedi 6 juin';

    default:
      throw new Error('Incorrect representation format');
  }
};
