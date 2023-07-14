import React, {
  ComponentProps,
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
} from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import {
  Gesture,
  GestureDetector,
  GestureType,
} from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

type ViewProps = ComponentProps<typeof View>;

interface Props extends ViewProps {
  zoomScale?: {
    min: number;
    max: number;
  };
  onZoomBegin?: () => void;
  onZoomEnd?: () => void;
  simultaneousGesture?: GestureType;
}

export interface ZoomRef {
  zoomOut: () => void;
  isZoomed: () => boolean;
}

const Zoom = forwardRef<ZoomRef, Props>(
  (
    {
      zoomScale = { min: 0.7, max: 3 },
      onZoomBegin = () => {},
      onZoomEnd = () => {},
      onLayout,
      children,
      style,
      simultaneousGesture,
      ...viewProps
    },
    ref,
  ) => {
    const translate = useSharedValue({ x: 0, y: 0 });
    const scale = useSharedValue(1);
    const origin = useSharedValue({ x: 0, y: 0 });

    const panTranslation = useSharedValue({ x: 0, y: 0 });
    const pinchScale = useSharedValue(1);
    const ctx = useSharedValue({
      translate: { x: 0, y: 0 },
      scale: 1,
    });

    const state = useSharedValue({
      isZoomed: false,
      isPinching: false,
    });

    const childDimensions = useSharedValue({ width: 0, height: 0 });

    const resetZoom = useCallback(() => {
      'worklet';
      translate.value = withTiming({ x: 0, y: 0 });
      scale.value = withTiming(1);

      origin.value = { x: 0, y: 0 };
      panTranslation.value = { x: 0, y: 0 };

      ctx.value = {
        translate: { x: 0, y: 0 },
        scale: 1,
      };

      state.value = {
        isZoomed: false,
        isPinching: false,
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useImperativeHandle(
      ref,
      () => ({
        zoomOut: resetZoom,
        isZoomed: () => {
          'worklet';
          return state.value.isZoomed;
        },
      }),
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [resetZoom],
    );

    useDerivedValue(() => {
      if (!state.value.isZoomed && scale.value !== 1) {
        state.value.isZoomed = true;
        onZoomBegin && runOnJS(onZoomBegin)();
        return;
      } else if (state.value.isZoomed && scale.value === 1) {
        state.value.isZoomed = false;
        onZoomEnd && runOnJS(onZoomEnd)();
        return;
      }
    }, [onZoomBegin, onZoomEnd]);

    const gesture = useMemo(() => {
      const panGesture = Gesture.Pan()
        .onStart(() => {
          if (!state.value.isZoomed || state.value.isPinching) {
            return;
          }

          cancelAnimation(translate);
          cancelAnimation(scale);

          const { x, y } = translate.value;
          ctx.value.translate = {
            x,
            y,
          };
        })
        .onUpdate(e => {
          if (!state.value.isZoomed || state.value.isPinching) {
            panTranslation.value = { x: 0, y: 0 };
            return;
          }

          const maxTranslateX =
            (childDimensions.value.width / 2) * scale.value -
            childDimensions.value.width / 2;
          const minTranslateX = -maxTranslateX;

          const maxTranslateY =
            (childDimensions.value.height / 2) * scale.value -
            childDimensions.value.height / 2;
          const minTranslateY = -maxTranslateY;

          const nextTranslateX =
            ctx.value.translate.x + e.translationX - panTranslation.value.x;
          const nextTranslateY =
            ctx.value.translate.y + e.translationY - panTranslation.value.x;

          let x;
          let y;

          if (nextTranslateX > maxTranslateX) {
            x = maxTranslateX;
          } else if (nextTranslateX < minTranslateX) {
            x = minTranslateX;
          } else {
            x = nextTranslateX;
          }

          if (nextTranslateY > maxTranslateY) {
            y = maxTranslateY;
          } else if (nextTranslateY < minTranslateY) {
            y = minTranslateY;
          } else {
            y = nextTranslateY;
          }

          translate.value = {
            x,
            y,
          };
        })
        .onEnd(() => {
          if (!state.value.isZoomed || state.value.isPinching) {
            return;
          }

          panTranslation.value = { x: 0, y: 0 };
        });

      const pinchGesture = Gesture.Pinch()
        .onStart(() => {
          cancelAnimation(translate);
          cancelAnimation(scale);

          ctx.value.scale = scale.value;
          pinchScale.value = scale.value;
        })
        .onUpdate(e => {
          if (e.numberOfPointers === 1 && state.value.isPinching) {
            const { x, y } = translate.value;
            ctx.value.translate = {
              x,
              y,
            };
            state.value.isPinching = false;
          }

          if (e.numberOfPointers > 2) {
            return;
          }

          const newScale = ctx.value.scale * e.scale;

          if (newScale < zoomScale.min || newScale > zoomScale.max) {
            return;
          }

          scale.value = newScale;

          if (!state.value.isPinching) {
            state.value.isPinching = true;
            origin.value = {
              x: e.focalX,
              y: e.focalY,
            };
            ctx.value = {
              ...ctx.value,
              translate: { x: translate.value.x, y: translate.value.y },
            };
            pinchScale.value = scale.value;
          }

          if (state.value.isPinching) {
            const x =
              ctx.value.translate.x +
              -(
                (scale.value - pinchScale.value) *
                (origin.value.x - childDimensions.value.width / 2)
              );

            const y =
              ctx.value.translate.y +
              -(
                (scale.value - pinchScale.value) *
                (origin.value.y - childDimensions.value.height / 2)
              );

            translate.value = {
              x,
              y,
            };
          }
        })
        .onEnd(() => {
          state.value.isPinching = false;
          ctx.value.translate = translate.value;
        });

      const doubleTapGesture = Gesture.Tap()
        .onStart(e => {
          if (scale.value !== 1) {
            resetZoom();
            return;
          }

          const { width, height } = childDimensions.value;

          scale.value = withTiming(zoomScale.max);
          translate.value = withTiming({
            x: -(zoomScale.max * (e.x - width / 2)),
            y: -(zoomScale.max * (e.y - height / 2)),
          });
        })
        .numberOfTaps(2);

      return Gesture.Race(
        simultaneousGesture || Gesture.Race(),
        doubleTapGesture,
        Gesture.Simultaneous(panGesture, pinchGesture),
      );

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoomScale, simultaneousGesture]);

    const animatedStyle = useAnimatedStyle(() => {
      return {
        transform: [
          { translateX: translate.value.x },
          { translateY: translate.value.y },
          { scale: scale.value },
        ],
      };
    }, []);

    const _onLayout = useCallback(
      (e: LayoutChangeEvent) => {
        const { width, height } = e.nativeEvent.layout;

        childDimensions.value = { width, height };

        onLayout && onLayout(e);
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [onLayout],
    );

    return (
      <GestureDetector gesture={gesture}>
        <Animated.View
          style={[animatedStyle, style]}
          onLayout={_onLayout}
          {...viewProps}>
          {children}
        </Animated.View>
      </GestureDetector>
    );
  },
);

export default Zoom;
