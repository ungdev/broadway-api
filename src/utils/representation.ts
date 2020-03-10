export const identifyRepresentation = (id: number) => {
  switch (id) {
    case 0:
      return 'Vendredi 5 Juin';

    case 1:
      return 'Samedi 6 Juin';

    default:
      throw new Error('Incorrect representation format');
  }
};
