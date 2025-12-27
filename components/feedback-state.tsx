import { MaterialIcons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface FeedbackStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
  iconName?: string;
}

export function FeedbackState({ title, message, actionLabel, onAction, iconName = 'error-outline' }: FeedbackStateProps) {
  return (
    <View style={styles.container}>
      <MaterialIcons name={iconName as never} size={40} color="#b45309" />
      <Text style={[styles.textBase, styles.title]}>{title}</Text>
      {message ? <Text style={[styles.textBase, styles.message]}>{message}</Text> : null}
      {actionLabel ? (
        <Pressable onPress={onAction} style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}>
          <Text style={[styles.textBase, styles.buttonLabel]}>{actionLabel}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  textBase: {
    fontSize: 16,
    color: '#111827',
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  message: {
    textAlign: 'center',
    color: '#6b7280',
  },
  button: {
    borderRadius: 999,
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#11181C10',
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonLabel: {
    textAlign: 'center',
    fontWeight: '600',
  },
});
