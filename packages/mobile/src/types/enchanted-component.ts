import { Model, Query } from "@nozbe/watermelondb";

type RemoveArrayElement<T> = T extends Array<infer U>
  ? U
  : T extends ReadonlyArray<infer U>
  ? U
  : T;

// to fix the issue with hook withObservables from watermelondb
// that causes 'any' return type, we need to create a custom type
// that will be used in place of the original withObservables
export type EnchantedComponent<
  Props extends {},
  ObservableProps extends Array<keyof Props>,
> = (
  props: Pick<Props, Exclude<keyof Props, ObservableProps[number]>> & {
    [K in keyof Pick<Props, ObservableProps[number]>]: Query<
      RemoveArrayElement<Props[K]> extends Model
        ? RemoveArrayElement<Props[K]>
        : never
    >;
  },
) => React.JSX.Element;