import { AnyRelationship, GetRelationship } from '@types';

export const extractRelationship = <
  Relationships extends AnyRelationship[],
  Type extends Relationships[number]['type'],
>(
  relationships: Relationships,
  type: Type,
) => {
  return relationships.filter(
    relationship => relationship.type === type,
  ) as GetRelationship<Type>[];
};
