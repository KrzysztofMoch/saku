import React, {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useState,
} from 'react';
import { Modal, Pressable, StyleSheet, ViewProps } from 'react-native';

import { Colors, hexOpacity } from '@saku/shared';

interface Props extends React.PropsWithChildren {
  onClose?: () => void;
  style?: ViewProps['style'];
}

export interface OverlayRef {
  open: () => void;
  close: () => void;
}

const Overlay = forwardRef<OverlayRef, Props>(
  ({ children, onClose, style }, ref) => {
    const [visible, setVisible] = useState(false);

    const _onClose = useCallback(() => {
      () => {
        setVisible(false);
        onClose && onClose();
      };
    }, [onClose]);

    useImperativeHandle(
      ref,
      () => {
        return {
          open: () => setVisible(true),
          close: _onClose,
        };
      },
      [_onClose],
    );

    return (
      <Modal visible={visible} transparent={true} animationType="fade">
        <Pressable onPress={_onClose} style={s.overlay}>
          <Pressable style={[s.container, style]}>{children}</Pressable>
        </Pressable>
      </Modal>
    );
  },
);

export default Overlay;

const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: hexOpacity(Colors.BLACK, 0.7),
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '86%',
    height: '40%',
    backgroundColor: Colors.BLACK_LIGHT,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'column',
  },
});
